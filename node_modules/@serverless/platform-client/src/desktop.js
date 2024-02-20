'use strict';

const utils = require('./utils');

const createSavedQuery = async (sdk, orgUid, appUid, serviceName, params) => {
  return utils.request({
    endpoint: `${sdk.getDomain(
      'desktop'
    )}/orgs/${orgUid}/apps/${appUid}/services/${serviceName}/savedQueries`,
    method: 'POST',
    accessKey: sdk.accessKey,
    data: params,
  });
};
const getSavedQuery = async (sdk, orgUid, appUid, serviceName, savedQueryUid) => {
  return utils.request({
    endpoint: `${sdk.getDomain(
      'desktop'
    )}/orgs/${orgUid}/apps/${appUid}/services/${serviceName}/savedQueries/${savedQueryUid}`,
    method: 'GET',
    accessKey: sdk.accessKey,
  });
};
const updateSavedQuery = async (sdk, orgUid, appUid, serviceName, savedQueryUid, params) => {
  return utils.request({
    endpoint: `${sdk.getDomain(
      'desktop'
    )}/orgs/${orgUid}/apps/${appUid}/services/${serviceName}/savedQueries/${savedQueryUid}`,
    method: 'PUT',
    accessKey: sdk.accessKey,
    data: params,
  });
};
const deleteSavedQuery = async (sdk, orgUid, appUid, serviceName, savedQueryUid) => {
  return utils.request({
    endpoint: `${sdk.getDomain(
      'desktop'
    )}/orgs/${orgUid}/apps/${appUid}/services/${serviceName}/savedQueries/${savedQueryUid}`,
    method: 'DELETE',
    accessKey: sdk.accessKey,
  });
};
const listSavedQueries = async (sdk, orgUid, appUid, serviceName) => {
  return utils.request({
    endpoint: `${sdk.getDomain(
      'desktop'
    )}/orgs/${orgUid}/apps/${appUid}/services/${serviceName}/savedQueries`,
    method: 'GET',
    accessKey: sdk.accessKey,
  });
};

module.exports = {
  createSavedQuery,
  getSavedQuery,
  updateSavedQuery,
  deleteSavedQuery,
  listSavedQueries,
};
