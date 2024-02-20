'use strict';

const utils = require('./utils');

const get = async (sdk, { orgName, appName, stageName, serviceName }) => {
  const endpoint = `${sdk.getDomain(
    'core'
  )}/core/tenants/${orgName}/applications/${appName}/profileValue`;

  const result = await utils.request({
    endpoint,
    method: 'POST',
    accessKey: sdk.accessKey,
    data: {
      stageName,
      serviceName,
    },
  });

  if (!result) {
    return { secretValues: [], safeguardsPolicies: [], providerCredentials: null };
  }

  return result;
};

const list = async (sdk, { orgName }) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/deploymentProfiles`;

  return utils.request({
    endpoint,
    method: 'GET',
    accessKey: sdk.accessKey,
  });
};

const create = async (
  sdk,
  {
    profileName,
    orgName,
    description = 'A description was not provided for this profile',
    secrets = [],
    safeguardsPolicies = [],
    providerCredentials = null,
  }
) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/deploymentProfiles`;

  return utils.request({
    endpoint,
    method: 'POST',
    accessKey: sdk.accessKey,
    data: {
      name: profileName,
      description,
      secrets,
      safeguardsPolicies,
      providerCredentials,
    },
  });
};

const setDefault = async (sdk, { appName, orgName, profileUid }) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/applications/${appName}`;

  return utils.request({
    endpoint,
    method: 'PATCH',
    accessKey: sdk.accessKey,
    data: {
      deploymentProfiles: { default: profileUid },
    },
  });
};

module.exports = {
  get,
  list,
  create,
  setDefault,
};
