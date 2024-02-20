'use strict';
const ms = require('ms');

/**
 * This function returns the difference in milliseconds between two ISO strings
 *
 * @param {string} startTime An ISO string
 * @param {string} endTime An ISO string
 * @returns difference in milliseconds
 */
const getSpanDuration = (startTime, endTime) => {
  return new Date(endTime).getTime() - new Date(startTime).getTime();
};

/**
 * This function takes in a console span, specifically an aws sdk span, and returns a formatted name
 *
 * @param {object} activity A console span object
 * @returns {string} The formatted span name
 */
const formatAWSSDKName = (activity) => {
  const { name } = activity;
  const [, , service, operation] = name.split('.');
  const duration = activity.durationFormatted ? `${activity.durationFormatted} • ` : '';
  if (name.includes('aws.sdk.dynamodb')) {
    return `${duration}AWS SDK • DynamoDB • ${operation.toUpperCase()}`;
  } else if (name.includes('aws.sdk.eventbridge')) {
    return `${duration}AWS SDK • Event Bridge • ${operation.toUpperCase()}`;
  } else if (name.includes('aws.sdk.secretsmanager')) {
    return `${duration}AWS SDK • Secrets Manager • ${operation.toUpperCase()}`;
  } else if (name.includes('aws.sdk.elastictranscoder')) {
    return `${duration}AWS SDK • Elastic Transcoder • ${operation.toUpperCase()}`;
  } else if (name.includes('aws.sdk.iotdata')) {
    return `${duration}AWS SDK • IOT Data • ${operation.toUpperCase()}`;
  } else if (name.includes('aws.sdk.kinesisvideo')) {
    return `${duration}AWS SDK • Kinesis Video • ${operation.toUpperCase()}`;
  } else if (name.includes('aws.sdk.kinesis.')) {
    return `${duration}AWS SDK • Kinesis • ${operation.toUpperCase()}`;
  }
  return `${duration}AWS SDK • ${service.toUpperCase()} • ${operation.toUpperCase()}`;
};

/**
 * This function takes in an http span object and returns a formatted name
 *
 * @param {object} activity A console span object
 * @returns {string} The formatted span name
 */
const formatHTTPName = (activity) => {
  let name = activity.durationFormatted ? `${activity.durationFormatted} • ` : '';
  name += 'HTTP';
  if (activity && activity.tags && activity.tags.http && activity.tags.http.method) {
    name += ` • ${activity.tags.http.method}`;
  }
  if (activity && activity.tags && activity.tags.http && activity.tags.http.path) {
    name += ` • ${activity.tags.http.path}`;
  }

  return name;
};

/**
 * This function takes in a console event object and returns a formatted event object
 *
 * @param {object} activity This is a console event object
 * @returns {{ message: string, payload: object }} The formatted event where the message can be used as a title and the payload is the JSON combination of the customTags and warning or error attributes
 */
const formatConsoleEvent = (activity) => {
  let message = 'Captured Event';
  let payload = {};
  const parsedTags = JSON.parse(activity.customTags);
  const customTags = Object.keys(parsedTags).length > 0 ? parsedTags : null;
  if (activity.eventName === 'telemetry.error.generated.v1') {
    payload = {
      ...activity.tags.error,
      customTags,
    };
    switch (activity.tags.error.type) {
      case 'ERROR_TYPE_CAUGHT_USER':
      case 'ERROR_TYPE_CAUGHT_SDK_INTERNAL':
      case 'ERROR_TYPE_CAUGHT_SDK_USER': {
        message = 'ERROR • Handled';
        break;
      }
      case 'ERROR_TYPE_UNCAUGHT': {
        message = 'ERROR • Unhandled';
        break;
      }
      case 'ERROR_TYPE_UNSPECIFIED':
      default: {
        message = 'ERROR • Unspecified';
      }
    }
  } else if (activity.eventName === 'telemetry.warning.generated.v1') {
    message = `WARNING • ${activity.tags.warning.message}`;
    payload = { ...activity.tags.warning, customTags };
    delete payload.stacktrace;
  }

  return {
    message,
    payload,
  };
};

/**
 * This function takes in a span object and returns the same span with a duration, durationFormatted, and niceName attribute
 *
 * @param {object} data Serverless console span object
 * @returns {object} Serverless console span object with additional attributes
 */
const formatConsoleSpan = (data) => {
  // Add nice names for the span types
  if (data.startTime && data.endTime) {
    data.duration = getSpanDuration(data.startTime, data.endTime);
    data.durationFormatted = data.duration ? ms(data.duration) : null;
  }
  const name = data.name;
  if (/aws\.sdk/.test(name)) {
    const niceName = formatAWSSDKName(data);
    data.niceName = niceName;
  } else if (name && (name.includes('node.http.request') || name.includes('node.https.request'))) {
    const niceName = formatHTTPName(data);
    data.niceName = niceName;
  } else {
    data.niceName = data.name;
  }
  return data;
};

/**
 * This function takes in a date object and returns a formatted date of HH:mm:ss:SSS
 *
 * @param {Date} date Javascript date object
 * @returns {string} Formatted date of HH:mm:ss:SSS
 */
const formatConsoleDate = (date) => {
  return date.toISOString().split('T')[1].replace('Z', '');
};

/**
 * This function will filter out broken and irrelevant data from the serverless console dev mode activity stream
 *
 * @param {Array} array This is an array of serverless console dev mode activity objects
 * @returns {Array} The filtered list of serverless console dev mode activity objects
 */
const omitAndSortDevModeActivity = (array) => {
  return array
    .filter((data) => {
      /**
       * Don't include the following
       * - No timestamp
       * - Not a valid object type
       * - Not a aws.sdk or http span
       * - message is a string (This would be a filter message from the log socket service)
       */
      if (!data.timestamp || data.timestamp === '') {
        return false;
      } else if (
        !['span', 'log', 'aws-lambda-request', 'aws-lambda-response', 'event'].includes(data.type)
      ) {
        return false;
      } else if (data.type === 'span') {
        if (
          !data.name.startsWith('aws.sdk') &&
          !data.name.startsWith('node.http.request') &&
          !data.name.startsWith('node.https.request')
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      // If times are the same we should fall back to the sequenceId
      if (
        new Date(b.timestamp).getTime() === new Date(a.timestamp || 0).getTime() &&
        a.type === 'log' &&
        b.type === 'log' &&
        a.tags &&
        b.tags &&
        a.tags.aws &&
        b.tags.aws
      ) {
        return a.tags.aws.sequenceId - b.tags.aws.sequenceId;
      } else if (new Date(b.timestamp).getTime() === new Date(a.timestamp || 0).getTime()) {
        return a.sequenceId - b.sequenceId;
      }
      return new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime();
    });
};

module.exports = {
  getSpanDuration,
  formatAWSSDKName,
  formatHTTPName,
  formatConsoleEvent,
  formatConsoleSpan,
  formatConsoleDate,
  omitAndSortDevModeActivity,
};
