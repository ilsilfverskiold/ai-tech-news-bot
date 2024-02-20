'use strict';

const utils = require('./utils');

/**
 * Validate a publish event(s) request
 * @param {Object|Object[]} event An event object, or if publishing a batch of events, an array of event objects.
 */
function validate(event) {
  if (!event) {
    throw new Error('An "event" is required');
  }
  if (typeof event !== 'object') {
    throw new Error('The "event" argument must be an object');
  }

  const validateObject = ({ event: type }) => {
    if (!type || typeof type !== 'string') {
      throw new Error(
        'The "event" property containing the event type is required and must be a string'
      );
    }
  };

  if (Array.isArray(event)) {
    if (!event.length) {
      throw new Error('Event batch must be non empty');
    }

    let orgUid;
    let orgName;

    event.forEach((object) => {
      validateObject(object);
      if (
        orgUid &&
        (object.org_uid || object.orgUid) &&
        orgUid !== (object.org_uid || object.orgUid)
      ) {
        throw new Error('All events in batch must belong to the same org uid');
      }
      if (
        orgName &&
        (object.org_name || object.orgName) &&
        orgName !== (object.org_name || object.orgName)
      ) {
        throw new Error('All events in batch must belong to the same org name');
      }
      orgUid = object.org_uid || object.orgUid || orgUid;
      orgName = object.org_name || object.orgName || orgName;
    });

    if (orgUid) {
      event[0].orgUid = event[0].org_uid = orgUid;
    }
    if (orgName) {
      event[0].orgName = event[0].org_name = orgName;
    }
  } else {
    validateObject(event);
  }
  return event;
}

/**
 * Convert to a safe Serverless Platform Event
 * @param {Object|Object[]} event An event object, or if publishing a batch of events, an array of event objects.
 * @param {object} context SDK context that gets passed on to the event(s)
 * @param {string} accessKey Serverless Platform access key
 */
function transform(event, context, accessKey) {
  const safeEvent = (object) => ({
    event: object.event.trim(),
    user_uid: object.user_uid || object.userUid,
    stage_name: object.stage_name || object.stageName,
    app_name: object.app_name || object.appName,
    instance_name: object.instance_name || object.instanceName,
    component_name: object.component_name || object.componentName,
    component_version: object.component_version || object.componentVersion,
    data: object.data || {},
    created: object.created || Date.now(),
  });

  let transformed;
  if (Array.isArray(event)) {
    const safe = safeEvent({
      event: 'batch',
      data: event.map((object) => safeEvent(object)),
    });
    // Set batch metadata from sdk context (overridden by individual event metadata, if any)
    transformed = {
      ...safe,
      org_uid: event[0].orgUid || context.orgUid,
      org_name: event[0].orgName || context.orgName,
      stage_name: context.stageName,
      app_name: context.appName,
      instance_name: context.instanceName,
      component_name: context.componentName,
      component_version: context.componentVersion,
    };
  } else {
    const safe = safeEvent(event);
    // Add missing metdata from sdk context if required
    transformed = {
      ...safe,
      org_uid: event.org_uid || event.orgUid || context.orgUid,
      org_name: event.org_name || event.orgName || context.orgName,
      stage_name: safe.stage_name || context.stageName,
      app_name: safe.app_name || context.appName,
      instance_name: safe.instance_name || context.instanceName,
      component_name: safe.component_name || context.componentName,
      component_version: safe.component_version || context.componentVersion,
    };
  }

  if (!transformed.org_name && !transformed.org_uid) {
    throw new Error('Both event and SDK context are missing an org uid or name');
  }
  return {
    ...transformed,
    access_key: accessKey,
  };
}

/**
 * Send an event via the Websockets connection.
 * @param {Object|Object[]} event An event object, or if publishing a batch of events, an array of event objects.
 */
module.exports.send = (event, connection, context, accessKey) => {
  const safe = transform(validate(event), context, accessKey);
  if (!connection || !connection.isConnected()) {
    throw new Error('You are not currently connected to the Serverless Platform.');
  }
  connection.send(JSON.stringify(safe));
};

/**
 * Publish event(s) synchornously, via the HTTP API.
 * @param {Object|Object[]} event An event object, or if publishing a batch of events, an array of event objects.
 */
module.exports.publish = (event, domain, context, accessKey) => {
  return utils.request({
    endpoint: `${domain}/publish`,
    accessKey,
    method: 'POST',
    data: transform(validate(event), context),
  });
};

/**
 * Retrieve a Serverless Platform Event synchronously via HTTP API.
 * @param {string} eventUid UID of event to be fetched
 */
module.exports.get = (eventUid, domain, accessKey) => {
  return utils.request({
    endpoint: `${domain}/events/${eventUid}`,
    accessKey,
    method: 'GET',
  });
};

/**
 * Retrieve a Serverless Platform Event synchronously via HTTP API.
 * @param {string} domain Serverless Platform Events service domain name.
 * @param {Object} context Current SDK context.
 * @param {string} accessKey Serverless Platform access key.
 * @param {Object} options List options.
 */
module.exports.list = (domain, context, accessKey, options = {}) => {
  const {
    org_name: orgName = null,
    org_uid: orgUid = null,
    event = '*',
    limit = 10,
    created,
    starting_after: startingAfter,
  } = options;

  const params = new URLSearchParams({ event, limit });

  if (orgUid) {
    params.append('org_uid', orgUid);
  } else if (orgName) {
    params.append('org_name', orgName);
  } else if (context.orgUid) {
    params.append('org_uid', context.orgUid);
  } else if (context.orgName) {
    params.append('org_name', context.orgName);
  }
  if (!params.has('org_uid') && !params.has('org_name')) {
    throw new Error('Must pass in options or set SDK context for `org_uid`/`org_name`');
  }

  if (created) {
    if (new Set(['number', 'string']).has(typeof created)) {
      params.append('created.gt', created);
    } else if (typeof event !== 'object') {
      let valid = false;
      for (const comparator of ['gt', 'gte', 'lt', 'lte']) {
        if (created[comparator]) {
          params.append(`created.${comparator}`, created[comparator]);
          valid = true;
          break;
        }
      }
      if (!valid) {
        throw new Error("The 'created' dictionary parameter must have one of [gt|gte|lt|lte] set");
      }
    } else {
      throw new Error(
        "The 'created' parameter must be either a integer Unix timestamp or a dictionary"
      );
    }
  }

  if (startingAfter) {
    params.append('starting_after', startingAfter);
  }

  return utils.request({
    endpoint: `${domain}/events?${params.toString()}`,
    accessKey,
    method: 'GET',
  });
};
