'use strict';

const querystring = require('querystring');
const utils = require('./utils');

const create = async (
  sdk,
  { orgName, appName, serviceName, stageName, regionName, deploymentData }
) => {
  if (!orgName) {
    throw new Error('An "orgName" is required to determine Serverless Organization for service');
  }

  if (!appName) {
    throw new Error('An "appName" is required to determine Serverless Application for service');
  }

  if (!serviceName) {
    throw new Error('A "serviceName" is required to determine which service should be archived');
  }

  if (!stageName) {
    throw new Error('A "stageName" is required');
  }

  if (!regionName) {
    throw new Error('A "regionName" is required');
  }

  if (!deploymentData) {
    throw new Error('A "deploymentData" is required');
  }

  const data = {
    tenantName: orgName,
    appName,
    serviceName,
    stageName,
    regionName,
    ...deploymentData,
  };

  const endpoint = `${sdk.getDomain(
    'core'
  )}/core/tenants/${orgName}/applications/${appName}/services/${serviceName}/stages/${stageName}/regions/${regionName}/deployments`;

  return utils.request({
    endpoint,
    method: 'POST',
    accessKey: sdk.accessKey,
    data,
  });
};

const list = async (sdk, { orgName, appName, serviceName, stageName, regionName, cursor }) => {
  if (!orgName) {
    throw new Error('An "orgName" is required to determine Serverless Organization for service');
  }

  if (!appName) {
    throw new Error('An "appName" is required to determine Serverless Application for service');
  }

  if (!serviceName) {
    throw new Error('A "serviceName" is required to determine which service should be archived');
  }

  if (!stageName) {
    throw new Error('A "stageName" is required');
  }

  if (!regionName) {
    throw new Error('A "regionName" is required');
  }

  let endpoint = `${sdk.getDomain(
    'core'
  )}/core/tenants/${orgName}/applications/${appName}/services/${serviceName}/stages/${stageName}/regions/${regionName}/deployments`;

  if (cursor) {
    endpoint += `?${querystring.stringify({ 'x-cursor': cursor })}`;
  }

  return utils.request({
    endpoint,
    method: 'GET',
    accessKey: sdk.accessKey,
  });
};

module.exports = {
  create,
  list,
};
