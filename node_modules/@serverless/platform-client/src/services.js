'use strict';

const utils = require('./utils');

const get = async (sdk, { orgName, appName, serviceName }) => {
  if (!orgName) {
    throw new Error('An "orgName" is required to determine Serverless Organization for service');
  }

  if (!appName) {
    throw new Error('An "appName" is required to determine Serverless Application for service');
  }

  if (!serviceName) {
    throw new Error('A "serviceName" is required to determine which service should be returned');
  }

  const endpoint = `${sdk.getDomain(
    'core'
  )}/core/tenants/${orgName}/applications/${appName}/services/${serviceName}`;

  return utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

const getStateVariable = async (
  sdk,
  { orgName, appName, serviceName, stageName, regionName, variableName }
) => {
  if (!orgName) {
    throw new Error('An "orgName" is required to determine Serverless Organization for service');
  }

  if (!appName) {
    throw new Error('An "appName" is required to determine Serverless Application for service');
  }

  if (!serviceName) {
    throw new Error(
      'A "serviceName" is required to determine Service associated with State Variable'
    );
  }

  if (!stageName) {
    throw new Error('A "stageName" is required to determine stage associated with State Variable');
  }

  if (!regionName) {
    throw new Error(
      'A "regionName" is required to determine region associated with State Variable'
    );
  }

  if (!variableName) {
    throw new Error('A "variableName" is required');
  }

  const endpoint = `${sdk.getDomain(
    'core'
  )}/core/tenants/${orgName}/applications/${appName}/services/${serviceName}/stages/${stageName}/regions/${regionName}/outputs`;

  return utils.request({
    endpoint,
    method: 'POST',
    accessKey: sdk.accessKey,
    data: {
      outputName: variableName,
    },
  });
};

module.exports = {
  get,
  getStateVariable,
};
