'use strict';

const expect = require('chai').expect;
const ms = require('ms');
const consoleUi = require('../console-ui');

describe('Console UI', () => {
  describe('getSpanDuration()', () => {
    it('should return duration between two dates in milliseconds', () => {
      const startTime = new Date('2019-01-01T00:00:00.000Z');
      const endTime = new Date('2019-01-02T00:00:00.000Z');
      expect(consoleUi.getSpanDuration(startTime, endTime)).to.equal(1000 * 60 * 60 * 24);
    });
  });

  describe('formatAWSSDKName()', () => {
    it('should return default format for non curated services', () => {
      const serviceName = 's3';
      const fakeServiceOperation = 'fakeOperation';
      const activity = {
        name: `aws.sdk.${serviceName}.${fakeServiceOperation}`,
      };
      expect(consoleUi.formatAWSSDKName(activity)).to.equal(
        `AWS SDK • ${serviceName.toUpperCase()} • ${fakeServiceOperation.toUpperCase()}`
      );
    });

    it('should return default format for non curated services with duration', () => {
      const fakeServiceName = 'fakeService';
      const fakeServiceOperation = 'fakeOperation';
      const duration = '100 ms';
      const activity = {
        name: `aws.sdk.${fakeServiceName}.${fakeServiceOperation}`,
        durationFormatted: duration,
      };
      expect(consoleUi.formatAWSSDKName(activity)).to.equal(
        `${duration} • AWS SDK • ${fakeServiceName.toUpperCase()} • ${fakeServiceOperation.toUpperCase()}`
      );
    });

    it('should return curated format for dynamodb', () => {
      const serviceName = 'dynamodb';
      const fakeServiceOperation = 'fakeOperation';
      const activity = {
        name: `aws.sdk.${serviceName}.${fakeServiceOperation}`,
      };
      expect(consoleUi.formatAWSSDKName(activity)).to.equal(
        `AWS SDK • DynamoDB • ${fakeServiceOperation.toUpperCase()}`
      );
    });

    it('should return curated format for Event Bridge', () => {
      const serviceName = 'eventbridge';
      const fakeServiceOperation = 'fakeOperation';
      const activity = {
        name: `aws.sdk.${serviceName}.${fakeServiceOperation}`,
      };
      expect(consoleUi.formatAWSSDKName(activity)).to.equal(
        `AWS SDK • Event Bridge • ${fakeServiceOperation.toUpperCase()}`
      );
    });

    it('should return curated format for Secrets Manager', () => {
      const serviceName = 'secretsmanager';
      const fakeServiceOperation = 'fakeOperation';
      const activity = {
        name: `aws.sdk.${serviceName}.${fakeServiceOperation}`,
      };
      expect(consoleUi.formatAWSSDKName(activity)).to.equal(
        `AWS SDK • Secrets Manager • ${fakeServiceOperation.toUpperCase()}`
      );
    });

    it('should return curated format for Kinesis', () => {
      const serviceName = 'kinesis';
      const fakeServiceOperation = 'fakeOperation';
      const activity = {
        name: `aws.sdk.${serviceName}.${fakeServiceOperation}`,
      };
      expect(consoleUi.formatAWSSDKName(activity)).to.equal(
        `AWS SDK • Kinesis • ${fakeServiceOperation.toUpperCase()}`
      );
    });

    it('should return curated format for Elastic Transcoder', () => {
      const serviceName = 'elastictranscoder';
      const fakeServiceOperation = 'fakeOperation';
      const activity = {
        name: `aws.sdk.${serviceName}.${fakeServiceOperation}`,
      };
      expect(consoleUi.formatAWSSDKName(activity)).to.equal(
        `AWS SDK • Elastic Transcoder • ${fakeServiceOperation.toUpperCase()}`
      );
    });

    it('should return curated format for IOT Data', () => {
      const serviceName = 'iotdata';
      const fakeServiceOperation = 'fakeOperation';
      const activity = {
        name: `aws.sdk.${serviceName}.${fakeServiceOperation}`,
      };
      expect(consoleUi.formatAWSSDKName(activity)).to.equal(
        `AWS SDK • IOT Data • ${fakeServiceOperation.toUpperCase()}`
      );
    });

    it('should return curated format for Kinesis Video', () => {
      const serviceName = 'kinesisvideo';
      const fakeServiceOperation = 'fakeOperation';
      const activity = {
        name: `aws.sdk.${serviceName}.${fakeServiceOperation}`,
      };
      expect(consoleUi.formatAWSSDKName(activity)).to.equal(
        `AWS SDK • Kinesis Video • ${fakeServiceOperation.toUpperCase()}`
      );
    });
  });

  describe('formatHTTPName()', () => {
    it('should return HTTP as formatted name', () => {
      const activity = {};
      expect(consoleUi.formatHTTPName(activity)).to.equal('HTTP');
    });

    it('should return duration • HTTP as formatted name', () => {
      const duration = '100 ms';
      const activity = {
        durationFormatted: duration,
      };
      expect(consoleUi.formatHTTPName(activity)).to.equal(`${duration} • HTTP`);
    });

    it('should return duration • HTTP • METHOD as formatted name', () => {
      const duration = '100 ms';
      const method = 'GET';
      const activity = {
        durationFormatted: duration,
        tags: {
          http: {
            method,
          },
        },
      };
      expect(consoleUi.formatHTTPName(activity)).to.equal(`${duration} • HTTP • ${method}`);
    });

    it('should return duration • HTTP • METHOD • PATH as formatted name', () => {
      const duration = '100 ms';
      const method = 'GET';
      const path = 'api/v1/users';
      const activity = {
        durationFormatted: duration,
        tags: {
          http: {
            method,
            path,
          },
        },
      };
      expect(consoleUi.formatHTTPName(activity)).to.equal(
        `${duration} • HTTP • ${method} • ${path}`
      );
    });

    it('should return duration • HTTP • PATH as formatted name', () => {
      const duration = '100 ms';
      const path = 'api/v1/users';
      const activity = {
        durationFormatted: duration,
        tags: {
          http: {
            path,
          },
        },
      };
      expect(consoleUi.formatHTTPName(activity)).to.equal(`${duration} • HTTP • ${path}`);
    });
  });

  describe('formatConsoleEvent()', () => {
    it('should return formatted console warning with out custom tags', () => {
      const message = 'Warning message';
      const customTags = {};
      const activity = {
        eventName: 'telemetry.warning.generated.v1',
        customTags: JSON.stringify(customTags),
        tags: {
          warning: {
            stacktrace: 'stack trace',
            message,
          },
        },
      };
      const { payload, message: formattedMessage } = consoleUi.formatConsoleEvent(activity);
      expect(formattedMessage).to.equal(`WARNING • ${message}`);
      expect(payload).to.deep.equal({
        message,
        customTags: null,
      });
    });

    it('should return formatted console warning with custom tags', () => {
      const message = 'Warning message';
      const customTags = {
        tag1: 'hi mom',
      };
      const activity = {
        eventName: 'telemetry.warning.generated.v1',
        customTags: JSON.stringify(customTags),
        tags: {
          warning: {
            stacktrace: 'stack trace',
            message,
          },
        },
      };
      const { payload, message: formattedMessage } = consoleUi.formatConsoleEvent(activity);
      expect(formattedMessage).to.equal(`WARNING • ${message}`);
      expect(payload).to.deep.equal({
        message,
        customTags,
      });
    });

    it('should return formatted handled console error with out custom tags', () => {
      const expectedMessage = 'ERROR • Handled';
      const customTags = {};
      const error = {
        type: 'ERROR_TYPE_CAUGHT_USER',
        stack: 'stack trace',
      };
      const activity = {
        eventName: 'telemetry.error.generated.v1',
        customTags: JSON.stringify(customTags),
        tags: {
          error,
        },
      };
      const { payload: payload1, message: message1 } = consoleUi.formatConsoleEvent(activity);
      expect(message1).to.equal(expectedMessage);
      expect(payload1).to.deep.equal({
        ...error,
        customTags: null,
      });

      error.type = 'ERROR_TYPE_CAUGHT_SDK_INTERNAL';
      activity.tags.error = error;
      const { message: message2 } = consoleUi.formatConsoleEvent(activity);
      expect(message2).to.equal(expectedMessage);

      error.type = 'ERROR_TYPE_CAUGHT_SDK_USER';
      activity.tags.error = error;
      const { message: message3 } = consoleUi.formatConsoleEvent(activity);
      expect(message3).to.equal(expectedMessage);
    });

    it('should return formatted unhandled console error with out custom tags', () => {
      const expectedMessage = 'ERROR • Unhandled';
      const customTags = {};
      const error = {
        type: 'ERROR_TYPE_UNCAUGHT',
        stack: 'stack trace',
      };
      const activity = {
        eventName: 'telemetry.error.generated.v1',
        customTags: JSON.stringify(customTags),
        tags: {
          error,
        },
      };
      const { payload: payload1, message: message1 } = consoleUi.formatConsoleEvent(activity);
      expect(message1).to.equal(expectedMessage);
      expect(payload1).to.deep.equal({
        ...error,
        customTags: null,
      });
    });

    it('should return formatted unspecified console error with out custom tags', () => {
      const expectedMessage = 'ERROR • Unspecified';
      const customTags = {};
      const error = {
        type: 'ERROR_TYPE_UNSPECIFIED',
        stack: 'stack trace',
      };
      const activity = {
        eventName: 'telemetry.error.generated.v1',
        customTags: JSON.stringify(customTags),
        tags: {
          error,
        },
      };
      const { payload: payload1, message: message1 } = consoleUi.formatConsoleEvent(activity);
      expect(message1).to.equal(expectedMessage);
      expect(payload1).to.deep.equal({
        ...error,
        customTags: null,
      });
    });

    it('should return formatted unspecified console error with custom tags', () => {
      const expectedMessage = 'ERROR • Unspecified';
      const customTags = {
        tag1: 'hi mom',
      };
      const error = {
        type: 'ERROR_TYPE_UNKNOWN',
        stack: 'stack trace',
      };
      const activity = {
        eventName: 'telemetry.error.generated.v1',
        customTags: JSON.stringify(customTags),
        tags: {
          error,
        },
      };
      const { payload: payload1, message: message1 } = consoleUi.formatConsoleEvent(activity);
      expect(message1).to.equal(expectedMessage);
      expect(payload1).to.deep.equal({
        ...error,
        customTags,
      });
    });
  });

  describe('formatConsoleSpan()', () => {
    it('should return span with duration, durationFormatted, and niceName', () => {
      const activity = {
        name: 'nothing',
        startTime: new Date('2019-01-01T00:00:00.000Z'),
        endTime: new Date('2019-01-01T00:00:00.100Z'),
      };
      const formattedActivity = consoleUi.formatConsoleSpan(activity);
      expect(formattedActivity.niceName).to.equal(activity.name);
      expect(formattedActivity.duration).to.equal(100);
      expect(formattedActivity.durationFormatted).to.equal(ms(100));
    });

    it('should return span without durations', () => {
      const activity = {
        name: 'nothing',
      };
      const formattedActivity = consoleUi.formatConsoleSpan(activity);
      expect(formattedActivity.niceName).to.equal(activity.name);
      expect('duration' in formattedActivity).to.equal(false);
      expect('durationFormatted' in formattedActivity).to.equal(false);
    });

    it('should return formatted AWS SDK span', () => {
      const activity = {
        name: 'aws.sdk.s3.putObject',
        startTime: new Date('2019-01-01T00:00:00.000Z'),
        endTime: new Date('2019-01-01T00:00:00.100Z'),
      };
      const formattedActivity = consoleUi.formatConsoleSpan(activity);
      expect(formattedActivity.niceName).to.equal(`${ms(100)} • AWS SDK • S3 • PUTOBJECT`);
      expect(formattedActivity.duration).to.equal(100);
      expect(formattedActivity.durationFormatted).to.equal(ms(100));
    });

    it('should return formatted http span', () => {
      const activity = {
        name: 'node.http.request',
        startTime: new Date('2019-01-01T00:00:00.000Z'),
        endTime: new Date('2019-01-01T00:00:00.100Z'),
        tags: {
          http: {
            method: 'GET',
            path: '/hello/world',
          },
        },
      };
      const formattedActivity = consoleUi.formatConsoleSpan(activity);
      expect(formattedActivity.niceName).to.equal(
        `${ms(100)} • HTTP • ${activity.tags.http.method} • ${activity.tags.http.path}`
      );
      expect(formattedActivity.duration).to.equal(100);
      expect(formattedActivity.durationFormatted).to.equal(ms(100));
    });
  });

  describe('formatConsoleDate()', () => {
    it('should return formatted date', () => {
      const date = new Date('2019-01-01T12:10:09.387Z');
      const formattedDate = consoleUi.formatConsoleDate(date);
      expect(formattedDate).to.equal('12:10:09.387');
    });
  });

  describe('omitAndSortDevModeActivity()', () => {
    const activityArray = [
      {
        message: 'Filters updated',
        resetThrottle: true,
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.001Z'),
        type: 'span',
        name: 'node.http.request',
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.003Z'),
        type: 'log',
        tags: {
          aws: {
            sequenceId: 10,
          },
        },
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.002Z'),
        type: 'log',
        tags: {
          aws: {
            sequenceId: 1,
          },
        },
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.002Z'),
        type: 'log',
        tags: {
          aws: {
            sequenceId: 0,
          },
        },
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.011Z'),
        type: 'aws-lambda-response',
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.000Z'),
        type: 'aws-lambda-request',
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.005Z'),
        type: 'event',
        sequenceId: 1,
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.005Z'),
        type: 'event',
        sequenceId: 0,
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.05Z'),
        type: 'newEventType',
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.05Z'),
        type: 'span',
        name: 'aws.lambda',
      },
      {
        timestamp: new Date('2019-01-01T00:00:00.05Z'),
        type: 'span',
        name: 'aws.lambda',
      },
    ];
    const expectedArray = [
      activityArray[6], // request
      activityArray[1], // http span
      activityArray[4], // log at 002 with sequenceId 0
      activityArray[3], // log at 002 with sequenceId 1
      activityArray[2], // log at 003 with sequenceId 10
      activityArray[8], // event with sequenceId 0
      activityArray[7], // event with sequenceId 1
      activityArray[5], // response
    ];

    expect(consoleUi.omitAndSortDevModeActivity(activityArray)).to.deep.equal(expectedArray);
  });
});
