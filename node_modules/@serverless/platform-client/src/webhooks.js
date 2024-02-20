'use strict';

const querystring = require('querystring');
const utils = require('./utils');

const register = (sdk, url, options = {}) => {
  if (!options.org_uid && !sdk.context.orgUid && !options.org_name && !sdk.context.orgName) {
    throw new Error('Must pass in options or set SDK context for `org_uid`/`org_name`');
  }
  return utils.request({
    endpoint: `${sdk.getDomain('event-webhooks')}/webhooks`,
    method: 'POST',
    accessKey: sdk.accessKey,
    data: {
      url,
      org_uid: options.org_uid || sdk.context.orgUid,
      org_name: options.org_name || sdk.context.orgName,
      description: options.description,
      filter: options.filter,
    },
  });
};

const list = (sdk, startingAfter, limit) => {
  return utils.request({
    endpoint: `${sdk.getDomain('event-webhooks')}/webhooks?${querystring.stringify({
      org_uid: sdk.context.orgUid,
      org_name: sdk.context.orgName,
      starting_after: startingAfter,
      limit,
    })}`,
    method: 'GET',
    accessKey: sdk.accessKey,
  });
};

const get = (sdk, uid) => {
  return utils.request({
    endpoint: `${sdk.getDomain('event-webhooks')}/webhooks/${uid}`,
    method: 'GET',
    accessKey: sdk.accessKey,
  });
};

const update = (sdk, uid, updates) => {
  return utils.request({
    endpoint: `${sdk.getDomain('event-webhooks')}/webhooks/${uid}`,
    method: 'POST',
    data: {
      url: updates.url,
      description: updates.description,
      filter: updates.filter,
      status: updates.status,
    },
    accessKey: sdk.accessKey,
  });
};

const remove = (sdk, uid) => {
  return utils.request({
    endpoint: `${sdk.getDomain('event-webhooks')}/webhooks/${uid}`,
    method: 'DELETE',
    accessKey: sdk.accessKey,
  });
};

module.exports = {
  register,
  list,
  get,
  update,
  remove,
};
