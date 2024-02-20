'use strict';

const utils = require('./utils');

const create = (sdk, orgName, userName, accessKeyName) => {
  if (!sdk.accessKey) {
    throw new Error('An "accessKey" is required to create other Access Keys.');
  }
  if (!orgName) {
    throw new Error(
      'An "orgName" is required to determine which Serverless Organization you would like to create an Access Key for.'
    );
  }
  if (!userName) {
    throw new Error(
      'A "userName" is required to determine which User within the Serverless Organization you would like to create an Access Key for.'
    );
  }
  if (!accessKeyName) {
    throw new Error(
      'An "accessKeyName" is required to name this Serverless Organization Access Key.'
    );
  }
  return utils.request({
    endpoint: `${sdk.getDomain('core')}/core/tenants/${orgName}/accessKeys`,
    method: 'POST',
    accessKey: sdk.accessKey,
    data: {
      userName,
      title: accessKeyName,
    },
  });
};

const list = (sdk, orgName) => {
  if (!sdk.accessKey) {
    throw new Error('An "accessKey" is required to list Access Keys.');
  }
  if (!orgName) {
    throw new Error(
      'An "orgName" is required to determine which Serverless Organization you would like to list Access Keys.'
    );
  }
  return utils.request({
    endpoint: `${sdk.getDomain('core')}/core/tenants/${orgName}/accessKeys`,
    method: 'GET',
    accessKey: sdk.accessKey,
  });
};

const remove = (sdk, orgName, uid) => {
  if (!sdk.accessKey) {
    throw new Error('An "accessKey" is required to destroy Access Keys.');
  }
  if (!orgName) {
    throw new Error(
      'An "orgName" is required to determine which Serverless Organization has the Access Key you would like to destroy.'
    );
  }
  if (!uid) {
    throw new Error(
      'A "uid" is required to determine which Serverless Organization Access Key you would like to destroy.'
    );
  }
  return utils.request({
    endpoint: `${sdk.getDomain('core')}/core/tenants/${orgName}/accessKeys/${uid}`,
    method: 'DELETE',
    accessKey: sdk.accessKey,
  });
};

const get = async (sdk) => {
  const response = await utils.request({
    endpoint: `${sdk.getDomain('core')}/core/tenants/accessKey/meta`,
    method: 'GET',
    accessKey: sdk.accessKey,
  });

  return response.result;
};

module.exports = {
  create,
  list,
  remove,
  get,
};
