'use strict';

const configUtils = require('../config');

module.exports = () => {
  if (!configUtils.get('auth.refreshToken')) return false;

  configUtils.delete('auth');
  return true;
};
