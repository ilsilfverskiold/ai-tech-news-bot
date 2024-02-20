'use strict';

const ensureString = require('type/string/ensure');
const isObject = require('type/object/is');
const ensureObject = require('type/object/ensure');
const fetch = require('node-fetch');
const log = require('./log').log.get('api');
const ServerlessError = require('./serverless-error');
const urls = require('./lib/auth/urls');

let requestIdCounter = 0;

module.exports = async (pathname, options = {}) => {
  pathname = ensureString(pathname, { name: 'pathname' });
  if (!isObject(options)) options = {};
  const method = ensureString(options.method, { name: 'options.method', default: 'GET' });
  const body = ensureObject(options.body, { name: 'options.body', isOptional: true });
  const requestId = ++requestIdCounter;
  let authorization = {};
  if (!options.accessKey && !options.noAuth) {
    throw new ServerlessError(
      'An access key must be specified. Please try logging out and logging back in',
      'DASHBOARD_ACCESS_KEY_MISSING'
    );
  }
  if (options.accessKey && !options.noAuth) {
    authorization = { Authorization: `Bearer ${options.accessKey}` };
  }

  const response = await (async () => {
    const url = `${urls[options.urlName] || urls.backend}${pathname}`;
    const headers = {
      ...authorization,
      'Content-Type': 'application/json',
    };
    const fetchOptions = {
      method,
      headers,
    };
    if (body) fetchOptions.body = JSON.stringify(body);
    log.debug('[%d] %s, options: %o', requestId, url, fetchOptions);
    try {
      return await fetch(url, fetchOptions);
    } catch (error) {
      log.debug('Server unavailable', error);
      throw new ServerlessError(
        'Dashboard server is not available, please try again later',
        'DASHBOARD_SERVER_UNAVAILABLE'
      );
    }
  })();
  log.debug('[%d] %d, %o', requestId, response.status, response.headers);
  const slsCorrelationId = response.headers.get('sls-correlation-id');
  if (!response.ok) {
    const responseText = await response.text();
    log.debug('[%d] %s', requestId, responseText);
    if (response.status < 500) {
      if (response.status === 401) {
        throw Object.assign(
          new ServerlessError(
            'Unauthorized request: Run "sls login to authenticate',
            'DASHBOARD_USER_AUTH_REJECTED'
          ),
          { httpStatusCode: 401 }
        );
      }
      throw Object.assign(
        new Error(
          `Dashboard server error: [${response.status}] ${responseText}. ReferenceId: ${slsCorrelationId}`
        ),
        {
          code: `DASHBOARD_SERVER_ERROR_${response.status}`,
          httpStatusCode: response.status,
        }
      );
    }
    throw new ServerlessError(
      `Dashboard encountered an error, please try again later. ReferenceId: ${slsCorrelationId}`,
      'DASHBOARD_SERVER_REQUEST_FAILED'
    );
  }
  if ((response.headers.get('content-type') || '').includes('application/json')) {
    const responseData = await (async () => {
      try {
        return await response.json();
      } catch (error) {
        const responseText = await response.text();
        log.debug('[%d] %s', requestId, responseText);
        throw new Error(
          `Dashboard server error: ${responseText}. ReferenceId: ${slsCorrelationId}`
        );
      }
    })();
    log.debug('[%d] %o', requestId, responseData);
    return responseData;
  }
  return await response.text();
};
