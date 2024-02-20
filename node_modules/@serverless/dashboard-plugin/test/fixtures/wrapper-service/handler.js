'use strict';
const https = require('https');
const AWS = require('aws-sdk');

module.exports.unresolved = () => {
  // Neither promise returned nor callback called
};

module.exports.syncError = () => {
  throw new Error('syncError');
};

module.exports.async = () => {
  return new Promise((resolve) => setTimeout(() => resolve('asyncReturn'), 100));
};

module.exports.asyncDanglingCallback = async () => {
  setTimeout(() => true, 1000);
  return new Promise((resolve) => setTimeout(() => resolve('asyncDanglyReturn'), 100));
};

module.exports.asyncError = () => {
  return new Promise((resolve, reject) => setTimeout(() => reject(new Error('asyncError')), 100));
};

module.exports.callback = (event, context, callback) => {
  setTimeout(() => callback(null, 'callbackReturn'), 100);
};

module.exports.callbackError = (event, context, callback) => {
  setTimeout(() => callback('callbackError'), 100);
};

module.exports.done = (event, context) => {
  setTimeout(() => context.done(null, 'doneReturn'), 100);
};

module.exports.doneError = (event, context) => {
  setTimeout(() => context.done('doneError'), 100);
};

module.exports.fail = (event, context) => {
  setTimeout(() => context.fail('failError'), 100);
};

module.exports.succeed = (event, context) => {
  setTimeout(() => context.succeed('succeedReturn'), 100);
};

module.exports.promiseAndCallbackRace = async (event, context, callback) => {
  setTimeout(() => callback(null, 'callbackEarlyReturn'), 100);
  return new Promise((resolve) => setTimeout(() => resolve('asyncReturn'), 300));
};

module.exports.eventTags = async (event, context) => {
  context.serverlessSdk.tagEvent('event-tagged', 'true', {
    customerId: 5,
    userName: 'aaron.stuyvenberg',
  });
  return 'asyncReturn';
};

module.exports.spans = async (event, context) => {
  const sts = context.serverlessSdk.span('create sts client', () => new AWS.STS());
  await sts.getCallerIdentity().promise();
  await new Promise((resolve, reject) => {
    const req = https.request({ host: 'httpbin.org', path: '/post', method: 'POST' }, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        resolve(data);
      });
    });
    req.on('error', reject);
    req.end();
  });
  const response = await context.serverlessSdk.span(
    'asynctest',
    () =>
      new Promise((resolve, reject) => {
        const req = https.get(
          {
            host: 'httpbin.org',
            path: '/get',
            method: 'get',
            headers: {
              accept: 'application/json',
            },
          },
          (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
              data += chunk;
            });
            resp.on('end', () => {
              resolve(JSON.parse(data));
            });
          }
        );
        req.on('error', reject);
      })
  );
  if (response.url === 'https://httpbin.org/get') {
    return 'asyncReturn';
  }
  throw new Error(`invalid span result: ${response.url}`);
};

module.exports.setEndpoint = async (event, context) => {
  context.serverlessSdk.setEndpoint('/test/:param1');
  return 'asyncReturn';
};

module.exports.setEndpointWithHttpMetadata = async (event, context) => {
  context.serverlessSdk.setEndpoint({
    endpoint: '/test/:param2',
    httpMethod: 'POST',
    httpStatusCode: 201,
  });
  return 'asyncReturn';
};

module.exports.noWaitForEmptyLoop = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  https.get({ host: 'httpbin.org', path: '/delay/10' });
  callback(null, 'noWaitForEmptyLoop');
};

//  By default in lambda, context.callbackWaitsForEmptyEventLoop = true
module.exports.waitForEmptyLoop = (event, context, callback) => {
  https.get({ host: 'httpbin.org', path: '/delay/10' });
  setTimeout(() => {
    return callback(null, 'noWaitForEmptyLoop');
  }, 10000);
};

module.exports.timeout = () => new Promise((resolve) => setTimeout(resolve, 10000));

module.exports.getTransactionId = async (event, context) => {
  const transactionId = context.serverlessSdk.getTransactionId();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(transactionId)) {
    return 'success';
  }
  throw new Error(`transactionId not set/uuid: ${transactionId}`);
};

module.exports.getDashboardUrl = async (event, context) => {
  const url = context.serverlessSdk.getDashboardUrl();
  const domain = process.env.PLATFORM_STAGE === 'prod' ? 'serverless' : 'serverless-dev';
  const re = new RegExp(
    [
      `https://app.${domain}.com`,
      process.env.ORG,
      'apps',
      process.env.APP,
      process.env.SERVICE,
      process.env.STAGE,
      process.env.REGION,
      'explorer',
      '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
    ].join('/')
  );
  if (re.test(url)) {
    return 'success';
  }
  throw new Error(`dashboard url incorrect: ${url}`);
};
