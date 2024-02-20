'use strict';

const WS = require('isomorphic-ws');
const querystring = require('querystring');
const jwtDecode = require('jwt-decode');
const util = require('util');
const domains = require('./domains');
const resources = require('./resources');
const Connection = require('./Connection');
const registry = require('./registry');
const instance = require('./instance');
const events = require('./events');
const webhooks = require('./webhooks');
const accessKeys = require('./accessKeys');
const connections = require('./connections');
const desktop = require('./desktop');
const sessions = require('./sessions');
const apps = require('./apps');
const services = require('./services');
const utils = require('./utils');
const logDestinations = require('./logDestinations');
const deploymentProfiles = require('./deploymentProfiles');
const organizations = require('./organizations');
const metadata = require('./metadata');
const frameworkDeployments = require('./frameworkDeployments');

/**
 * The Serverless Platform SDK Class
 */
class ServerlessSDK {
  /**
   * Creates an instance of the SDK.  Accepts a configuration object and calls the `config()` method.  See the `config()` method for more information on allowed configuration.
   *
   * @param {string} [config.accessKey] Can either be a Serverless Platform Access Key or an ID Token.
   * @param {string} [config.platformStage] The Serverless Platform Stage you wish to interact with.  This can also be set by the environment variable SERVERLESS_PLATFORM_STAGE=
   * @param {string} [context.orgName] The name of the Serverless Platform Organization you wish to interact with.  If set, this value is used upon creating a Websockets connection, and auto-added to every Event you publish.
   * @param {string} [context.orgUid] The ID of the Serverless Platform Organization you wish to interact with.  If set, this value is used upon creating a Websockets connection, and auto-added to every Event you publish.
   * @param {string} [context.stageName] The Serverless Platform Organization Stage you wish to interact with.  If set, this value is auto-added to every Event you publish.
   * @param {string} [context.appName] The Serverless Platform Application you wish to interact with.  If set, this value is auto-added to every Event you publish.
   * @param {string} [context.instanceName] The Serverless Platform Instance you wish to interact with.  If set, this value is auto-added to every Event you publish.
   * @param {string} [context.componentName] The Serverless Platform Component you wish to interact with.  If set, this value is auto-added to every Event you publish.
   * @param {string} [context.componentVersion] The Serverless Platform Component version you wish to interact with.  If set, this value is auto-added to every Event you publish.
   * @return {null}
   *
   * @example
   *
   *   const { ServerlessSDK } = require('@serverless/platform-client')
   *
   *   const sdk = new ServerlessSDK({
   *     accessKey: '123456789',
   *     context: {
   *       orgName: 'my-org',
   *       orgUid: '1234',
   *       stageName: 'prod',
   *       appName: 'my-app',
   *       instanceName: 'my-instance'
   *     }
   *   })
   * @return {null}
   */
  constructor(config = {}) {
    this.context = {};
    // Set config
    this.config(config);
    // Domains
    this.domains = domains[this.platformStage];
    // Other
    this.intercepts = {};
    this.intercepts.logs = [];
    this.intercepts.logsInterval = 200;

    /**
     * Methods to create, update, delete User Sessions on the Serverless Platform
     * @namespace
     */
    this.session = {
      /**
       * Uses a Refresh Token to generate a new ID Token for a User within a specific Serverless Organization.
       *
       * @param {string} refreshToken The refresh token used to create a new ID Token.
       * @returns {Promise<object>}
       *
       * @example
       * const tokenData = await sdk.session.refreshToken(refreshToken);
       */
      refreshToken: (refreshToken) => sessions.refreshToken(this, refreshToken),
    };

    /**
     * Publish and retrieve Serverless Platform Events
     * @namespace
     */
    this.events = {
      /**
       * Publishes Serverless Platform Event(s) via HTTP API.  The use-case for this is synchronous publishing, where you do not want to open a websockets connection.
       * @param {(Object|Object[])} event An event object, or if publishing a batch of events, an array of event objects.
       * @param {string} event.event Event type. Serverless Platform system events are required to follow a `<entity>[.<sub-entity>].<action>` naming convention (e.g. `user.created`, `org.membership.updated`, etc).
       * @param {Object} event.data Event metadata. Serverless Platform system events are required to be formatted as described in the example below.
       * @returns {Promise<null>} A successful publish request will be ack'ed with a `200:OK` HTTP status and empty response.
       *
       * @example <caption>user event</caption>
       * sdk.config({ context: { orgUid: '3xVy2MWGFqpGYSlRMd' } });
       * await sdk.events.publish({
       *   event: 'user.created',
       *   data: {
       *     id: 'user-123',
       *     username: 'testuser',
       *   },
       * });
       *
       * @example <caption>system event</caption>
       * await sdk.events.publish({
       *   event: 'entity.updated', // follows a `<entity>[.<sub-entity>].<action>` naming convention
       *   user_uid: 'user-111', // user attributable for event action if applicable - optional
       *   // either of the following properties are required to be set and if not, inherit from current sdk context
       *   org_uid: 'org-42',
       *   org_name: 'serverless',
       *   // the following properties are optional and default to inheriting from current sdk context
       *   app_name: 'app-222',
       *   instance_name: 'instance-333',
       *   stage_name: 'us-east-1',
       *   component_name: 'component-444',
       *   component_version: '1.2.3',
       *   data: { // event payload - required and must match the format below
       *     object: { // Serverless Platform object targeted by action
       *       object: 'name',
       *       // ...properties
       *     },
       *     previous_attributes: { // only set on `*.updated` event types and contains modified property values as of before the update
       *       //...properties
       *     },
       *   },
       * });
       */
      publish: (event) =>
        events.publish(event, this.getDomain('events'), this.context, this.accessKey),

      /**
       * Retrieve a Serverless Platform Event.
       * @param {string} uid UID of event to be fetched.
       * @returns {Promise<Object>} An event object if a valid id was provided.
       *
       * @example
       * const event = await sdk.events.get('evt_EsbM82sYTVscqYvcD4CKcLe1');
       * console.log(JSON.stringify(event, null, 2));
       * // outputs:
       * // {
       * //   "uid": "evt_EsbM82sYTVscqYvcD4CKcLe1",
       * //   "event": "member.invite.sent",
       * //   "org_uid": "3xVy2MWGFqpGYSlRMd",
       * //   "user_uid": "ps4Vt2phVXsMyD0byW",
       * //   "object": "event",
       * //   "created": 1600686488878,
       * //   "data": {
       * //     "object": {
       * //       "org_uid": "3xVy2MWGFqpGYSlRMd",
       * //       "role": "collaborator",
       * //       "invited_by_user_uid": "ps4Vt2phVXsMyD0byW",
       * //       "created": "2020-09-21T11:08:08.603Z",
       * //       "recipient_email": "dev@serverless.com",
       * //       "org_name": "serverless",
       * //       "object": "invite"
       * //     }
       * //   }
       * // }
       */
      get: (uid) => events.get(uid, this.getDomain('events'), this.accessKey),

      /**
       * List all Serverless Platform events.
       * @param {Object=} options List options
       * @param {string} options.org_uid UID of the Serverless Platform Organization. Optional - defaults to inheriting from current SDK context.
       * @param {string} options.org_name Name of the Serverless Platform Organization. Optional - defaults to inheriting from current SDK context.
       * @param {string} options.event A string containing a specific event name, or all events by using `'*'` as a wildcard.
       * @param {number} options.limit A limit on the number of events to be returned. Limit can range between 1 and 100, and the default is 10.
       * @param {number} options.created A filter on the list based on the object created field. The value can be an integer Unix timestamp, or it can be a dictionary with the following options: - `created.gt`, `created.gte`, `created.lt`, `created.lte` returning results where the event `created` field is greater, greater than or equal to, lesser than, or lesser than or equal to respectively.
       * @param {string} options.starting_after A cursor for use in pagination. `starting_after` is an event ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with `evt_foo`, your subsequent call can include `starting_after=evt_foo` in order to fetch the next page of the list.
       * @returns {Promise<Object>} A dictionary with a `data` property that contains an array of up to `limit` events, starting after event `starting_after`. Each entry in the array is a separate `event` Object. If no more events are available, the resulting array will be empty.
       *
       * @example
       * const events = await sdk.events.list({
       *   event: 'member.invite.accepted',
       *   created: {
       *     gte: 1600686488878,
       *   },
       *   limit: 1,
       * });
       * console.log(JSON.stringify(events, null, 2));
       * // outputs:
       * // {
       * //   "object": "list",
       * //   "data": [
       * //     {
       * //       "uid": "evt_DdUCdz2tsY7gZr1a9Z6Xw9BD",
       * //       "event": "member.invite.accepted",
       * //       "object": "event",
       * //       "created": 1600707548900,
       * //       "data": {
       * //         "object": {
       * //            "object": "invite",
       * //            "org_uid": "3xVy2MWGFqpGYSlRMd",
       * //            "role": "collaborator",
       * //            "invited_by_user_uid": "ps4Vt2phVXsMyD0byW",
       * //            "recipient_email": "dev@serverless.com",
       * //            "org_name": "serverless",
       * //            "created": "2020-09-21T11:08:08.603Z",
       * //         }
       * //       }
       * //     }
       * //   ]
       * // }
       */
      list: (options = {}) =>
        events.list(this.getDomain('events'), this.context, this.accessKey, options),

      /**
       * Dispatches a Serverless Platform Event via Websockets. The use-case for this is asynchronous publishing, where you do not want to synchronous auth requests, where every message must be authorized first, adding latency.
       * @deprecated since v2.0 - use {@link ServerelessSDK.events.publish} instead
       * @param {(Object|Object[])} event An event object, or if publishing a batch of events, an array of event objects.
       * @param {string} event.event Event type. Serverless Platform system events are required to follow a `<entity>[.<sub-entity>].<action>` naming convention (e.g. `user.created`, `org.membership.updated`, etc).
       * @param {Object} event.data Event metadata. Serverless Platform system events are required to be formatted as described in the example below.
       * @returns {Promise<null>} A successful publish request will be ack'ed with a `200: OK` HTTP status and empty response.
       * @see {@link ServerlessSDK#events.publish}
       */
      send: (event) => events.send(event, this.connection, this.context, this.accessKey),
    };

    /**
     * Manage Serverless Platform Deployments for Serverless Framework Traditional
     * @namespace
     */
    this.frameworkDeployments = {
      /**
       * Create a new Serverless Platform Deployment. Additionally, if Service with provided `serviceName` does not exist, it will be created automatically as well.
       *
       * @param {Object=} params Create deployment params.
       * @param {string} params.orgName The name of the Serverless Platform Organization to create the Deployment in.
       * @param {string} params.appName The name of the Serverless Platform Application to create the Deployment in.
       * @param {string} params.serviceName The name of the Serverless Platform Service to create the Deployment in.
       * @param {string} params.stageName The name of the Serverless Service Stage to create the Deployment in.
       * @param {string} params.regionName  The name of the AWS Region to create the Deployment in.
       * @param {Object} params.deploymentData Data associated with saved deployment
       * @returns {Promise<object>} Saved deployment object.
       */
      create: async (options) => frameworkDeployments.create(this, options),

      /**
       * List Serverless Platform Deployments.
       *
       * @param {Object=} params List deployment params.
       * @param {string} params.orgName The name of the Serverless Platform Organization to list the Deployments for.
       * @param {string} params.appName The name of the Serverless Platform Application to list the Deployment for.
       * @param {string} params.serviceName The name of the Serverless Platform Service to list the Deployment for.
       * @param {string} params.stageName The name of the Serverless Service Stage to list the Deployment for.
       * @param {string} params.regionName  The name of the AWS Region to list the Deployment for.
       * @param {string} params.cursor The cursor from which Deployments should be listed. Used for pagination.
       * @returns {Promise<array>} Array of Deployments.
       */
      list: async (options) => frameworkDeployments.list(this, options),
    };

    /**
     * Register, modify and query Serverless Platform Event Webhooks
     * @namespace
     */
    this.webhooks = {
      /**
       * Registers a webhook endpoint to receive Serverless Platform events.
       *
       * Endpoint should be able to receieve JSON formatted events as a HTTP POST payload.
       * Furthermore, a `3` second timeout limit is enforced on event delivery with no additional retries performed.
       * The following HTTP headers are set on the POST request:
       * | Header                  | Value                           |
       * | ----------------------- | ------------------------------- |
       * | `Content-type`          | `application/json`              |
       * | `X-Serverless-Event`    | Event type                      |
       * | `X-Serverless-Delivery` | Unique delivery ID              |
       * | `User-Agent`            | Prefix of `Serverless-Webhook/` |
       *
       * @param {string} url HTTP webhook endpoint URL.
       * @param {Object=} options Registration options.
       * @param {string} options.description An optional description of what the webhook is used for.
       * @param {string} options.org_uid UID of the Serverless Platform Organization. Optional - defaults to inheriting from current SDK context. If registering a Serverless Platform system webhook, use a special wildcard value of `'*'` to consume events generated from *all* orgs.
       * @param {string} options.org_name Name of the Serverless Platform Organization. Optional - defaults to inheriting from current SDK context.
       * @param {Object} options.filter Optionally, filter which events this endpoint should receive.
       * @param {string[]} options.filter.enabled_events The list of events to enable for this endpoint. `["*"]` indicates that all events are enabled.
       * @returns {Promise<object>} Registered webhook endpoint.
       *
       * @example
       * const webhook = await sdk.webhooks.register(
       *   'https://postb.in/1598300732037-0682672155089',
       *   { description: 'This is my webhook, I like it a lot' },
       * );
       * console.log(JSON.stringify(webhook, null, 2));
       * // outputs:
       * // {
       * //   "uid": "whe_FPYDtTL37ye13m3sJvtcdyuF",
       * //   "object": "webhook_endpoint",
       * //   "url": "https://postb.in/1598300732037-0682672155089",
       * //   "description": "This is my webhook, I like it a lot",
       * //   "filter": {
       * //     "enabled_events": [
       * //       "*"
       * //     ]
       * //   },
       * //   "status": {
       * //     "disabled": false
       * //   },
       * //   "created": 1602078105978
       * // }
       */
      register: (url, options = {}) => webhooks.register(this, url, options),

      /**
       * Lists all regsitered webhook endpoints.
       * @param {Object=} options List options.
       * @param {string} options.starting_after A cursor for use in pagination. `starting_after` is a webhook endpoint object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with `whe_foo`, your subsequent call can include `starting_after=whe_foo` in order to fetch the next page of the list.
       * @param {number} options.limit A limit on the number of webhook endpoints to be returned. Limit can range between 1 and 100, and the default is 10.
       * @returns {Promise<object>} A dictionary with a `data` property that contains an array, with each entry being a `webhook` object.
       *
       * @example
       * const webhooks = await sdk.webhooks.list({
       *   limit: 1,
       * });
       * console.log(JSON.stringify(webhooks, null, 2));
       * // outputs:
       * // {
       * //   "object": "list",
       * //   "data": [
       * //     {
       * //       "uid": "whe_FPYDtTL37ye13m3sJvtcdyuF",
       * //       "object": "webhook_endpoint",
       * //       "url": "https://postb.in/1598300732037-0682672155089",
       * //       "description": "This is my webhook, I like it a lot",
       * //       "filter": {
       * //         "enabled_events": ["*"]
       * //       },
       * //       "status": {
       * //         "disabled": false,
       * //         "most_recent_delivery": {
       * //           "event_uid": "evt_5cmXN7kqdu5YY69HFKegmiGR",
       * //           "response_status_code": 200,
       * //           "response_headers": {
       * //             "content-length": "12",
       * //             "connection": "close",
       * //             "content-type": "application/json"
       * //           },
       * //           "request_headers": {
       * //             "User-Agent": "Serverless-Webhook/0.1",
       * //             "Content-type": "application/json",
       * //             "X-Serverless-Delivery": "e1701c44-5d92-4515-8bfb-6c9173a89b60",
       * //             "X-Serverless-Event": "test.webhook.send2"
       * //           },
       * //           "response_text": "{\"ok\": true}",
       * //           "error_message": null,
       * //           "timestamp": 1599595612876
       * //         }
       * //       },
       * //       "created": 1599591851267,
       * //       "updated": 1599595613099
       * //     },
       * //   ]
       * // }
       */
      list: (options = {}) => {
        const { starting_after: startingAfter, limit = 10 } = options;
        return webhooks.list(this, startingAfter, limit);
      },

      /**
       * Retrieves a webhook endpoint with the given ID.
       * @param {string} uid Webhook endpoint ID.
       * @returns {Promise<object>} A webhook endpoint if a valid webhook endpoint ID was provided.
       *
       * @example
       * const webhook = await sdk.webhooks.get('whe_FPYDtTL37ye13m3sJvtcdyuF');
       * console.log(JSON.stringify(webhook, null, 2));
       * // outputs:
       * // {
       * //   "uid": "whe_FPYDtTL37ye13m3sJvtcdyuF",
       * //   "object": "webhook_endpoint",
       * //   "url": "https://postb.in/1598300732037-0682672155089",
       * //   "description": "This is my webhook, I like it a lot",
       * //   "filter": {
       * //     "enabled_events": ["*"]
       * //   },
       * //   "status": {
       * //     "disabled": false,
       * //     "most_recent_delivery": {
       * //       "event_uid": "evt_5cmXN7kqdu5YY69HFKegmiGR",
       * //       "response_status_code": 200,
       * //       "response_headers": {
       * //         "content-length": "12",
       * //         "connection": "close",
       * //         "content-type": "application/json"
       * //       },
       * //       "request_headers": {
       * //         "User-Agent": "Serverless-Webhook/0.1",
       * //         "Content-type": "application/json",
       * //         "X-Serverless-Delivery": "e1701c44-5d92-4515-8bfb-6c9173a89b60",
       * //         "X-Serverless-Event": "test.webhook.send2"
       * //       },
       * //       "response_text": "{\"ok\": true}",
       * //       "error_message": null,
       * //       "timestamp": 1599595612876
       * //     }
       * //   },
       * //   "created": 1599591851267,
       * //   "updated": 1599595613099
       * // }
       */
      get: (uid) => webhooks.get(this, uid),

      /**
       * Updates the registered webhook endpoint. You may edit the url, description, the list of filters, and the status of your endpoint.
       * @param {string} uid Webhook endpoint ID.
       * @param {string} updates.url HTTP webhook endpoint url, if updating.
       * @param {string} updates.description An optional updated description of what the webhook is used for.
       * @param {Object} updates.filter Optionally, update filter which events this endpoint should receive. An existing filter can reset by setting it to `null`.
       * @param {string[]} updates.filter.enabled_events The list of events to enable for this endpoint. `["*"]` indicates that all events are enabled.
       * @param {boolean} updates.status.disabled Enable/disable the webhook endpoint.
       * @returns {Promise<object>} Updated webhook endpoint.
       *
       * @example
       * const webhook = await sdk.webhooks.update( 'whe_FPYDtTL37ye13m3sJvtcdyuF', {
       *   url: 'http://437f01fa092e.ngrok.io',
       *   filter: {
       *     enabled_events: [
       *       'user.created',
       *       'member.invite.sent'
       *     ]
       *   }
       * });
       * console.log(JSON.stringify(webhook, null, 2));
       * // outputs:
       * // {
       * //   "uid": "whe_FPYDtTL37ye13m3sJvtcdyuF",
       * //   "object": "webhook_endpoint",
       * //   "url": "http://437f01fa092e.ngrok.io",
       * //   "description": "This is my webhook, I like it a lot",
       * //   "filter": {
       * //     "enabled_events": [
       * //       "user.created",
       * //       "member.invite.sent"
       * //     ]
       * //   },
       * //   "status": {
       * //     "disabled": false
       * //   },
       * //   "created": 1602078105978,
       * //   "updated": 1602078663800
       * // }
       */
      update: (uid, updates) => webhooks.update(this, uid, updates || {}),

      /**
       * Deletes the webhook endpoint with the given ID.
       * @param {string} uid Webhook endpoint ID.
       * @returns {Promise<object>} An object with the deleted webhook endpoints’s ID if a valid webhook endpoint ID was provided. Otherwise, this call throws an error, such as if the webhook endpoint has already been deleted.
       *
       * @example
       * const webhook = await sdk.webhooks.delete('whe_FPYDtTL37ye13m3sJvtcdyuF');
       * console.log(JSON.stringify(webhook, null, 2));
       * // outputs:
       * // {
       * //   "uid": "whe_FPYDtTL37ye13m3sJvtcdyuF",
       * //   "object": "webhook_endpoint",
       * //   "url": "http://437f01fa092e.ngrok.io",
       * //   "description": "This is my webhook, I like it a lot",
       * //   "filter": {
       * //     "enabled_events": [
       * //       "user.created",
       * //       "member.invite.sent"
       * //     ]
       * //   },
       * //   "status": {
       * //     "disabled": false
       * //   },
       * //   "created": 1602078105978,
       * //   "updated": 1602078663800
       * // }
       */
      delete: (uid) => webhooks.remove(this, uid),
    };

    /**
     * Create, get and delete Serverless Platform Access Keys for an Organization
     * @namespace
     */
    this.accessKeys = {
      /**
       * Creates a new Access Key for a User within a Serverless Organization.
       *
       * @param {string} orgName The name of the Serverless Organization to create the Access Key for
       * @param {string} userName The name of the User within the Serverless Organization to create the Access Key for
       * @param {string} accessKeyName The name of the Access Key you would like to create
       * @returns {Promise<object>}
       *
       * @example
       * const accessKey = await sdk.accessKeys.create(orgName, accessKeyName);
       */
      create: (orgName, userName, accessKeyName) =>
        accessKeys.create(this, orgName, userName, accessKeyName),
      /**
       * Lists all Access Keys within a Serverless Organization.
       *
       * @param {string} orgName The name of the Serverless Organization to list Access Keys
       * @returns {Promise<object>}
       *
       * @example
       * const accessKeys = await sdk.accessKeys.list(orgName);
       */
      list: (orgName) => accessKeys.list(this, orgName),
      /**
       * Delete an Access Key from a Serverless Organization.
       *
       * @param {string} orgName The name of the Serverless Organization that the Access Key belongs to
       * @param {string} uid The UID of the Access Key
       * @returns {Promise<object>}
       *
       * @example
       * const accessKeys = await sdk.accessKeys.remove(orgName, uid);
       */
      remove: (orgName, uid) => accessKeys.remove(this, orgName, uid),
      /**
       * Get metadata for the Access Key configured under `sdk.accessKey`
       *
       * @returns {Promise<object | null>}
       *
       * @example
       * const accessKeyData = await sdk.accessKeys.get();
       */
      get: () => accessKeys.get(this),
    };

    /**
     * Create, manage and sync Serverless Platform Connections between vendor accounts and their Serverless Organization.
     * @namespace
     */
    this.connections = {
      /**
       * Creates a new Connection between a vendor account and a Serverless Organization.
       *
       * @param {string} orgUid The UID of the Serverless Organization to create a Connection in.
       * @param {string} providerUid The UID of an existing Serverless Provider tied to a vendor account within the Organization to use for this Connection.  A vendor account (e.g. an AWS account) can only be registered once with a Connection, across all Serverless Organizations.  They are globally unique.
       * @param {string} accountAlias An alias or nickname of the vendor account used to conveniently identify which account this Connection is used with.  This must be unique within the Serverless Organization.
       * @returns {Promise<object>}
       */
      create: (orgUid, providerUid, accountAlias) =>
        connections.create(this, orgUid, providerUid, accountAlias),
      /**
       * List all Connections within the Serverless Organization.
       *
       * @param {string} orgUid The UID of the Serverless Organization to create a Connection in.
       * @returns {Promise<object>}
       */
      list: (orgUid) => connections.list(this, orgUid),
      /**
       * Get a single Connection within the Serverless Organization.
       *
       * @param {string} orgUid The UID of the Serverless Organization to get a Connection in.
       * @param {string} connectionUid The UID of the Connection to get within the Serverless Organization.
       * @returns {Promise<object>}
       */
      get: (orgUid, connectionUid) => connections.get(this, orgUid, connectionUid),
      /**
       * Get a single Connection by Organization UID and vendor account alias within the Serverless Organization.
       *
       * @param {string} orgUid The UID of the Serverless Organization to get a Connection in.
       * @param {string} accountAlias The alias of the Connection to get within the Serverless Organization.
       * @returns {Promise<object>}
       */
      getByOrgAndAccountAlias: (orgUid, accountAlias) =>
        connections.getByOrgAndAccountAlias(this, orgUid, accountAlias),
      /**
       * Update a single Connection within the Serverless Organization.
       *
       * @param {string} orgUid The UID of the Serverless Organization to update a Connection in.
       * @param {string} connectionUid The UID of the Connection to update within the Serverless Organization.
       * @param {string} providerUid The updated Provider UID within the Connection.
       * @param {string} accountAlias The updated alias of the Connection.
       * @param {string} status The updated status of the Connection.
       * @returns {Promise<object>}
       */
      update: (orgUid, connectionUid, providerUid, accountAlias, status) =>
        connections.update(this, orgUid, connectionUid, providerUid, accountAlias, status),
      /**
       * Remove a single Connection within the Serverless Organization.
       *
       * @param {string} orgUid The UID of the Serverless Organization to remove a Connection in.
       * @param {string} connectionUid The UID of the Connection to remove within the Serverless Organization.
       * @returns {Promise<object>}
       */
      remove: (orgName, connectionUid) => connections.remove(this, orgName, connectionUid),
      /**
       * Run a sync operation across all Connections within the Serverless Organization.  This only runs sync on Connections with an "inactive", "synced", "unsynced", "error" state.  Call `connections.list()` to view status of all Connections.
       *
       * @param {string} orgUid The UID of the Serverless Organization to sync all Connections in.
       * @returns {Promise<object>}
       */
      syncAll: (orgUid) => connections.syncAll(this, orgUid),
      /**
       * Run an unsync operation on a specific Connection within the Serverless Organization.  This only runs sync on Connections with an "synced", "error" state.  Call `connections.list()` to view status of all Connections.
       *
       * @param {string} orgUid The UID of the Serverless Organization to sync all Connections in.
       * @param {string} connectionUid The UID of the Connection to unsync within the Serverless Organization.
       * @returns {Promise<object>}
       */
      unsync: (orgUid, connectionUid) => connections.unsync(this, orgUid, connectionUid),
    };

    /**
     * Interact with the Serverless Desktop back-end functions, like storing state for views.
     * @namespace
     */
    this.desktop = {
      /**
       * Create a Saved Query for a Service by specifying some data.
       *
       * @param {string} orgUid The UID of the Serverless Organization to create the Saved Query in.
       * @param {string} appUid The UID of the Serverless Application to create the Saved Query in.
       * @param {string} serviceName The name of the Serverless Service to create the Saved Query in.
       * @param {string} savedQuery The object of arbitrary data you would like to save for this Serverless Service.
       * @returns {Promise<object>}
       */
      createSavedQuery: (orgUid, appUid, serviceName, savedQuery) =>
        desktop.createSavedQuery(this, orgUid, appUid, serviceName, savedQuery),
      /**
       * Get Saved Query for a Service Stage via its key.
       *
       * @param {string} orgUid The UID of the Serverless Organization to get the Saved Query from.
       * @param {string} appUid The UID of the Serverless Application to get the Saved Query from.
       * @param {string} serviceName The name of the Serverless Service to get the Saved Query from.
       * @param {string} savedQueryUid The UID of the Saved Query to get for this Serverless Service.
       * @returns {Promise<object>}
       */
      getSavedQuery: (orgUid, appUid, serviceName, savedQueryUid) =>
        desktop.getSavedQuery(this, orgUid, appUid, serviceName, savedQueryUid),
      /**
       * Update a Saved Query for a Service by specifying the UID and the data.
       *
       * @param {string} orgUid The UID of the Serverless Organization to create the Saved Query in.
       * @param {string} appUid The UID of the Serverless Application to create the Saved Query in.
       * @param {string} serviceName The name of the Serverless Service to create the Saved Query in.
       * @param {string} savedQueryUid The UID of the Saved Query to get for this Serverless Service.
       * @param {string} savedQuery The object of arbitrary data you would like to save for this Serverless Service.
       * @returns {Promise<object>}
       */
      updateSavedQuery: (orgUid, appUid, serviceName, savedQueryUid, savedQuery) =>
        desktop.updateSavedQuery(this, orgUid, appUid, serviceName, savedQueryUid, savedQuery),
      /**
       * Delete Saved Query for a Service Stage by specifying its key.
       *
       * @param {string} orgUid The UID of the Serverless Organization to delete the Saved Query from.
       * @param {string} appUid The UID of the Serverless Application to delete the Saved Query from.
       * @param {string} serviceName The name of the Serverless Service to delete the Saved Query from.
       * @param {string} savedQueryUid The UID of the Saved Query to delete for this Serverless Service.
       * @returns {Promise<object>}
       */
      deleteSavedQuery: (orgUid, appUid, serviceName, savedQueryUid) =>
        desktop.deleteSavedQuery(this, orgUid, appUid, serviceName, savedQueryUid),
      /**
       * List Saved Queries for a Service.
       *
       * @param {string} orgUid The UID of the Serverless Organization to list the Saved Queries from.
       * @param {string} appUid The UID of the Serverless Application to list the Saved Queries from.
       * @param {string} serviceName The name of the Serverless Service to list the Saved Queries from.
       * @returns {Promise<object>}
       */
      listSavedQueries: (orgUid, appUid, serviceName) =>
        desktop.listSavedQueries(this, orgUid, appUid, serviceName),
    };

    /**
     * Manage Log Destinations for your Organization
     *
     * Log Destination is represented by CloudWatch Logs Destination resource that is responsible for forwarding logs from selected service
     * to Kinesis streams. These logs are later forwarded form Kinesis streams to Elasticsearch service.
     *
     * @namespace
     */
    this.logDestinations = {
      /**
       * Get or Create Log Destination.
       * If Log Destination already exists for a service in selected region and for selected stage, it will be returned, otherwise it will be created.
       *
       * @param {Object=} params Get or Create params
       * @param {string} params.orgUid The UID of the Serverless Organization to create the Log Destination for.
       * @param {string} params.appUid The UID of the Serverless Application to create the Log Destination for.
       * @param {string} params.serviceName The name of the Serverless Service to create the Log Destination for.
       * @param {string} params.stageName The name of the Serverless Service Stage to create the Log Destination for.
       * @param {string} params.regionName The name of the AWS Region to create the Log Destination for.
       * @param {string} params.accountId The ID of the AWS Account to create the Log Destination for.
       * @returns {Promise<object>}
       *
       * @example
       * const result = await sdk.logDestinations.getOrCreate({
       *   orgUid: '1234',
       *   appUid: '123456789',
       *   serviceName: 'log-dest-integration-test-service-name',
       *   stageName: 'log-dest-integration-test-stage',
       *   regionName: 'us-east-1',
       *   accountId: '111111111111',
       * });
       * console.log(JSON.stringify(result, null, 2));
       * // outputs:
       * // {
       * //   "destinationArn": "arn:aws:logs:us-east-1:111111111111:destination:c492b73f-3704-4d5b-839a-d4fbc7adc328#123456789#log-dest-integration-test-service-name#log-dest-integration-test-stage",
       * // }
       */
      getOrCreate: async (params) => logDestinations.getOrCreate(this, params),

      /**
       * Remove Log Destination
       *
       * @param {Object=} params Remove params
       * @param {string} params.orgUid The UID of the Serverless Organization to remove the Log Destination from.
       * @param {string} params.appUid The UID of the Serverless Application to remove the Log Destination from.
       * @param {string} params.serviceName The name of the Serverless Service to remove the Log Destination from.
       * @param {string} params.stageName The name of the Serverless Service Stage to remove the Log Destination from.
       * @param {string} params.regionName The name of the AWS Region to remove the Log Destination from.
       * @returns {Promise<object>}
       *
       * @example
       * await sdk.logDestinations.remove({
       *   orgUid: '1234',
       *   appUid: '123456789',
       *   serviceName: 'log-dest-integration-test-service-name',
       *   stageName: 'log-dest-integration-test-stage',
       *   regionName: 'us-east-1',
       * });
       */
      remove: async (params) => logDestinations.remove(this, params),
    };

    /**
     * Manage Deployment Profiles for your Organization
     * @namespace
     */
    this.deploymentProfiles = {
      /**
       * Get a Deployment Profile associated with an Application
       *
       * @param {Object=} params Get params
       * @param {string} params.orgName The name of the Serverless Organization.
       * @param {string} params.appName The name of the Serverless Organization.
       * @param {string} params.serviceName The name of the Serverless Service.
       * @param {string} params.stageName The name of the Serverless Service Stage.
       * @returns {Promise<Object>}
       */
      get: async (params) => deploymentProfiles.get(this, params),

      /**
       * Create a Deployment Profile
       *
       * @param {Object=} params Create params
       * @param {string} params.profileName The name of the created Deployment Profile.
       * @param {string} params.orgName The name of the Serverless Organization.
       * @param {string} params.description Optional The description for the created Deployment Profile.
       * @param {array} params.secrets Optional The secrets for the created Deployment Profile.
       * @param {array} params.safeguardsPolicies Optional The safeguard policies for the created Deployment Profile.
       * @param {object} params.providerCredentials Optional The provider credentials for the created Deployment Profile.
       * @returns {Promise<Object>} Created Deployment Profile
       */
      create: async (params) => deploymentProfiles.create(this, params),

      /**
       * List Deployment Profiles
       *
       * @param {Object=} params List params
       * @param {string} params.orgName The name of the Serverless Organization.
       * @returns {Promise<array>} Array of DeploymentProfile objects.
       */
      list: async (params) => deploymentProfiles.list(this, params),

      /**
       * Set default Deployment Profile for an Application
       *
       * @param {Object=} params Get params
       * @param {string} params.orgName The name of the Serverless Organization.
       * @param {string} params.appName The name of the Serverless Organization.
       * @param {string} params.profileUid The UID of the Deployment Profile that should be associated with an Application.
       * @returns {Promise<Object>}
       */
      setDefault: async (params) => deploymentProfiles.setDefault(this, params),
    };

    /**
     * Create, get and list Serverless Platform Organizations.
     * @namespace
     */
    this.organizations = {
      /**
       * Gets an Organization
       * @param {Object=} params Get organization params
       * @param {string} params.orgName The name of the Organization you wish to retrieve.
       * @return {object} Returns the Organization record.
       */
      get: async (params) => organizations.get(this, params),

      /**
       * List organizations
       * @param {Object=} params List organizations params
       * @param {string} params.username The name of the User whose Organizations you wish to list.
       * @return {array} Returns an array of Organizations
       */
      list: async (params) => organizations.list(this, params),

      /**
       * Creates an Organization and User if one does not exist.
       * @param {Object=} params Create organization params
       * @param {string} params.orgName The name of the Organization you wish to create.
       * @param {string} params.username Optional The username for a User that will be created if one does not exist. If it's not provided, it will default to `params.orgName`.
       * @param {string} params.email Optional The email that will be associated with created User.
       * @param {string} params.password Optional The password that will be associated with created User.
       * @return {object} Returns the newly created Organization.
       */
      create: async (params) => organizations.create(this, params),

      /**
       * Validates whether a potential User and Organization name meets the Platform requirements.  Most importantly, this calls the Platform to validate whether the User and Organization names are already taken.  This method is necessary because every User must have an Organization and we want to be sure both namespaces are available, before creating one or the other.  In the future, both of these records should be created in the back-end, not on the client-side.  Until then, this method is essential.
       * @param {Object=} params Validate params
       * @param {string} params.orgName The name of the Organization.
       * @param {string} params.username Optional The username for a User. If it's not provided, it will default to `params.orgName`.
       * @return {array} Returns an array of validation errors, if any.  Otherwise, returns null.
       */
      validate: async (params) => organizations.validate(this, params),
    };

    /**
     * Register, update, delete and list Applications
     * @namespace
     */
    this.apps = {
      /**
       * Create an Application within an Organization
       * @param {Object=} params Create app params
       * @param {string} params.orgName The name of the Organization you wish to create an Application in.
       * @param {string} params.app.name The name of the Application.
       * @param {string} params.app.description The description of the Application.
       * @param {object} params.app.deploymentProfiles An object of deployment profiles and stages.  This structure is a bit confusing.  Look at the back-end service for more details and hopefully we can design this more elegantly in the future.
       * @return {object} Returns a data object of the newly created Application
       */
      create: async (params) => apps.create(this, params),

      /**
       * Get an Application within an Organization
       * @param {Object=} params Get app params
       * @param {string} params.orgName The name of the Organization the Application belongs to.
       * @param {string} params.appName The name of the Application you want to retrieve.
       */
      get: async (params) => apps.get(this, params),

      /**
       * Update an Application within an Organization
       * @param {Object=} params Update app params
       * @param {string} params.orgName The name of the Organization the Application belongs to.
       * @param {string} params.app.name The name of the Application you wish to update.  This property cannot be updated due to current data modeling issues.
       * @param {string} params.app.description The description of the Application.  This property can be updated.
       * @param {object} params.app.deploymentProfiles An object of deployment profiles and stages.  This property can be updated.  This structure is a bit confusing. Look at the back-end service for more details and hopefully we can design this more elegantly in the future.
       * @return {object} Returns a data object of the updated Application
       */
      update: async (params) => apps.update(this, params),

      /**
       * Delete an Application within an Organization
       * @param {Object=} params Update app params
       * @param {string} params.orgName The name of the Organization the Application belongs to.
       * @param {string} params.appName The name of the Application you wish to delete.
       */
      remove: async (params) => apps.remove(this, params),

      /**
       * List all Applications within an Organization
       * @param {Object=} params Update app params
       * @param {string} params.orgName The name of the Organization the Application belongs to.
       */
      list: async (params) => apps.list(this, params),
    };

    /**
     * Get Metadata for Serverless Platform
     * @namespace
     */
    this.metadata = {
      /**
       * Get Metadata for Serverless Platform, which includes informations about regions and runtimes that are supported by the platform.
       * @returns {Promise<Object>} A dictionary with an `awsAccountId`, `supportedRegions` and `supportedRuntimes` properties. Both `supportedRuntimes` and `supportedRegions` are arrays.

       * @example
       * const metadata = await sdk.metadata.get();
       * console.log(JSON.stringify(metadata, null, 2));
       * // outputs:
       * // {
       * //   "awsAccountId": "111111111111",
       * //   "supportedRuntimes": [
       * //     "nodejs8.10",
       * //     "nodejs10.x",
       * //     "nodejs12.x",
       * //     "python2.7",
       * //     "python3.6",
       * //     "python3.7",
       * //     "python3.8"
       * //   ],
       * //   "supportedRegions": [
       * //     "us-east-1",
       * //     "us-east-2",
       * //     "us-west-1",
       * //     "us-west-2",
       * //     "eu-central-1",
       * //     "eu-west-1",
       * //     "eu-west-2",
       * //     "eu-west-3",
       * //     "ap-northeast-1",
       * //     "ap-southeast-1",
       * //     "ap-southeast-2",
       * //     "eu-central-1",
       * //     "ap-south-1",
       * //     "ca-central-1",
       * //     "sa-east-1"
       * //   ]
       * // }
       */
      get: async () => metadata.get(this),
    };

    /*
     * Methods to get Services and corresponding State Variables from the Serverless Platform
     * @namespace
     */
    this.services = {
      /**
       * Gets a Service from selected app within a specific Serverless Organization.
       *
       * @param {Object=} params Get service params.
       * @param {string} params.orgName The name of the Serverless Platform Organization.
       * @param {string} params.appName The name of the Serverless Platform Application.
       * @param {string} params.serviceName The name of the Serverless Platform Service.
       * @returns {Promise<object>}
       *
       * @example
       * const result = await sdk.services.get({
       *   orgName: 'your-organization',
       *   appName: 'your-app-name',
       *   serviceName: 'your-service-name',
       * });
       * console.log(JSON.stringify(result, null, 2));
       * // outputs:
       * // {
       * //   "appId": "some app id",
       * //   "tenantName": "your-organization",
       * //   "tenantUid": "unique-tenant-id",
       * //   "appName": "your-app-name",
       * //   "appUid": "unique-app-id",
       * //   "serviceName": "your-service-name",
       * //   "stagesAndRegions": {
       * //     "dev": {
       * //       "us-east-1": {
       * //         "outputs": {},
       * //         "createdAt": "2021-02-08T14:00:56.741Z",
       * //         "updatedAt": "2021-02-08T14:00:56.741Z",
       * //         "lastActionBy": "youraccount"
       * //       }
       * //     }
       * //   },
       * //   "vcs": {},
       * //   "lastActionBy": "youraccount",
       * //   "isArchived": false,
       * //   "onboarding": false,
       * //   "createdAt": "2021-02-08T14:00:56.741Z",
       * //   "updatedAt": "2021-02-10T14:00:56.741Z",
       * //   "stateItems": []
       * // }
       */
      get: async (params) => services.get(this, params),

      /**
       * Get a State Variable (Output) for a selected Service
       *
       * @param {Object=} params Get state variable params.
       * @param {string} params.orgName The name of the Serverless Platform Organization.
       * @param {string} params.appName The name of the Serverless Platform Application.
       * @param {string} params.serviceName The name of the Serverless Platform Service.
       * @param {string} params.stageName The name of the Serverless Service Stage.
       * @param {string} params.regionName The name of the AWS Region.
       * @param {string} params.variableName The name of the State Variable to return.
       * @returns {Promise<object>}
       *
       * @example
       * const result = await sdk.services.get({
       *   orgName: 'your-organization',
       *   appName: 'your-app-name',
       *   serviceName: 'your-service-name',
       *   stageName: 'dev',
       *   regionName: 'us-east-1',
       *   variableName: 'outputName',
       * });
       * console.log(JSON.stringify(result, null, 2));
       * // outputs:
       * // {
       * //   "value": "outputValue"
       * // }
       */
      getStateVariable: async (params) => services.getStateVariable(this, params),
    };
  }

  /**
   * Updates the SDK configuration
   * @method
   * @param {string} [config.accessKey] Can either be a Serverless Platform Access Key or an ID Token.
   * @param {string} [config.platformStage] The Serverless Platform Stage you wish to interact with.  This can also be set by the environment variable SERVERLESS_PLATFORM_STAGE=
   * @param {string} [context.orgName] The name of the Serverless Platform Organization you wish to interact with.  If set, this value is used upon creating a Websockets connection, and auto-added to every Event you publish.
   * @param {string} [context.orgUid] The ID of the Serverless Platform Organization you wish to interact with.  If set, this value is used upon creating a Websockets connection, and auto-added to every Event you publish.
   * @param {string} [context.stageName] The Serverless Platform Organization Stage you wish to interact with.  If set, this value is auto-added to every Event you publish.
   * @param {string} [context.appName] The Serverless Platform Application you wish to interact with.  If set, this value is auto-added to every Event you publish.
   * @param {string} [context.instanceName] The Serverless Platform Instance you wish to interact with.  If set, this value is auto-added to every Event you publish.
   * @param {string} [context.componentName] The Serverless Platform Component you wish to interact with.  If set, this value is auto-added to every Event you publish.
   * @param {string} [context.componentVersion] The Serverless Platform Component version you wish to interact with.  If set, this value is auto-added to every Event you publish.
   * @return {null}
   *
   * @example
   *
   *   const { ServerlessSDK } = require('@serverless/platform-client')
   *
   *   const sdk = new ServerlessSDK()
   *   sdk.config({
   *     accessKey: '123456789',
   *     context: {
   *       orgName: 'my-org',
   *       orgUid: '1234',
   *       stageName: 'prod',
   *       appName: 'my-app',
   *       instanceName: 'my-instance'
   *     }
   *   })
   */
  config(config = {}) {
    this.accessKey = config.accessKey || this.accessKey; // Can be either an Access Key or an ID Token
    this.platformStage = process.env.SERVERLESS_PLATFORM_STAGE || config.platformStage || 'prod';
    config.context = config.context || {};
    this.context.orgUid = config.context.orgUid || this.context.orgUid || null;
    this.context.orgName = config.context.orgName || this.context.orgName || null;
    this.context.stageName = config.context.stageName || this.context.stageName || null;
    this.context.appName = config.context.appName || this.context.appName || null;
    this.context.instanceName = config.context.instanceName || this.context.instanceName || null;
    this.context.componentName = config.context.componentName || this.context.componentName || null;
    this.context.componentVersion =
      config.context.componentVersion || this.context.componentVersion || null;
  }

  /**
   * Gets a domain for a specific service: 'engine', 'registry', 'events-streaming'
   * @param {string} serviceName The name of the Serverless Platform Service you want the domain for.
   * @return {string} The domain of that service.
   */
  getDomain(serviceName = null) {
    return this.domains[serviceName] || null;
  }

  loginIdentity(config = {}) {
    // Introduce default loginBrokerUrl to not require passing it explicitly
    const loginBrokerUrl = config.loginBrokerUrl
      ? `${config.loginBrokerUrl}broker`
      : `${this.getDomain('core')}/login/broker`;
    const ws = new WS(loginBrokerUrl, undefined, {
      followRedirects: true,
      agent: utils.getAgent(),
    });

    let resolveTransactionId;
    let rejectTransactionId;
    const transactionId = new Promise((resolve, reject) => {
      resolveTransactionId = resolve;
      rejectTransactionId = reject;
    });

    let resolveLoginData;
    let rejectLoginData;
    const loginData = new Promise((resolve, reject) => {
      resolveLoginData = resolve;
      rejectLoginData = reject;
    });

    const sanitizeLoginData = (data) => {
      delete data.event;
      const decoded = jwtDecode(data.id_token);

      return {
        id: decoded.tracking_id || decoded.sub, // Auth0 User ID
        name: decoded.name,
        email: decoded.email,
        username: data.username,
        user_uid: data.user_uid, // Dashboard User UID
        refreshToken: data.refresh_token,
        accessToken: data.access_token,
        idToken: data.id_token,
        expiresAt: data.expires_in ? Date.now() + data.expires_in : data.expires_at,
      };
    };

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        // console.log(data)
        switch (data.event) {
          case 'ready':
            resolveTransactionId(data.transactionId);
            break;
          case 'fulfilled': {
            const sanitizedLoginData = sanitizeLoginData(data);
            resolveLoginData(sanitizedLoginData);
            ws.close();
            break;
          }
          default:
            throw new Error(
              'Encountered an unexpected message while waiting for login information. Your Serverless Framework or SDK may be out of date.'
            );
        }
      } catch (error) {
        rejectTransactionId(error);
        rejectLoginData(error);
        ws.close();
      }
    };

    ws.onopen = () => {
      ws.send('{"action":"login"}');
    };

    return {
      transactionId,
      loginData,
    };
  }

  async login(config = {}) {
    const { transactionId: deferredTransactionId, loginData } = this.loginIdentity(config);

    const transactionId = await deferredTransactionId;

    const auth0Queries = querystring.stringify({
      client: 'cli',
      transactionId,
    });
    let loginUrl =
      config.app === 'console' ? this.getDomain('console') : this.getDomain('dashboard');
    loginUrl = `${loginUrl}?${auth0Queries}`;

    return {
      loginUrl,
      loginData,
    };
  }

  /**
   *
   * Resources
   *
   */

  /**
   * Get User account
   * @return {object} Returns a user record.
   */
  async getUser() {
    return resources.getUser(this);
  }

  /**
   * Get User account meta information.
   * @return {object} Returns a data object of custom "meta" information.
   */
  async getUserMeta() {
    return resources.getUserMeta(this);
  }

  /**
   * Updates User account meta information.  This method fetches meta information and merges it with the meta object you provide before saving.  Please note that this does a shallow merge and not a deep merge.  That means nested properties might be replaced.
   * @param {object} userMeta An object of new userMeta that will be automaticaly merged with the old user meta.
   * @return {object} Returns a data object of User data.
   */
  async saveUserMeta(userMeta) {
    return resources.saveUserMeta(this, userMeta);
  }

  /**
   * Validates whether a potential User and Organization name meets the Platform requirements.  Most importantly, this calls the Platform to validate whether the User and Organization names are already taken.  This method is necessary because every User must have an Organization and we want to be sure both namespaces are availbale, before creating one or the other.  In the future, both of these records should be created in the back-end, not on the client-side.  Until then, this method is essential.
   * @deprecated use {@link ServerelessSDK.organizations.validate} instead
   * @param {string} userAndOrgName The name of the User and Org name.
   * @return {array} Returns an array of validation errors, if any.  Otherwise, returns null.
   */
  async validateUserAndOrgName(userAndOrgName) {
    return resources.validateUserAndOrgName(this, userAndOrgName);
  }

  /**
   * In the Serverless Platform, every User must have an Organization by default.  This method creates both a User and an Organization record, at the same time.  Please note, the endpoint called is specific to Tenants (Organizations), which also has User creation logic within it.  This API design is non-sensible and we should consider a better API design ASAP.  Until then, this method abstracts over that.
   * @deprecated use {@link ServerelessSDK.organizations.create} instead
   * @param {string} userAndOrgName The name of the User and Org name.
   * @return {object} Returns the newly create Organization.
   */
  async createUserAndOrg(userAndOrgName) {
    return resources.createUserAndOrg(this, userAndOrgName);
  }

  /**
   * Creates an Organization.
   * @deprecated use {@link ServerelessSDK.organizations.create} instead
   * @param {string} userAndOrgName The name of the Organization you wish to create.  WARNING: This also creates a User record if one does not exist under this Organization name.  This API design needs improvement.
   * @return {object} Returns the newly create Organization.
   */
  async createOrg(userAndOrgName) {
    return resources.createOrg(this, userAndOrgName);
  }

  /**
   * Gets an Organization by Organization name.
   * @deprecated use {@link ServerelessSDK.organizations.get} instead
   * @param {string} orgName The name of the Organization you wish to retrieve.
   * @return {object} Returns the Organization record.
   */
  async getOrgByName(orgName) {
    return resources.getOrgByName(this, orgName);
  }

  /**
   * Lists Organizations by User, whether the  User is an Owner or a Member of a given Organization.
   * @deprecated use {@link ServerelessSDK.organizations.list} instead
   * @param {string} username The name of the User whose Organizations you wish to list.
   * @return {object} Returns an array of Organizations
   */
  async listOrgs(username) {
    return resources.listOrgs(this, username);
  }

  /**
   * Create an Application within an Organization
   * @deprecated use {@link ServerelessSDK.apps.create} instead
   * @param {string} orgName The name of the Organization you wish to create an Application in.
   * @param {string} app.name The name of the Application.
   * @param {string} app.description The description of the Application.
   * @param {object} app.deploymentProfiles An object of deployment profiles and stages.  This structure is a bit confusing.  Look at the back-end service for more details and hopefully we can design this more elegantly in the future.
   * @return {object} Returns a data object of the newly created Application
   */
  async createApp(orgName = null, app = {}) {
    return resources.createApp(this, orgName, app);
  }

  /**
   * Update an Application within an Organization
   * @deprecated use {@link ServerelessSDK.apps.update} instead
   * @param {string} orgName The name of the Organization the Application belongs to.
   * @param {string} app.name The name of the Application you wish to update.  This property cannot be updated due to current data modeling issues.
   * @param {string} app.description The description of the Application.  This property can be updated.
   * @param {object} app.deploymentProfiles An object of deployment profiles and stages.  This property can be updated.  This structure is a bit confusing. Look at the back-end service for more details and hopefully we can design this more elegantly in the future.
   * @return {object} Returns a data object of the updated Application
   */
  async updateApp(orgName = null, app = {}) {
    return resources.updateApp(this, orgName, app);
  }

  /**
   * Delete an Application within an Organization
   * @deprecated use {@link ServerelessSDK.apps.remove} instead
   * @param {string} orgName The name of the Organization the Application belongs to.
   * @param {string} appName The name of the Application you wish to delete.
   */
  async deleteApp(orgName = null, appName = null) {
    return resources.deleteApp(this, orgName, appName);
  }

  /**
   * List all Applications within an Organization
   * @deprecated use {@link ServerelessSDK.apps.list} instead
   * @param {string} orgName The name of the Organization the Application belongs to.
   */
  async listApps(orgName = null) {
    return resources.listApps(this, orgName);
  }

  /**
   * Create an initToken for a user and organization
   * @param {string} orgName The name of the Organization the Init Token belongs to.
   * @param {string} template.type Must be either s3, github, or existing.
   * @param {string[]} template.commands Array of commands executed by the user's shell env in order to fetch and set up the template
   */
  async createInitToken(orgName = null, template = {}) {
    return resources.createInitToken(this, orgName, template);
  }

  /**
   * Get an initToken by UID
   * @param {string} initTokenUid Unique identifier of an initToken
   */
  async getInitToken(initTokenUid) {
    return resources.getInitToken(this, initTokenUid);
  }

  /**
   * Create a provider
   *
   * @param {*} orgUid
   * @param {*} data
   */
  async createProvider(orgUid, data) {
    return resources.createProvider(this, orgUid, data);
  }

  /**
   * Update a provider
   *
   * @param {*} orgUid
   * @param {*} providerUid
   * @param {*} data
   */
  async updateProvider(orgUid, providerUid, data) {
    return resources.updateProvider(this, orgUid, providerUid, data);
  }

  /**
   * Set a default provider
   *
   * @param {*} orgUid
   * @param {*} providerUid
   */
  async setDefaultProvider(orgUid, providerUid) {
    return resources.setDefaultProvider(this, orgUid, providerUid);
  }

  /**
   * Unsets the default provider
   *
   * @param {*} orgUid
   * @param {*} providerUid
   */
  async unsetDefaultProvider(orgUid, providerUid) {
    return resources.unsetDefaultProvider(this, orgUid, providerUid);
  }

  /**
   * Delete a provider
   *
   * @param {*} orgUid
   * @param {*} providerUid
   */
  async deleteProvider(orgUid, providerUid) {
    return resources.deleteProvider(this, orgUid, providerUid);
  }

  /**
   * Create a providerLink
   * Link type can be either `service` or `instance`
   *
   * @param {*} orgUid
   * @param {*} linkType
   * @param {*} linkUid
   * @param {*} providerUid
   */
  async createProviderLink(orgUid, linkType, linkUid, providerUid) {
    return resources.createProviderLink(this, orgUid, linkType, linkUid, providerUid);
  }

  /**
   * Delete a providerLink
   * Link type can be either `service` or `instance`
   * @param {*} orgUid
   * @param {*} linkType
   * @param {*} linkUid
   * @param {*} providerUid
   */
  async deleteProviderLink(orgUid, linkType, linkUid, providerUid) {
    return resources.deleteProviderLink(this, orgUid, linkType, linkUid, providerUid);
  }
  /**
   * List providers by OrgUid
   * @param {*} orgUid
   */
  async getProviders(orgUid) {
    return resources.getProviders(this, orgUid);
  }

  /**
   * Get a Provider
   * @param {*} orgUid
   * @param {*} providerUid
   */
  async getProvider(orgUid, providerUid) {
    return resources.getProvider(this, orgUid, providerUid);
  }

  /**
   * Get providers by org, service, and instance
   * Configuration set at the instance level will override
   * defaults set at the service level
   *
   * @param {*} orgUid
   * @param {*} serviceUid
   * @param {*} instanceUid
   */
  async getProvidersByOrgServiceInstance(orgUid, serviceUid, instanceUid) {
    return resources.getProvidersByOrgServiceInstance(this, orgUid, serviceUid, instanceUid);
  }

  /**
   * List providers by Link
   * @param {*} orgUid
   * @param {*} linkType
   * @param {*} linkUid
   */
  async getProvidersByLink(orgUid, linkType, linkUid) {
    return resources.getProvidersByLink(this, orgUid, linkType, linkUid);
  }

  /**
   * Returns the list of supported providers
   */
  async getAllowedProviders() {
    return resources.getAllowedProviders(this);
  }

  /**
   * Params
   */

  /**
   * Create a param and link it to a service or an instance
   *
   * @param {*} orgUid
   * @param {*} linkType
   * @param {*} linkUid
   * @param {*} data
   */
  async createParam(orgUid, linkType, linkUid, data) {
    return resources.createParam(this, orgUid, linkType, linkUid, data);
  }

  /**
   * Destroy a param
   * @param {*} orgUid
   * @param {*} linkType
   * @param {*} linkUid
   * @param {*} paramUid
   */
  async deleteParam(orgUid, linkType, linkUid, paramUid) {
    return resources.deleteParam(this, orgUid, linkType, linkUid, paramUid);
  }

  /**
   * Update a param
   * @param {*} orgUid
   * @param {*} linkType
   * @param {*} linkUid
   * @param {*} paramUid
   * @param {*} data
   */
  async updateParam(orgUid, linkType, linkUid, paramUid, data) {
    return resources.updateParam(this, orgUid, linkType, linkUid, paramUid, data);
  }

  /**
   * List params by service or instance
   * @param {*} orgUid
   * @param {*} linkType
   * @param {*} linkUid
   */
  async getParams(orgUid, linkType, linkUid) {
    return resources.getParams(this, orgUid, linkType, linkUid);
  }

  /**
   * List params by org, service, and instance
   * @param {*} orgUid
   * @param {*} serviceUid
   * @param {*} instanceUid
   */
  async getParamsByOrgServiceInstance(orgUid, serviceUid, instanceUid) {
    return resources.getParamsByOrgServiceInstance(this, orgUid, serviceUid, instanceUid);
  }

  /**
   * List parameters and providers by org, service, and instance
   * @param {*} orgUid
   * @param {*} serviceUid
   * @param {*} instanceUid
   */
  async getParamsAndProvidersByOrgServiceInstance(orgUid, serviceUid, instanceUid) {
    return resources.getParamsAndProvidersByOrgServiceInstance(
      this,
      orgUid,
      serviceUid,
      instanceUid
    );
  }
  /**
   *
   * Events
   *
   */

  /**
   * `onEvent` callback
   * @callback onEvent
   * @param {Object} event Incoming event
   */

  /**
   * `onDisconnect` callback
   * @callback onDisconnect
   * @param {Object} closeEvent Websocket {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent|CloseEvent}
   */

  /**
   * Establishes a websockets connection with the Serverless Platform
   * @param {Object} [options={}] Connection options.
   * @param {string} [options.orgName] Name of the Serverless Platform Org. If not specified, inherits from SDK context.
   * @param {string} [options.orgUid] ID of the Serverless Platform Org. If not specified, inherits from SDK context.
   * @param {onEvent} [options.onEvent] A function that handles events recieved from the Serverless Platform.
   * @param {onDisconnect} [options.onDisconnect] Register a disconnect callback.
   * @param {onError} [options.onError] Register an onError callback.
   * @param {Object} [options.filter] Filters which events this connection should receive.
   * @param {string} [options.filter.stageName] Tells the SDK to only receive events on a specific stage.
   * @param {string} [options.filter.appName] Tells the SDK to only receive events on a specific app.
   * @param {string} [options.filter.instanceName] Tells the SDK to only receive events on a specific service.
   * @param {string[]} [options.filter.events=["*"]] Restrict the types of receivable events. `["*"]` indicates that all events are enabled.
   * @return {null}
   */
  async connect(options = {}) {
    this.connection = new Connection(this);
    await this.connection.connect(options);
  }

  /**
   * Disconnects a websockets connection with the Serverless Platform
   * @return {null}
   */
  disconnect() {
    if (this.connection) {
      this.connection.disconnect();
    }
  }

  /**
   * Checks if the SDK is currently connected to the Serverless Platform
   * @return {boolean} Will return true if the websocket connection is active.
   */
  isConnected() {
    if (!this.connection || !this.connection.isConnected()) {
      return false;
    }
    return true;
  }

  /**
   * Unpublishes a package from the registry
   * @param {*} registryPackage An object containing the properties of a registry package.
   */
  async unpublishFromRegistry(registryPackage = {}) {
    return await registry.unpublish(this, registryPackage);
  }

  /**
   * Publishes a package to the registry
   * @param {*} registryPackage An object containing the properties of a registry package.
   * @returns {object} The published registry package is returned from the Platform API.
   */
  async publishToRegistry(registryPackage = {}) {
    return registry.publish(this, registryPackage);
  }

  /**
   * Fetches package/s from the registry
   * @param {*} name The name of the registry package to fetch. If this is not provided, this method will return a list of everything in the registry.
   * @param {*} version The version of the registry package to fetch.  If this is not provided, this method will always return the latest version.
   * @return {object} Returns a registry package from the Registry.
   */
  async getFromRegistry(name = null, version = null) {
    return registry.get(this, name, version);
  }

  /**
   *
   * Instances
   *
   */

  /**
   * Returns a properly formatted ID for an Instance
   * @param {*} orgUid The Uid of the Serverless Platform Organization.
   * @param {*} stageName The name of the Serverless Platform Stage.
   * @param {*} appUid The Uid of the Serverless Platform Application.
   * @param {*} instanceName The name of the Serverless Platform Instance.
   * @return {object} Returns a properly formatted ID for an Instance
   */
  generateInstanceId(orgName = null, stageName = null, appUid = null, instanceName = null) {
    return instance.generateId(orgName, stageName, appUid, instanceName);
  }

  /**
   * Validates the properties of an Instance, as well as auto-corrects shortened syntax (e.g. org => orgName)
   * @param {*} instanceToValidate The Serverless Platform Instance you want to validate.
   * @return {object} Returns a validated, formatted version of the Instance
   */
  validateInstance(instanceToValidate) {
    return instance.validateAndFormat(instanceToValidate);
  }

  /**
   * Returns a new Instance as a Javascript object.
   * @param {*} orgName The name of the Serverless Platform Organization.
   * @param {*} stageName The name of the Serverless Platform Stage.
   * @param {*} appName The name of the Serverless Platform Application.
   * @param {*} instanceName The name of the Serverless Platform Instance.
   * @param {*} instanceStatus The status of the instance
   * @return {object} Returns a new Instance definition as a Javascript Object.
   */
  createInstance(
    orgName = null,
    stageName = null,
    appName = null,
    instanceName = null,
    instanceStatus = 'inactive'
  ) {
    return instance.create(orgName, stageName, appName, instanceName, instanceStatus);
  }

  /**
   * Saves an instance record, defined by createInstance
   * @param {*} instanceRecord
   */
  async saveInstance(instanceRecord) {
    return instance.save(this, instanceRecord);
  }

  /**
   * Get an Instance from the Serverless Platform by it's name and the names of its Organization, Stage, Application.
   * @param {*} orgName The name of the Serverless Platform Organization.
   * @param {*} stageName The name of the Serverless Platform Stage.
   * @param {*} appName The name of the Serverless Platform Application.
   * @param {*} instanceName The name of the Serverless Platform Instance.
   */
  async getInstance(orgName = null, stageName = null, appName = null, instanceName = null) {
    return instance.getByName(this, orgName, stageName, appName, instanceName);
  }

  /**
   * List all Component Instances within an Org, given an org name or org UId
   * @param {*} orgName Optional.  Must include either orgName or orgUid.
   * @param {*} orgUid Optional.  Must include either orgName or orgUid.
   */
  async listInstances(orgName = null, orgUid) {
    return instance.listByOrgName(this, orgName, orgUid);
  }

  /**
   * Run an action on a Component Instance.  Is an asynchronous call by default, but you can perform this synchronously if you set `options.sync`.  Please note that synchronous runs have a 24 second timeout limit.  That is not ideal for long operations, and is not recommended for deployments.
   * @param {*} action
   * @param {*} instanceData
   * @param {*} options
   */
  async run(action, instanceData = {}, options = {}) {
    return instance.run(this, action, instanceData, options);
  }

  /**
   * Run Finish
   * @param {string} method The Action that was performed on the Component.
   * @param {object} instanceData An object representing your Instance definition.
   * @param {object} meta Useful metadata about the Component Action.
   */
  async runFinish(method = null, instanceData, meta = {}) {
    return instance.runFinish(this, method, instanceData, meta);
  }

  /**
   * Performs a 'deploy' action and polls the 'getInstance' endpoint until its 'instanceStatus' reflects a successful deployment, or error.
   */
  async deploy(instanceData = {}, options = {}) {
    return instance.deploy(this, instanceData, options);
  }

  /**
   * Performs a 'remove' action and polls the 'getInstance' endpoint until its 'instanceStatus' reflects a successful deployment, or error.
   */
  async remove(instanceData = {}, options = {}) {
    return instance.remove(this, instanceData, options);
  }

  /**
   *
   * Other
   *
   */

  /**
   * Intercepts console 'log' 'debug' and 'error' methods, and sends their data to the Serverless Platform as an Event, before writing to stdout.
   * @param {*} eventType Optional. The event name used to publish logs. Defaults to "instance.logs".
   * @param {*} context Optional. Additional context added to the published log data.
   */
  async startInterceptingLogs(eventType = null, context = {}) {
    // Save original console methods
    this.intercepts.logs = [];
    this.intercepts.console = {};
    this.intercepts.console.log = console.log;
    this.intercepts.console.debug = console.debug;
    this.intercepts.console.info = console.info;
    this.intercepts.console.error = console.error;
    this.intercepts.console.warn = console.warn;

    this.intercepts.stdout = {};
    this.intercepts.stdout.write = process.stdout.write.bind(process.stdout);

    this.intercepts.stderr = {};
    this.intercepts.stderr.write = process.stderr.write.bind(process.stderr);

    const self = this;

    // Publish function
    this.intercepts.publish = async () => {
      if (!self.intercepts.logs || !self.intercepts.logs.length) {
        return;
      }

      // Copy logs and clear them out immediately
      const logsCopy = self.intercepts.logs.map((l) => l);
      self.intercepts.logs = [];

      // Publish event
      const evt = { data: { logs: logsCopy, ...context } };
      evt.event = eventType || 'instance.logs';
      await self.events.publish(evt);
    };

    // Set Interval function
    this.intercepts.interval = setInterval(async () => {
      await self.intercepts.publish();
    }, self.intercepts.logsInterval);

    let isIntercepting = false;
    // Set Intercept function
    const intercept = (type, logs) => {
      const isTopLevel = !isIntercepting;
      if (isTopLevel) {
        isIntercepting = true;
        // Add logs to queue and format so they print correctly after being sent via Websockets
        logs.forEach((l) => {
          if (l === undefined) {
            l = 'undefined';
          }
          if (typeof l === 'number') {
            l = JSON.stringify(l);
          }

          // Add to logs queue, and add type of log
          const log = { type };
          log.createdAt = Date.now();
          log.data = util.inspect(l); // util.inspect converts ciruclar objects to '[Circular]'.  Without, errors will happen on stringify...
          self.intercepts.logs.push(log);
        });
      }

      try {
        // Apply old method
        if (type === 'stdout') {
          self.intercepts.stdout.write(...logs);
        } else if (type === 'stderr') {
          self.intercepts.stderr.write(...logs);
        } else {
          self.intercepts.console[type].apply(console, logs);
        }
      } finally {
        if (isTopLevel) isIntercepting = false;
      }
    };

    // Replace console methods
    console.log = (...args) => {
      intercept('log', args);
    };
    console.debug = (...args) => {
      intercept('debug', args);
    };
    console.info = (...args) => {
      intercept('info', args);
    };
    console.error = (...args) => {
      intercept('error', args);
    };
    console.warn = (...args) => {
      intercept('warn', args);
    };
    process.stdout.write = (...args) => {
      intercept('stdout', args);
    };
    process.stderr.write = (...args) => {
      intercept('stderr', args);
    };
  }

  /**
   * Stop intercepting console methods
   */
  async stopInterceptingLogs() {
    // Clear interval timer
    if (this.intercepts.interval) {
      clearInterval(this.intercepts.interval);
    }

    // Send any remaining logs
    await this.intercepts.publish();

    // Reset logs
    this.intercepts.logs = [];

    // Replace console methods
    console.log = this.intercepts.console.log;
    console.debug = this.intercepts.console.debug;
    console.info = this.intercepts.console.info;
    console.error = this.intercepts.console.error;
    console.warn = this.intercepts.console.warn;

    process.stdout.write = this.intercepts.stdout.write;
    process.stderr.write = this.intercepts.stderr.write;
  }
}

/**
 * Exports
 */
module.exports = {
  ServerlessSDK,
  utils,
};
