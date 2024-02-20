'use strict';

const utils = require('./utils');

/**
 * Create An Application
 */
const create = async (sdk, { orgName, app }) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/applications`;

  return utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data: {
      tenantName: orgName,
      appName: app.name,
      title: app.name,
      description: app.description,
      deploymentProfiles: app.deploymentProfiles,
    },
  });
};

/**
 * Get An Application
 */
const get = async (sdk, { orgName, appName }) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/applications/${appName}`;

  return utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Update An Application
 */
const update = async (sdk, { orgName, app }) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/applications/${app.name}`;

  return utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'PATCH',
    data: {
      appName: app.name,
      title: app.name,
      description: app.description,
      deploymentProfiles: app.deploymentProfiles,
    },
  });
};

/**
 * Delete An Application
 */
const remove = async (sdk, { orgName, appName }) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/applications/${appName}`;

  return utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'DELETE',
  });
};

/**
 * List Applications in an Organization
 */
const list = async (sdk, { orgName }) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/applications`;

  return utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
