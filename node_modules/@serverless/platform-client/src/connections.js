'use strict';

const utils = require('./utils');

const create = (sdk, orgUid, providerUid, accountAlias) => {
  return utils.request({
    endpoint: `${sdk.getDomain('connections')}/orgs/${orgUid}/connections`,
    method: 'POST',
    accessKey: sdk.accessKey,
    data: {
      providerUid,
      accountAlias,
    },
  });
};

const list = (sdk, orgUid) => {
  return utils.request({
    endpoint: `${sdk.getDomain('connections')}/orgs/${orgUid}/connections`,
    method: 'GET',
    accessKey: sdk.accessKey,
  });
};

const get = (sdk, orgUid, connectionUid) => {
  return utils.request({
    endpoint: `${sdk.getDomain('connections')}/orgs/${orgUid}/connections/${connectionUid}`,
    method: 'GET',
    accessKey: sdk.accessKey,
  });
};

const getByOrgAndAccountAlias = (sdk, orgUid, accountAlias) => {
  return utils.request({
    endpoint: `${sdk.getDomain('connections')}/orgs/${orgUid}/connectionAlias/${accountAlias}`,
    method: 'GET',
    accessKey: sdk.accessKey,
  });
};

const update = (sdk, orgUid, connectionUid, providerUid, accountAlias, status) => {
  return utils.request({
    endpoint: `${sdk.getDomain('connections')}/orgs/${orgUid}/connections/${connectionUid}`,
    method: 'PUT',
    accessKey: sdk.accessKey,
    data: {
      providerUid,
      accountAlias,
      status,
    },
  });
};

const remove = (sdk, orgUid, connectionUid) => {
  return utils.request({
    endpoint: `${sdk.getDomain('connections')}/orgs/${orgUid}/connections/${connectionUid}`,
    method: 'DELETE',
    accessKey: sdk.accessKey,
  });
};

const syncAll = (sdk, orgUid) => {
  if (!orgUid) {
    throw new Error('An "orgUid" is required.');
  }

  return utils.request({
    endpoint: `${sdk.getDomain('connections')}/orgs/${orgUid}/sync`,
    method: 'POST',
    accessKey: sdk.accessKey,
  });
};

const unsync = (sdk, orgUid, connectionUid) => {
  if (!orgUid) {
    throw new Error('An "orgUid" is required.');
  }
  if (!connectionUid) {
    throw new Error('An "connectionUid" is required.');
  }

  return utils.request({
    endpoint: `${sdk.getDomain('connections')}/orgs/${orgUid}/unsync/${connectionUid}`,
    method: 'POST',
    accessKey: sdk.accessKey,
  });
};

module.exports = {
  create,
  list,
  get,
  getByOrgAndAccountAlias,
  update,
  remove,
  syncAll,
  unsync,
};
