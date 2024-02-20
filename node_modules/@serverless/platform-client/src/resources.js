'use strict';

/*
 * SERVERLESS PLATFORM SDK: RESOURCES
 */

const utils = require('./utils');

/**
 * Get the Serverless Platform User Account
 */
const getUser = async (sdk) => {
  const endpoint = `${sdk.getDomain('core')}/core/me`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Get the Serverless Platform User Account Meta information
 */
const getUserMeta = async (sdk) => {
  const endpoint = `${sdk.getDomain('core')}/core/users/meta`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Create/Update the Serverless Platform User Account Meta information
 */
const saveUserMeta = async (sdk, newMeta = {}) => {
  const existingMeta = await getUserMeta(sdk);

  newMeta = Object.assign(existingMeta || {}, newMeta);

  const endpoint = `${sdk.getDomain('core')}/core/users/meta`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data: newMeta,
  });
};

/**
 * DEPRECATED: Validate User and Organization name
 * TODO: Remove when releasing a new major
 */
const validateUserAndOrgName = async (sdk, userAndOrgName) => {
  const endpoint = `${sdk.getDomain('core')}/core/validate/tenants`;

  const res = await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data: {
      ownerUserName: userAndOrgName,
      title: userAndOrgName,
      tenantName: userAndOrgName,
    },
  });

  if (res && res.validationErrors && res.validationErrors.length) {
    return res.validationErrors;
  }

  return null;
};

/**
 * DEPRECATED: Create Organization
 * TODO: Remove when releasing a new major
 */
const createOrg = async (sdk, userAndOrgName) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data: {
      ownerUserName: userAndOrgName,
      title: userAndOrgName,
      tenantName: userAndOrgName,
    },
  });
};

/**
 * DEPRECATED: Create a User and Organization
 * TODO: Remove when releasing a new major
 */
const createUserAndOrg = async (sdk, userAndOrgName) => {
  return await createOrg(sdk, userAndOrgName);
};

/**
 * DEPRECATED: Get Organization By Name
 * TODO: Remove when releasing a new major
 */
const getOrgByName = async (sdk, orgName) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * DEPRECATED: List Organizations By User
 * TODO: Remove when releasing a new major
 */
const listOrgs = async (sdk, username) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants?userName=${username}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * DEPRECATED: Create An Application
 * TODO: Remove when releasing a new major
 */
const createApp = async (sdk, orgName = null, app = {}) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/applications`;

  return await utils.request({
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
 * DEPRECATED: Update An Application
 * TODO: Remove when releasing a new major
 */
const updateApp = async (sdk, orgName = null, app = {}) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/applications/${app.name}`;

  return await utils.request({
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
 * DEPRECATED: Delete An Application
 * TODO: Remove when releasing a new major
 */
const deleteApp = async (sdk, orgName = null, appName = null) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/applications/${appName}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'DELETE',
  });
};

/**
 * DEPRECATED: List Applications in an Organization
 * TODO: Remove when releasing a new major
 */
const listApps = async (sdk, orgName = null) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}/applications`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Create initToken for a tenant/user pair
 *
 * @param {*} sdk
 * @param {*} orgName
 * @param {*} data
 */
const createInitToken = async (sdk, orgName = null, data) => {
  const endpoint = `${sdk.getDomain('core')}/core/initTokens`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data: {
      tenantName: orgName,
      ...data,
    },
  });
};

/**
 * Fetch initToken by ID
 *
 * @param {*} sdk
 * @param {*} tokenUid
 */
const getInitToken = async (sdk, tokenUid) => {
  const endpoint = `${sdk.getDomain('core')}/core/initTokens/${tokenUid}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Get providers by Org
 *
 * @param {*} sdk
 * @param {*} orgUid
 */
const getProviders = async (sdk, orgUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/providers`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Create a Provider
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} data
 */
const createProvider = async (sdk, orgUid, data) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/providers`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data,
  });
};

/**
 * Get a Provider
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} providerUid
 */
const getProvider = async (sdk, orgUid, providerUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/providers/${providerUid}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Update a Provider
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} providerUid
 * @param {*} data
 */
const updateProvider = async (sdk, orgUid, providerUid, data) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/providers/${providerUid}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'PUT',
    data,
  });
};

/**
 * Set a default Provider
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} providerUid
 */
const setDefaultProvider = async (sdk, orgUid, providerUid) => {
  const endpoint = `${sdk.getDomain(
    'providers'
  )}/orgs/${orgUid}/providers/${providerUid}/set-default`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
  });
};

/**
 * Unsets the default Provider
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} providerUid
 */
const unsetDefaultProvider = async (sdk, orgUid, providerUid) => {
  const endpoint = `${sdk.getDomain(
    'providers'
  )}/orgs/${orgUid}/providers/${providerUid}/set-default/?isDefault=false`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
  });
};

/**
 * Delete a Provider
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} providerUid
 */
const deleteProvider = async (sdk, orgUid, providerUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/providers/${providerUid}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'DELETE',
  });
};

/**
 * Create a providerLink
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} linkType
 * @param {*} linkUid
 * @param {*} providerUid
 */
const createProviderLink = async (sdk, orgUid, linkType, linkUid, providerUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/${linkType}s/${encodeURI(
    linkUid
  )}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data: {
      providerUid,
    },
  });
};

/**
 * Destroy a providerLink
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} linkType
 * @param {*} linkUid
 */
const deleteProviderLink = async (sdk, orgUid, linkType, linkUid, providerUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/${linkType}s/${encodeURI(
    linkUid
  )}/providers/${providerUid}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'DELETE',
  });
};

/**
 * Get providers by Link
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} linkType
 * @param {*} linkUid
 */
const getProvidersByLink = async (sdk, orgUid, linkType, linkUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/${linkType}s/${encodeURI(
    linkUid
  )}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Get providers by Org, Service, and Instance
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} serviceUid
 * @param {*} instanceUid
 */
const getProvidersByOrgServiceInstance = async (sdk, orgUid, serviceUid, instanceUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/services/${encodeURI(
    serviceUid
  )}/instances/${encodeURI(instanceUid)}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Get providers allowed by the providers service
 * @param {*} sdk
 */
const getAllowedProviders = async (sdk) => {
  const endpoint = `${sdk.getDomain('providers')}/providers`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Create a param
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} linkType
 * @param {*} linkUid
 * @param {*} data
 */
const createParam = async (sdk, orgUid, linkType, linkUid, data) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/${linkType}s/${encodeURI(
    linkUid
  )}/params`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data,
  });
};

/**
 * Delete a param
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} linkType
 * @param {*} linkUid
 * @param {*} paramUid
 */
const deleteParam = async (sdk, orgUid, linkType, linkUid, paramUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/${linkType}s/${encodeURI(
    linkUid
  )}/params/${paramUid}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'DELETE',
  });
};

/**
 * Update a param
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} linkType
 * @param {*} linkUid
 * @param {*} paramUid
 * @param {*} data
 */
const updateParam = async (sdk, orgUid, linkType, linkUid, paramUid, data) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/${linkType}s/${encodeURI(
    linkUid
  )}/params/${paramUid}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'PUT',
    data,
  });
};

/**
 * Get params
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} linkType
 * @param {*} linkUid
 */
const getParams = async (sdk, orgUid, linkType, linkUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/${linkType}s/${encodeURI(
    linkUid
  )}/params`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Get params by org, service, and instance
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} serviceUid
 * @param {*} instanceUid
 */
const getParamsByOrgServiceInstance = async (sdk, orgUid, serviceUid, instanceUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/services/${encodeURI(
    serviceUid
  )}/instances/${encodeURI(instanceUid)}/params`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Get params and providers by org, service, and instance
 *
 * @param {*} sdk
 * @param {*} orgUid
 * @param {*} serviceUid
 * @param {*} instanceUid
 */
const getParamsAndProvidersByOrgServiceInstance = async (sdk, orgUid, serviceUid, instanceUid) => {
  const endpoint = `${sdk.getDomain('providers')}/orgs/${orgUid}/services/${encodeURI(
    serviceUid
  )}/instances/${encodeURI(instanceUid)}/params-and-providers`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

module.exports = {
  getUser,
  getUserMeta,
  saveUserMeta,
  validateUserAndOrgName,
  createUserAndOrg,
  createOrg,
  getOrgByName,
  listOrgs,
  createApp,
  updateApp,
  deleteApp,
  listApps,
  createInitToken,
  getInitToken,
  getProviders,
  getProvider,
  getProvidersByOrgServiceInstance,
  createProvider,
  updateProvider,
  setDefaultProvider,
  unsetDefaultProvider,
  deleteProvider,
  createProviderLink,
  deleteProviderLink,
  getProvidersByLink,
  getAllowedProviders,
  createParam,
  deleteParam,
  getParams,
  updateParam,
  getParamsByOrgServiceInstance,
  getParamsAndProvidersByOrgServiceInstance,
};
