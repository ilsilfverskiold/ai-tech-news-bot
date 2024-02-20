'use strict';

const utils = require('./utils');

/**
 * TODO: Finish adding session-related methods here
 */

const refreshToken = async (sdk, refToken) => {
  return await utils.request({
    endpoint: `${sdk.getDomain('core')}/core/tokens/refresh`,
    method: 'POST',
    data: {
      refreshToken: refToken,
    },
  });
};

module.exports = {
  refreshToken,
};
