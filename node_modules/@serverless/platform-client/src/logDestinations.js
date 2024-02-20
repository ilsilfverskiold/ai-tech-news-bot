'use strict';

const utils = require('./utils');

/**
 * Create a Log Destination
 */
const getOrCreate = async (
  sdk,
  { orgUid, appUid, serviceName, stageName, regionName, accountId }
) => {
  const endpoint = `${sdk.getDomain('core')}/malt/destinations/create`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data: {
      tenantUid: orgUid,
      appUid,
      serviceName,
      stageName,
      regionName,
      accountId,
    },
  });
};

/**
 * Remove a Log Destination
 */
const remove = async (sdk, { orgUid, appUid, serviceName, stageName, regionName }) => {
  const endpoint = `${sdk.getDomain('core')}/malt/destinations/delete`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data: {
      tenantUid: orgUid,
      appUid,
      serviceName,
      stageName,
      regionName,
    },
  });
};

module.exports = {
  getOrCreate,
  remove,
};
