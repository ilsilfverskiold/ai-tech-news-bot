'use strict';

const _ = require('lodash');
const fetch = require('node-fetch');
const open = require('open');
const wait = require('timers-ext/promise/sleep');
const ServerlessError = require('../serverless-error');
const log = require('../log').log.get('auth');
const configUtils = require('../config');
const urls = require('../lib/auth/urls');

const createLoginSession = async () => {
  const response = await (async () => {
    try {
      return await fetch(`${urls.backend}/api/identity/auth/login-sessions`, { method: 'POST' });
    } catch (error) {
      log.debug('Server unavailable', error);
      throw new ServerlessError(
        'Serverless Console is not available, please try again later',
        'CONSOLE_SERVER_UNAVAILABLE'
      );
    }
  })();
  if (!response.ok) {
    log.debug('Cannot create login session', response.status);
    const responseText = await response.text();
    if (response.status < 500) throw new Error(`Console server error: ${responseText}`);
    throw new ServerlessError(
      'Cannot initialize login session at this point, please try again later',
      'CONSOLE_SERVER_REQUEST_FAILED'
    );
  }
  const responseObject = await (async () => {
    try {
      return await response.json();
    } catch (error) {
      log.debug('Cannot resolve response JSON', error);
      try {
        log.debug('Server response text', await response.text());
      } catch {
        /* ignore */
      }
      throw new ServerlessError(
        'Cannot initialize login session due to unexpected server response, please try again later',
        'CONSOLE_LOGIN_SESSION_UNEXPECTED_RESPONSE_TYPE'
      );
    }
  })();
  if (!_.get(responseObject, 'sessionId')) {
    log.debug('Unepxected response value', responseObject);
    throw new ServerlessError(
      'Cannot initialize login session due to unexpected server response, please try again later',
      'CONSOLE_LOGIN_SESSION_INVALID_RESPONSE'
    );
  }
  return responseObject.sessionId;
};

const getRefreshToken = async (sessionId) => {
  const response = await (async () => {
    try {
      return await fetch(`${urls.backend}/api/identity/auth/login-sessions/${sessionId}`);
    } catch (error) {
      log.debug('Server unavailable', error);
      throw new ServerlessError(
        'Serverless Console is not available, please try again later',
        'CONSOLE_SERVER_UNAVAILABLE'
      );
    }
  })();
  if (!response.ok) {
    log.debug('Canot retrieve refresh token', response.status);
    const responseText = await response.text();
    if (response.status < 500) throw new Error(`Console server error: ${responseText}`);
    throw new ServerlessError(
      'Cannot login at this point, please try again later',
      'CONSOLE_SERVER_REQUEST_FAILED'
    );
  }
  const responseObject = await (async () => {
    try {
      return await response.json();
    } catch (error) {
      log.debug('Canot resolve response JSON', error);
      try {
        log.debug('Server response text', await response.text());
      } catch {
        /* ignore */
      }
      throw new ServerlessError(
        'Cannot login due to unexpected server response, please try again later',
        'CONSOLE_LOGIN_UNEXPECTED_RESPONSE_TYPE'
      );
    }
  })();
  if (!_.get(responseObject, 'status')) {
    log.debug('Unexpected response value', responseObject);
    throw new ServerlessError(
      'Cannot initialize login session due to unexpected server response, please try again later',
      'CONSOLE_LOGIN_INVALID_RESPONSE'
    );
  }
  if (responseObject.status === 'failed') {
    log.debug('Login rejected', responseObject);
    throw new ServerlessError(
      'Login was rejected, please try again later',
      'CONSOLE_LOGIN_REJECTED'
    );
  }
  if (responseObject.refreshToken) return responseObject.refreshToken;
  const expiresAt = Date.parse(responseObject.expiresAt);
  if (expiresAt < Date.now() + 1500) {
    throw new ServerlessError(
      'Login session timed out, please try again later',
      'CONSOLE_LOGIN_TIMEOUT'
    );
  }

  await wait(1000);
  return getRefreshToken(sessionId);
};

module.exports = async (options = {}) => {
  if (!_.isObject(options)) options = {};

  const sessionId = await createLoginSession();
  const params = new URLSearchParams({
    client: options.clientName || 'cli',
    transactionId: sessionId,
  });
  if (options.clientVersion) params.append('clientVersion', options.clientVersion);
  if (options.clientOriginCommand) {
    params.append('clientOriginCommand', options.clientOriginCommand);
  }

  const loginUrl = `${urls.frontend}?${params}`;
  open(loginUrl);
  if (options.onLoginUrl) options.onLoginUrl(loginUrl);

  const refreshToken = await getRefreshToken(sessionId);

  configUtils.set('auth', { refreshToken });
};
