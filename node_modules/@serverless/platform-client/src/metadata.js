'use strict';

const utils = require('./utils');

/**
 * Get the Serverless Platform Metadata
 */
const get = async (sdk) => {
  const endpoint = `${sdk.getDomain('core')}/core/meta`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

module.exports = {
  get,
};
