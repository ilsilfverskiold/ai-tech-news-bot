'use strict';

const utils = require('./utils');

/**
 * Create an organization and optionally register a new user
 */
const create = async (sdk, { orgName, username, email, password }) => {
  if (!orgName) {
    throw new Error('An "orgName" is required to create an organization.');
  }

  const endpoint = `${sdk.getDomain('core')}/core/tenants`;

  return utils.request({
    endpoint,
    method: 'POST',
    data: {
      ownerUserName: username || orgName,
      ownerPassword: password,
      ownerEmail: email,
      title: orgName,
      tenantName: orgName,
    },
  });
};

/**
 * Get Organization By Name
 */
const get = async (sdk, { orgName }) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants/${orgName}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * List Organizations By User
 */
const list = async (sdk, { username }) => {
  const endpoint = `${sdk.getDomain('core')}/core/tenants?userName=${username}`;

  return await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });
};

/**
 * Validate User and Organization name
 */
const validate = async (sdk, { orgName, username }) => {
  if (!orgName) {
    throw new Error('An "orgName" is required for validation.');
  }

  const endpoint = `${sdk.getDomain('core')}/core/validate/tenants`;

  const res = await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'POST',
    data: {
      ownerUserName: username || orgName,
      title: orgName,
      tenantName: orgName,
    },
  });

  if (res && res.validationErrors && res.validationErrors.length) {
    return res.validationErrors;
  }

  return null;
};

module.exports = {
  get,
  list,
  create,
  validate,
};
