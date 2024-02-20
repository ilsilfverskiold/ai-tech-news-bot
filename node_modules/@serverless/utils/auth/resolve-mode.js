'use strict';

const log = require('../log').log.get('auth');
const resolveAuthToken = require('./resolve-token');

const isOrgAuthentication = Boolean(process.env.SLS_ORG_TOKEN);

module.exports = async (options) => {
  const resultMode = await (async () => {
    try {
      await resolveAuthToken(options);
      return isOrgAuthentication ? 'org' : 'user';
    } catch (error) {
      if (error.code === 'CONSOLE_LOGGED_OUT') return null;
      throw error;
    }
  })();
  log.debug('mode:', resultMode);
  return resultMode;
};
