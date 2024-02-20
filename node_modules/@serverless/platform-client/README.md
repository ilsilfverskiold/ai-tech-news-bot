# Serverless Platform SDK

This Serverless Platform SDK makes it easy to interact with the Serverless Platform and perform operations on it. Please note that there is an existing `@serverless/platform-sdk` npm module for interacting with the Serverless Inc. SaaS original platform services. This SDK is for the new services, which are multi-cloud, self-hostable and focued on Components. At some point, we will try to merge these SDKs.

The SDK is light-weight, so that it can be used in the following: CLIs, Dashboards, Back-End Services, FaaS Layers. Please **DO NOT** add any big Node.js dependencies to this SDK.

This SDK should guide the interface design between Services and Clients. All Clients and Services **MUST** use the SDK and should never hardcode API endpoints or FaaS resources identifiers.

## Quick-Start

**If you are working within a Node.js environment, install the Serverless Platform Client SDK via NPM:**

```
npm i @serverless/platform-client
```

**If you are working within a web/browser environment, use the CDN hosted Serverless Platform Client SDK:**

This is minified, tree-shaked, browserified. The CDN fetches it directly from NPM, so just reference any npm version, like below.

This CDN service has several locations in China, so it works well there.

```
// In index.html <head></head>
<!-- Load the Serverless Platform (Components) SDK -->
<script src="https://cdn.jsdelivr.net/npm/@serverless/platform-client@0.17.2" async></script>
```

You can also pin to the latest version, but this could break at any time:

```
// In index.html <head></head>
<!-- Load the Serverless Platform (Components) SDK -->
<script src="https://cdn.jsdelivr.net/npm/@serverless/platform-client" async></script>
```

If you are working with the `dev` environment of the Serverless Platform, set the following environment variable, or configure the client programmatically, as detailed below.

```
export SERVERLESS_PLATFORM_STAGE=dev
```

Here is how you require, instantiate the Client and use it:

```javascript
const { ServerlessSDK } = require("@serverless/platform-client");

sdk = new ServerlessSDK({
  platformStage: "dev", // Optional.  Defaults to 'prod'
  accessKey: "JA98JAJFASLFJSALFJASLFJ", // Optional, but recommended.  Platform Access Key needed to identify all requests.
});

const instances = await sdk.listInstances("my-org");
```

## Classes

<dl>
<dt><a href="#ServerlessSDK">ServerlessSDK</a></dt>
<dd><p>The Serverless Platform SDK Class</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#onEvent">onEvent</a> : <code>function</code></dt>
<dd><p><code>onEvent</code> callback</p>
</dd>
<dt><a href="#onDisconnect">onDisconnect</a> : <code>function</code></dt>
<dd><p><code>onDisconnect</code> callback</p>
</dd>
</dl>

<a name="ServerlessSDK"></a>

## ServerlessSDK

The Serverless Platform SDK Class

**Kind**: global class

- [ServerlessSDK](#ServerlessSDK)
  - [new ServerlessSDK()](#new_ServerlessSDK_new)
  - [.session](#ServerlessSDK+session) : <code>object</code>
    - [.refreshToken(refreshToken)](#ServerlessSDK+session.refreshToken) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.events](#ServerlessSDK+events) : <code>object</code>
    - [.publish(event)](#ServerlessSDK+events.publish) ⇒ <code>Promise.&lt;null&gt;</code>
    - [.get(uid)](#ServerlessSDK+events.get) ⇒ <code>Promise.&lt;Object&gt;</code>
    - [.list([options])](#ServerlessSDK+events.list) ⇒ <code>Promise.&lt;Object&gt;</code>
    - ~~[.send(event)](#ServerlessSDK+events.send) ⇒ <code>Promise.&lt;null&gt;</code>~~
  - [.frameworkDeployments](#ServerlessSDK+frameworkDeployments) : <code>object</code>
    - [.create([params])](#ServerlessSDK+frameworkDeployments.create) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.list([params])](#ServerlessSDK+frameworkDeployments.list) ⇒ <code>Promise.&lt;array&gt;</code>
  - [.webhooks](#ServerlessSDK+webhooks) : <code>object</code>
    - [.register(url, [options])](#ServerlessSDK+webhooks.register) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.list([options])](#ServerlessSDK+webhooks.list) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.get(uid)](#ServerlessSDK+webhooks.get) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.update(uid)](#ServerlessSDK+webhooks.update) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.delete(uid)](#ServerlessSDK+webhooks.delete) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.accessKeys](#ServerlessSDK+accessKeys) : <code>object</code>
    - [.create(orgName, userName, accessKeyName)](#ServerlessSDK+accessKeys.create) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.list(orgName)](#ServerlessSDK+accessKeys.list) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.remove(orgName, uid)](#ServerlessSDK+accessKeys.remove) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.get()](#ServerlessSDK+accessKeys.get) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>
  - [.connections](#ServerlessSDK+connections) : <code>object</code>
    - [.create(orgUid, providerUid, accountAlias)](#ServerlessSDK+connections.create) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.list(orgUid)](#ServerlessSDK+connections.list) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.get(orgUid, connectionUid)](#ServerlessSDK+connections.get) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.getByOrgAndAccountAlias(orgUid, accountAlias)](#ServerlessSDK+connections.getByOrgAndAccountAlias) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.update(orgUid, connectionUid, providerUid, accountAlias, status)](#ServerlessSDK+connections.update) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.remove(orgUid, connectionUid)](#ServerlessSDK+connections.remove) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.syncAll(orgUid)](#ServerlessSDK+connections.syncAll) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.unsync(orgUid, connectionUid)](#ServerlessSDK+connections.unsync) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.desktop](#ServerlessSDK+desktop) : <code>object</code>
    - [.createSavedQuery(orgUid, appUid, serviceName, savedQuery)](#ServerlessSDK+desktop.createSavedQuery) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.getSavedQuery(orgUid, appUid, serviceName, savedQueryUid)](#ServerlessSDK+desktop.getSavedQuery) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.updateSavedQuery(orgUid, appUid, serviceName, savedQueryUid, savedQuery)](#ServerlessSDK+desktop.updateSavedQuery) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.deleteSavedQuery(orgUid, appUid, serviceName, savedQueryUid)](#ServerlessSDK+desktop.deleteSavedQuery) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.listSavedQueries(orgUid, appUid, serviceName)](#ServerlessSDK+desktop.listSavedQueries) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.logDestinations](#ServerlessSDK+logDestinations) : <code>object</code>
    - [.getOrCreate([params])](#ServerlessSDK+logDestinations.getOrCreate) ⇒ <code>Promise.&lt;object&gt;</code>
    - [.remove([params])](#ServerlessSDK+logDestinations.remove) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.deploymentProfiles](#ServerlessSDK+deploymentProfiles) : <code>object</code>
    - [.get([params])](#ServerlessSDK+deploymentProfiles.get) ⇒ <code>Promise.&lt;Object&gt;</code>
    - [.create([params])](#ServerlessSDK+deploymentProfiles.create) ⇒ <code>Promise.&lt;Object&gt;</code>
    - [.list([params])](#ServerlessSDK+deploymentProfiles.list) ⇒ <code>Promise.&lt;array&gt;</code>
    - [.setDefault([params])](#ServerlessSDK+deploymentProfiles.setDefault) ⇒ <code>Promise.&lt;Object&gt;</code>
  - [.organizations](#ServerlessSDK+organizations) : <code>object</code>
    - [.get([params])](#ServerlessSDK+organizations.get) ⇒ <code>object</code>
    - [.list([params])](#ServerlessSDK+organizations.list) ⇒ <code>array</code>
    - [.create([params])](#ServerlessSDK+organizations.create) ⇒ <code>object</code>
    - [.validate([params])](#ServerlessSDK+organizations.validate) ⇒ <code>array</code>
  - [.apps](#ServerlessSDK+apps) : <code>object</code>
    - [.create([params])](#ServerlessSDK+apps.create) ⇒ <code>object</code>
    - [.get([params])](#ServerlessSDK+apps.get)
    - [.update([params])](#ServerlessSDK+apps.update) ⇒ <code>object</code>
    - [.remove([params])](#ServerlessSDK+apps.remove)
    - [.list([params])](#ServerlessSDK+apps.list)
  - [.metadata](#ServerlessSDK+metadata) : <code>object</code>
    - [.get()](#ServerlessSDK+metadata.get) ⇒ <code>Promise.&lt;Object&gt;</code>
  - [.config()](#ServerlessSDK+config) ⇒ <code>null</code>
  - [.getDomain(serviceName)](#ServerlessSDK+getDomain) ⇒ <code>string</code>
  - [.getUser()](#ServerlessSDK+getUser) ⇒ <code>object</code>
  - [.getUserMeta()](#ServerlessSDK+getUserMeta) ⇒ <code>object</code>
  - [.saveUserMeta(userMeta)](#ServerlessSDK+saveUserMeta) ⇒ <code>object</code>
  - ~~[.validateUserAndOrgName(userAndOrgName)](#ServerlessSDK+validateUserAndOrgName) ⇒ <code>array</code>~~
  - ~~[.createUserAndOrg(userAndOrgName)](#ServerlessSDK+createUserAndOrg) ⇒ <code>object</code>~~
  - ~~[.createOrg(userAndOrgName)](#ServerlessSDK+createOrg) ⇒ <code>object</code>~~
  - ~~[.getOrgByName(orgName)](#ServerlessSDK+getOrgByName) ⇒ <code>object</code>~~
  - ~~[.listOrgs(username)](#ServerlessSDK+listOrgs) ⇒ <code>object</code>~~
  - ~~[.createApp(orgName)](#ServerlessSDK+createApp) ⇒ <code>object</code>~~
  - ~~[.updateApp(orgName)](#ServerlessSDK+updateApp) ⇒ <code>object</code>~~
  - ~~[.deleteApp(orgName, appName)](#ServerlessSDK+deleteApp)~~
  - ~~[.listApps(orgName)](#ServerlessSDK+listApps)~~
  - [.createInitToken(orgName)](#ServerlessSDK+createInitToken)
  - [.getInitToken(initTokenUid)](#ServerlessSDK+getInitToken)
  - [.createProvider(orgUid, data)](#ServerlessSDK+createProvider)
  - [.updateProvider(orgUid, providerUid, data)](#ServerlessSDK+updateProvider)
  - [.setDefaultProvider(orgUid, providerUid)](#ServerlessSDK+setDefaultProvider)
  - [.unsetDefaultProvider(orgUid, providerUid)](#ServerlessSDK+unsetDefaultProvider)
  - [.deleteProvider(orgUid, providerUid)](#ServerlessSDK+deleteProvider)
  - [.createProviderLink(orgUid, linkType, linkUid, providerUid)](#ServerlessSDK+createProviderLink)
  - [.deleteProviderLink(orgUid, linkType, linkUid, providerUid)](#ServerlessSDK+deleteProviderLink)
  - [.getProviders(orgUid)](#ServerlessSDK+getProviders)
  - [.getProvider(orgUid, providerUid)](#ServerlessSDK+getProvider)
  - [.getProvidersByOrgServiceInstance(orgUid, serviceUid, instanceUid)](#ServerlessSDK+getProvidersByOrgServiceInstance)
  - [.getProvidersByLink(orgUid, linkType, linkUid)](#ServerlessSDK+getProvidersByLink)
  - [.getAllowedProviders()](#ServerlessSDK+getAllowedProviders)
  - [.createParam(orgUid, linkType, linkUid, data)](#ServerlessSDK+createParam)
  - [.deleteParam(orgUid, linkType, linkUid, paramUid)](#ServerlessSDK+deleteParam)
  - [.updateParam(orgUid, linkType, linkUid, paramUid, data)](#ServerlessSDK+updateParam)
  - [.getParams(orgUid, linkType, linkUid)](#ServerlessSDK+getParams)
  - [.getParamsByOrgServiceInstance(orgUid, serviceUid, instanceUid)](#ServerlessSDK+getParamsByOrgServiceInstance)
  - [.getParamsAndProvidersByOrgServiceInstance(orgUid, serviceUid, instanceUid)](#ServerlessSDK+getParamsAndProvidersByOrgServiceInstance)
  - [.connect([options])](#ServerlessSDK+connect) ⇒ <code>null</code>
  - [.disconnect()](#ServerlessSDK+disconnect) ⇒ <code>null</code>
  - [.isConnected()](#ServerlessSDK+isConnected) ⇒ <code>boolean</code>
  - [.unpublishFromRegistry(registryPackage)](#ServerlessSDK+unpublishFromRegistry)
  - [.publishToRegistry(registryPackage)](#ServerlessSDK+publishToRegistry) ⇒ <code>object</code>
  - [.getFromRegistry(name, version)](#ServerlessSDK+getFromRegistry) ⇒ <code>object</code>
  - [.generateInstanceId(orgUid, stageName, appUid, instanceName)](#ServerlessSDK+generateInstanceId) ⇒ <code>object</code>
  - [.validateInstance(instanceToValidate)](#ServerlessSDK+validateInstance) ⇒ <code>object</code>
  - [.createInstance(orgName, stageName, appName, instanceName, instanceStatus)](#ServerlessSDK+createInstance) ⇒ <code>object</code>
  - [.saveInstance(instanceRecord)](#ServerlessSDK+saveInstance)
  - [.getInstance(orgName, stageName, appName, instanceName)](#ServerlessSDK+getInstance)
  - [.listInstances(orgName, orgUid)](#ServerlessSDK+listInstances)
  - [.run(action, instanceData, options)](#ServerlessSDK+run)
  - [.runFinish(method, instanceData, meta)](#ServerlessSDK+runFinish)
  - [.deploy()](#ServerlessSDK+deploy)
  - [.remove()](#ServerlessSDK+remove)
  - [.startInterceptingLogs(eventType, context)](#ServerlessSDK+startInterceptingLogs)
  - [.stopInterceptingLogs()](#ServerlessSDK+stopInterceptingLogs)

<a name="new_ServerlessSDK_new"></a>

### new ServerlessSDK()

Creates an instance of the SDK. Accepts a configuration object and calls the `config()` method. See the `config()` method for more information on allowed configuration.

| Param                      | Type                | Description                                                                                                                                                                              |
| -------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [config.accessKey]         | <code>string</code> | Can either be a Serverless Platform Access Key or an ID Token.                                                                                                                           |
| [config.platformStage]     | <code>string</code> | The Serverless Platform Stage you wish to interact with. This can also be set by the environment variable SERVERLESS_PLATFORM_STAGE=                                                     |
| [context.orgName]          | <code>string</code> | The name of the Serverless Platform Organization you wish to interact with. If set, this value is used upon creating a Websockets connection, and auto-added to every Event you publish. |
| [context.orgUid]           | <code>string</code> | The ID of the Serverless Platform Organization you wish to interact with. If set, this value is used upon creating a Websockets connection, and auto-added to every Event you publish.   |
| [context.stageName]        | <code>string</code> | The Serverless Platform Organization Stage you wish to interact with. If set, this value is auto-added to every Event you publish.                                                       |
| [context.appName]          | <code>string</code> | The Serverless Platform Application you wish to interact with. If set, this value is auto-added to every Event you publish.                                                              |
| [context.instanceName]     | <code>string</code> | The Serverless Platform Instance you wish to interact with. If set, this value is auto-added to every Event you publish.                                                                 |
| [context.componentName]    | <code>string</code> | The Serverless Platform Component you wish to interact with. If set, this value is auto-added to every Event you publish.                                                                |
| [context.componentVersion] | <code>string</code> | The Serverless Platform Component version you wish to interact with. If set, this value is auto-added to every Event you publish.                                                        |

**Example**

```js
const { ServerlessSDK } = require("@serverless/platform-client");

const sdk = new ServerlessSDK({
  accessKey: "123456789",
  context: {
    orgName: "my-org",
    orgUid: "1234",
    stageName: "prod",
    appName: "my-app",
    instanceName: "my-instance",
  },
});
```

<a name="ServerlessSDK+session"></a>

### serverlessSDK.session : <code>object</code>

Methods to create, update, delete User Sessions on the Serverless Platform

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)  
<a name="ServerlessSDK+session.refreshToken"></a>

#### session.refreshToken(refreshToken) ⇒ <code>Promise.&lt;object&gt;</code>

Uses a Refresh Token to generate a new ID Token for a User within a specific Serverless Organization.

**Kind**: static method of [<code>session</code>](#ServerlessSDK+session)

| Param        | Type                | Description                                      |
| ------------ | ------------------- | ------------------------------------------------ |
| refreshToken | <code>string</code> | The refresh token used to create a new ID Token. |

**Example**

```js
const tokenData = await sdk.session.refreshToken(refreshToken);
```

<a name="ServerlessSDK+events"></a>

### serverlessSDK.events : <code>object</code>

Publish and retrieve Serverless Platform Events

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)

- [.events](#ServerlessSDK+events) : <code>object</code>
  - [.publish(event)](#ServerlessSDK+events.publish) ⇒ <code>Promise.&lt;null&gt;</code>
  - [.get(uid)](#ServerlessSDK+events.get) ⇒ <code>Promise.&lt;Object&gt;</code>
  - [.list([options])](#ServerlessSDK+events.list) ⇒ <code>Promise.&lt;Object&gt;</code>
  - ~~[.send(event)](#ServerlessSDK+events.send) ⇒ <code>Promise.&lt;null&gt;</code>~~

<a name="ServerlessSDK+events.publish"></a>

#### events.publish(event) ⇒ <code>Promise.&lt;null&gt;</code>

Publishes Serverless Platform Event(s) via HTTP API. The use-case for this is synchronous publishing, where you do not want to open a websockets connection.

**Kind**: static method of [<code>events</code>](#ServerlessSDK+events)  
**Returns**: <code>Promise.&lt;null&gt;</code> - A successful publish request will be ack'ed with a `200:OK` HTTP status and empty response.

| Param       | Type                                                     | Description                                                                                                                                                                       |
| ----------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| event       | <code>Object</code> \| <code>Array.&lt;Object&gt;</code> | An event object, or if publishing a batch of events, an array of event objects.                                                                                                   |
| event.event | <code>string</code>                                      | Event type. Serverless Platform system events are required to follow a `<entity>[.<sub-entity>].<action>` naming convention (e.g. `user.created`, `org.membership.updated`, etc). |
| event.data  | <code>Object</code>                                      | Event metadata. Serverless Platform system events are required to be formatted as described in the example below.                                                                 |

**Example** _(user event)_

```js
sdk.config({ context: { orgUid: "3xVy2MWGFqpGYSlRMd" } });
await sdk.events.publish({
  event: "user.created",
  data: {
    id: "user-123",
    username: "testuser",
  },
});
```

**Example** _(system event)_

```js
await sdk.events.publish({
  event: "entity.updated", // follows a `<entity>[.<sub-entity>].<action>` naming convention
  user_uid: "user-111", // user attributable for event action if applicable - optional
  // either of the following properties are required to be set and if not, inherit from current sdk context
  org_uid: "org-42",
  org_name: "serverless",
  // the following properties are optional and default to inheriting from current sdk context
  app_name: "app-222",
  instance_name: "instance-333",
  stage_name: "us-east-1",
  component_name: "component-444",
  component_version: "1.2.3",
  data: {
    // event payload - required and must match the format below
    object: {
      // Serverless Platform object targeted by action
      object: "name",
      // ...properties
    },
    previous_attributes: {
      // only set on `*.updated` event types and contains modified property values as of before the update
      //...properties
    },
  },
});
```

<a name="ServerlessSDK+events.get"></a>

#### events.get(uid) ⇒ <code>Promise.&lt;Object&gt;</code>

Retrieve a Serverless Platform Event.

**Kind**: static method of [<code>events</code>](#ServerlessSDK+events)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - An event object if a valid id was provided.

| Param | Type                | Description                 |
| ----- | ------------------- | --------------------------- |
| uid   | <code>string</code> | UID of event to be fetched. |

**Example**

```js
const event = await sdk.events.get("evt_EsbM82sYTVscqYvcD4CKcLe1");
console.log(JSON.stringify(event, null, 2));
// outputs:
// {
//   "uid": "evt_EsbM82sYTVscqYvcD4CKcLe1",
//   "event": "member.invite.sent",
//   "org_uid": "3xVy2MWGFqpGYSlRMd",
//   "user_uid": "ps4Vt2phVXsMyD0byW",
//   "object": "event",
//   "created": 1600686488878,
//   "data": {
//     "object": {
//       "org_uid": "3xVy2MWGFqpGYSlRMd",
//       "role": "collaborator",
//       "invited_by_user_uid": "ps4Vt2phVXsMyD0byW",
//       "created": "2020-09-21T11:08:08.603Z",
//       "recipient_email": "dev@serverless.com",
//       "org_name": "serverless",
//       "object": "invite"
//     }
//   }
// }
```

<a name="ServerlessSDK+events.list"></a>

#### events.list([options]) ⇒ <code>Promise.&lt;Object&gt;</code>

List all Serverless Platform events.

**Kind**: static method of [<code>events</code>](#ServerlessSDK+events)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A dictionary with a `data` property that contains an array of up to `limit` events, starting after event `starting_after`. Each entry in the array is a separate `event` Object. If no more events are available, the resulting array will be empty.

| Param                  | Type                | Description                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [options]              | <code>Object</code> | List options                                                                                                                                                                                                                                                                                                                                                       |
| options.org_uid        | <code>string</code> | UID of the Serverless Platform Organization. Optional - defaults to inheriting from current SDK context.                                                                                                                                                                                                                                                           |
| options.org_name       | <code>string</code> | Name of the Serverless Platform Organization. Optional - defaults to inheriting from current SDK context.                                                                                                                                                                                                                                                          |
| options.event          | <code>string</code> | A string containing a specific event name, or all events by using `'*'` as a wildcard.                                                                                                                                                                                                                                                                             |
| options.limit          | <code>number</code> | A limit on the number of events to be returned. Limit can range between 1 and 100, and the default is 10.                                                                                                                                                                                                                                                          |
| options.created        | <code>number</code> | A filter on the list based on the object created field. The value can be an integer Unix timestamp, or it can be a dictionary with the following options: - `created.gt`, `created.gte`, `created.lt`, `created.lte` returning results where the event `created` field is greater, greater than or equal to, lesser than, or lesser than or equal to respectively. |
| options.starting_after | <code>string</code> | A cursor for use in pagination. `starting_after` is an event ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with `evt_foo`, your subsequent call can include `starting_after=evt_foo` in order to fetch the next page of the list.                                                               |

**Example**

```js
const events = await sdk.events.list({
  event: "member.invite.accepted",
  created: {
    gte: 1600686488878,
  },
  limit: 1,
});
console.log(JSON.stringify(events, null, 2));
// outputs:
// {
//   "object": "list",
//   "data": [
//     {
//       "uid": "evt_DdUCdz2tsY7gZr1a9Z6Xw9BD",
//       "event": "member.invite.accepted",
//       "object": "event",
//       "created": 1600707548900,
//       "data": {
//         "object": {
//            "object": "invite",
//            "org_uid": "3xVy2MWGFqpGYSlRMd",
//            "role": "collaborator",
//            "invited_by_user_uid": "ps4Vt2phVXsMyD0byW",
//            "recipient_email": "dev@serverless.com",
//            "org_name": "serverless",
//            "created": "2020-09-21T11:08:08.603Z",
//         }
//       }
//     }
//   ]
// }
```

<a name="ServerlessSDK+events.send"></a>

#### ~~events.send(event) ⇒ <code>Promise.&lt;null&gt;</code>~~

**_Deprecated_**

Dispatches a Serverless Platform Event via Websockets. The use-case for this is asynchronous publishing, where you do not want to synchronous auth requests, where every message must be authorized first, adding latency.

**Kind**: static method of [<code>events</code>](#ServerlessSDK+events)  
**Returns**: <code>Promise.&lt;null&gt;</code> - A successful publish request will be ack'ed with a `200: OK` HTTP status and empty response.  
**See**: [publish](#ServerlessSDK+events.publish)

| Param       | Type                                                     | Description                                                                                                                                                                       |
| ----------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| event       | <code>Object</code> \| <code>Array.&lt;Object&gt;</code> | An event object, or if publishing a batch of events, an array of event objects.                                                                                                   |
| event.event | <code>string</code>                                      | Event type. Serverless Platform system events are required to follow a `<entity>[.<sub-entity>].<action>` naming convention (e.g. `user.created`, `org.membership.updated`, etc). |
| event.data  | <code>Object</code>                                      | Event metadata. Serverless Platform system events are required to be formatted as described in the example below.                                                                 |

<a name="ServerlessSDK+frameworkDeployments"></a>

### serverlessSDK.frameworkDeployments : <code>object</code>

Manage Serverless Platform Deployments for Serverless Framework Traditional

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)

- [.frameworkDeployments](#ServerlessSDK+frameworkDeployments) : <code>object</code>
  - [.create([params])](#ServerlessSDK+frameworkDeployments.create) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.list([params])](#ServerlessSDK+frameworkDeployments.list) ⇒ <code>Promise.&lt;array&gt;</code>

<a name="ServerlessSDK+frameworkDeployments.create"></a>

#### frameworkDeployments.create([params]) ⇒ <code>Promise.&lt;object&gt;</code>

Create a new Serverless Platform Deployment. Additionally, if Service with provided `serviceName` does not exist, it will be created automatically as well.

**Kind**: static method of [<code>frameworkDeployments</code>](#ServerlessSDK+frameworkDeployments)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Saved deployment object.

| Param                 | Type                | Description                                                                   |
| --------------------- | ------------------- | ----------------------------------------------------------------------------- |
| [params]              | <code>Object</code> | Create deployment params.                                                     |
| params.orgName        | <code>string</code> | The name of the Serverless Platform Organization to create the Deployment in. |
| params.appName        | <code>string</code> | The name of the Serverless Platform Application to create the Deployment in.  |
| params.serviceName    | <code>string</code> | The name of the Serverless Platform Service to create the Deployment in.      |
| params.stageName      | <code>string</code> | The name of the Serverless Service Stage to create the Deployment in.         |
| params.regionName     | <code>string</code> | The name of the AWS Region to create the Deployment in.                       |
| params.deploymentData | <code>Object</code> | Data associated with saved deployment                                         |

<a name="ServerlessSDK+frameworkDeployments.list"></a>

#### frameworkDeployments.list([params]) ⇒ <code>Promise.&lt;array&gt;</code>

List Serverless Platform Deployments.

**Kind**: static method of [<code>frameworkDeployments</code>](#ServerlessSDK+frameworkDeployments)  
**Returns**: <code>Promise.&lt;array&gt;</code> - Array of Deployments.

| Param              | Type                | Description                                                                   |
| ------------------ | ------------------- | ----------------------------------------------------------------------------- |
| [params]           | <code>Object</code> | List deployment params.                                                       |
| params.orgName     | <code>string</code> | The name of the Serverless Platform Organization to list the Deployments for. |
| params.appName     | <code>string</code> | The name of the Serverless Platform Application to list the Deployment for.   |
| params.serviceName | <code>string</code> | The name of the Serverless Platform Service to list the Deployment for.       |
| params.stageName   | <code>string</code> | The name of the Serverless Service Stage to list the Deployment for.          |
| params.regionName  | <code>string</code> | The name of the AWS Region to list the Deployment for.                        |
| params.cursor      | <code>string</code> | The cursor from which Deployments should be listed. Used for pagination.      |

<a name="ServerlessSDK+webhooks"></a>

### serverlessSDK.webhooks : <code>object</code>

Register, modify and query Serverless Platform Event Webhooks

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)

- [.webhooks](#ServerlessSDK+webhooks) : <code>object</code>
  - [.register(url, [options])](#ServerlessSDK+webhooks.register) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.list([options])](#ServerlessSDK+webhooks.list) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.get(uid)](#ServerlessSDK+webhooks.get) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.update(uid)](#ServerlessSDK+webhooks.update) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.delete(uid)](#ServerlessSDK+webhooks.delete) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="ServerlessSDK+webhooks.register"></a>

#### webhooks.register(url, [options]) ⇒ <code>Promise.&lt;object&gt;</code>

Registers a webhook endpoint to receive Serverless Platform events.

Endpoint should be able to receieve JSON formatted events as a HTTP POST payload.
Furthermore, a `3` second timeout limit is enforced on event delivery with no additional retries performed.
The following HTTP headers are set on the POST request:
| Header | Value |
| ----------------------- | ------------------------------- |
| `Content-type` | `application/json` |
| `X-Serverless-Event` | Event type |
| `X-Serverless-Delivery` | Unique delivery ID |
| `User-Agent` | Prefix of `Serverless-Webhook/` |

**Kind**: static method of [<code>webhooks</code>](#ServerlessSDK+webhooks)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Registered webhook endpoint.

| Param                         | Type                              | Description                                                                                                                                                                                                                                      |
| ----------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| url                           | <code>string</code>               | HTTP webhook endpoint URL.                                                                                                                                                                                                                       |
| [options]                     | <code>Object</code>               | Registration options.                                                                                                                                                                                                                            |
| options.description           | <code>string</code>               | An optional description of what the webhook is used for.                                                                                                                                                                                         |
| options.org_uid               | <code>string</code>               | UID of the Serverless Platform Organization. Optional - defaults to inheriting from current SDK context. If registering a Serverless Platform system webhook, use a special wildcard value of `'*'` to consume events generated from _all_ orgs. |
| options.org_name              | <code>string</code>               | Name of the Serverless Platform Organization. Optional - defaults to inheriting from current SDK context.                                                                                                                                        |
| options.filter                | <code>Object</code>               | Optionally, filter which events this endpoint should receive.                                                                                                                                                                                    |
| options.filter.enabled_events | <code>Array.&lt;string&gt;</code> | The list of events to enable for this endpoint. `["*"]` indicates that all events are enabled.                                                                                                                                                   |

**Example**

```js
const webhook = await sdk.webhooks.register(
  "https://postb.in/1598300732037-0682672155089",
  { description: "This is my webhook, I like it a lot" }
);
console.log(JSON.stringify(webhook, null, 2));
// outputs:
// {
//   "uid": "whe_FPYDtTL37ye13m3sJvtcdyuF",
//   "object": "webhook_endpoint",
//   "url": "https://postb.in/1598300732037-0682672155089",
//   "description": "This is my webhook, I like it a lot",
//   "filter": {
//     "enabled_events": [
//       "*"
//     ]
//   },
//   "status": {
//     "disabled": false
//   },
//   "created": 1602078105978
// }
```

<a name="ServerlessSDK+webhooks.list"></a>

#### webhooks.list([options]) ⇒ <code>Promise.&lt;object&gt;</code>

Lists all regsitered webhook endpoints.

**Kind**: static method of [<code>webhooks</code>](#ServerlessSDK+webhooks)  
**Returns**: <code>Promise.&lt;object&gt;</code> - A dictionary with a `data` property that contains an array, with each entry being a `webhook` object.

| Param                  | Type                | Description                                                                                                                                                                                                                                                                                                           |
| ---------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [options]              | <code>Object</code> | List options.                                                                                                                                                                                                                                                                                                         |
| options.starting_after | <code>string</code> | A cursor for use in pagination. `starting_after` is a webhook endpoint object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with `whe_foo`, your subsequent call can include `starting_after=whe_foo` in order to fetch the next page of the list. |
| options.limit          | <code>number</code> | A limit on the number of webhook endpoints to be returned. Limit can range between 1 and 100, and the default is 10.                                                                                                                                                                                                  |

**Example**

```js
const webhooks = await sdk.webhooks.list({
  limit: 1,
});
console.log(JSON.stringify(webhooks, null, 2));
// outputs:
// {
//   "object": "list",
//   "data": [
//     {
//       "uid": "whe_FPYDtTL37ye13m3sJvtcdyuF",
//       "object": "webhook_endpoint",
//       "url": "https://postb.in/1598300732037-0682672155089",
//       "description": "This is my webhook, I like it a lot",
//       "filter": {
//         "enabled_events": ["*"]
//       },
//       "status": {
//         "disabled": false,
//         "most_recent_delivery": {
//           "event_uid": "evt_5cmXN7kqdu5YY69HFKegmiGR",
//           "response_status_code": 200,
//           "response_headers": {
//             "content-length": "12",
//             "connection": "close",
//             "content-type": "application/json"
//           },
//           "request_headers": {
//             "User-Agent": "Serverless-Webhook/0.1",
//             "Content-type": "application/json",
//             "X-Serverless-Delivery": "e1701c44-5d92-4515-8bfb-6c9173a89b60",
//             "X-Serverless-Event": "test.webhook.send2"
//           },
//           "response_text": "{\"ok\": true}",
//           "error_message": null,
//           "timestamp": 1599595612876
//         }
//       },
//       "created": 1599591851267,
//       "updated": 1599595613099
//     },
//   ]
// }
```

<a name="ServerlessSDK+webhooks.get"></a>

#### webhooks.get(uid) ⇒ <code>Promise.&lt;object&gt;</code>

Retrieves a webhook endpoint with the given ID.

**Kind**: static method of [<code>webhooks</code>](#ServerlessSDK+webhooks)  
**Returns**: <code>Promise.&lt;object&gt;</code> - A webhook endpoint if a valid webhook endpoint ID was provided.

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| uid   | <code>string</code> | Webhook endpoint ID. |

**Example**

```js
const webhook = await sdk.webhooks.get("whe_FPYDtTL37ye13m3sJvtcdyuF");
console.log(JSON.stringify(webhook, null, 2));
// outputs:
// {
//   "uid": "whe_FPYDtTL37ye13m3sJvtcdyuF",
//   "object": "webhook_endpoint",
//   "url": "https://postb.in/1598300732037-0682672155089",
//   "description": "This is my webhook, I like it a lot",
//   "filter": {
//     "enabled_events": ["*"]
//   },
//   "status": {
//     "disabled": false,
//     "most_recent_delivery": {
//       "event_uid": "evt_5cmXN7kqdu5YY69HFKegmiGR",
//       "response_status_code": 200,
//       "response_headers": {
//         "content-length": "12",
//         "connection": "close",
//         "content-type": "application/json"
//       },
//       "request_headers": {
//         "User-Agent": "Serverless-Webhook/0.1",
//         "Content-type": "application/json",
//         "X-Serverless-Delivery": "e1701c44-5d92-4515-8bfb-6c9173a89b60",
//         "X-Serverless-Event": "test.webhook.send2"
//       },
//       "response_text": "{\"ok\": true}",
//       "error_message": null,
//       "timestamp": 1599595612876
//     }
//   },
//   "created": 1599591851267,
//   "updated": 1599595613099
// }
```

<a name="ServerlessSDK+webhooks.update"></a>

#### webhooks.update(uid) ⇒ <code>Promise.&lt;object&gt;</code>

Updates the registered webhook endpoint. You may edit the url, description, the list of filters, and the status of your endpoint.

**Kind**: static method of [<code>webhooks</code>](#ServerlessSDK+webhooks)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Updated webhook endpoint.

| Param                         | Type                              | Description                                                                                                                |
| ----------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| uid                           | <code>string</code>               | Webhook endpoint ID.                                                                                                       |
| updates.url                   | <code>string</code>               | HTTP webhook endpoint url, if updating.                                                                                    |
| updates.description           | <code>string</code>               | An optional updated description of what the webhook is used for.                                                           |
| updates.filter                | <code>Object</code>               | Optionally, update filter which events this endpoint should receive. An existing filter can reset by setting it to `null`. |
| updates.filter.enabled_events | <code>Array.&lt;string&gt;</code> | The list of events to enable for this endpoint. `["*"]` indicates that all events are enabled.                             |
| updates.status.disabled       | <code>boolean</code>              | Enable/disable the webhook endpoint.                                                                                       |

**Example**

```js
const webhook = await sdk.webhooks.update("whe_FPYDtTL37ye13m3sJvtcdyuF", {
  url: "http://437f01fa092e.ngrok.io",
  filter: {
    enabled_events: ["user.created", "member.invite.sent"],
  },
});
console.log(JSON.stringify(webhook, null, 2));
// outputs:
// {
//   "uid": "whe_FPYDtTL37ye13m3sJvtcdyuF",
//   "object": "webhook_endpoint",
//   "url": "http://437f01fa092e.ngrok.io",
//   "description": "This is my webhook, I like it a lot",
//   "filter": {
//     "enabled_events": [
//       "user.created",
//       "member.invite.sent"
//     ]
//   },
//   "status": {
//     "disabled": false
//   },
//   "created": 1602078105978,
//   "updated": 1602078663800
// }
```

<a name="ServerlessSDK+webhooks.delete"></a>

#### webhooks.delete(uid) ⇒ <code>Promise.&lt;object&gt;</code>

Deletes the webhook endpoint with the given ID.

**Kind**: static method of [<code>webhooks</code>](#ServerlessSDK+webhooks)  
**Returns**: <code>Promise.&lt;object&gt;</code> - An object with the deleted webhook endpoints’s ID if a valid webhook endpoint ID was provided. Otherwise, this call throws an error, such as if the webhook endpoint has already been deleted.

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| uid   | <code>string</code> | Webhook endpoint ID. |

**Example**

```js
const webhook = await sdk.webhooks.delete("whe_FPYDtTL37ye13m3sJvtcdyuF");
console.log(JSON.stringify(webhook, null, 2));
// outputs:
// {
//   "uid": "whe_FPYDtTL37ye13m3sJvtcdyuF",
//   "object": "webhook_endpoint",
//   "url": "http://437f01fa092e.ngrok.io",
//   "description": "This is my webhook, I like it a lot",
//   "filter": {
//     "enabled_events": [
//       "user.created",
//       "member.invite.sent"
//     ]
//   },
//   "status": {
//     "disabled": false
//   },
//   "created": 1602078105978,
//   "updated": 1602078663800
// }
```

<a name="ServerlessSDK+accessKeys"></a>

### serverlessSDK.accessKeys : <code>object</code>

Create, get and delete Serverless Platform Access Keys for an Organization

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)

- [.accessKeys](#ServerlessSDK+accessKeys) : <code>object</code>
  - [.create(orgName, userName, accessKeyName)](#ServerlessSDK+accessKeys.create) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.list(orgName)](#ServerlessSDK+accessKeys.list) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.remove(orgName, uid)](#ServerlessSDK+accessKeys.remove) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.get()](#ServerlessSDK+accessKeys.get) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>

<a name="ServerlessSDK+accessKeys.create"></a>

#### accessKeys.create(orgName, userName, accessKeyName) ⇒ <code>Promise.&lt;object&gt;</code>

Creates a new Access Key for a User within a Serverless Organization.

**Kind**: static method of [<code>accessKeys</code>](#ServerlessSDK+accessKeys)

| Param         | Type                | Description                                                                          |
| ------------- | ------------------- | ------------------------------------------------------------------------------------ |
| orgName       | <code>string</code> | The name of the Serverless Organization to create the Access Key for                 |
| userName      | <code>string</code> | The name of the User within the Serverless Organization to create the Access Key for |
| accessKeyName | <code>string</code> | The name of the Access Key you would like to create                                  |

**Example**

```js
const accessKey = await sdk.accessKeys.create(orgName, accessKeyName);
```

<a name="ServerlessSDK+accessKeys.list"></a>

#### accessKeys.list(orgName) ⇒ <code>Promise.&lt;object&gt;</code>

Lists all Access Keys within a Serverless Organization.

**Kind**: static method of [<code>accessKeys</code>](#ServerlessSDK+accessKeys)

| Param   | Type                | Description                                                 |
| ------- | ------------------- | ----------------------------------------------------------- |
| orgName | <code>string</code> | The name of the Serverless Organization to list Access Keys |

**Example**

```js
const accessKeys = await sdk.accessKeys.list(orgName);
```

<a name="ServerlessSDK+accessKeys.remove"></a>

#### accessKeys.remove(orgName, uid) ⇒ <code>Promise.&lt;object&gt;</code>

Delete an Access Key from a Serverless Organization.

**Kind**: static method of [<code>accessKeys</code>](#ServerlessSDK+accessKeys)

| Param   | Type                | Description                                                            |
| ------- | ------------------- | ---------------------------------------------------------------------- |
| orgName | <code>string</code> | The name of the Serverless Organization that the Access Key belongs to |
| uid     | <code>string</code> | The UID of the Access Key                                              |

**Example**

```js
const accessKeys = await sdk.accessKeys.remove(orgName, uid);
```

<a name="ServerlessSDK+accessKeys.get"></a>

#### accessKeys.get() ⇒ <code>Promise.&lt;(object\|null)&gt;</code>

Get metadata for the Access Key configured under `sdk.accessKey`

**Kind**: static method of [<code>accessKeys</code>](#ServerlessSDK+accessKeys)  
**Example**

```js
const accessKeyData = await sdk.accessKeys.get();
```

<a name="ServerlessSDK+connections"></a>

### serverlessSDK.connections : <code>object</code>

Create, manage and sync Serverless Platform Connections between vendor accounts and their Serverless Organization.

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)

- [.connections](#ServerlessSDK+connections) : <code>object</code>
  - [.create(orgUid, providerUid, accountAlias)](#ServerlessSDK+connections.create) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.list(orgUid)](#ServerlessSDK+connections.list) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.get(orgUid, connectionUid)](#ServerlessSDK+connections.get) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.getByOrgAndAccountAlias(orgUid, accountAlias)](#ServerlessSDK+connections.getByOrgAndAccountAlias) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.update(orgUid, connectionUid, providerUid, accountAlias, status)](#ServerlessSDK+connections.update) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.remove(orgUid, connectionUid)](#ServerlessSDK+connections.remove) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.syncAll(orgUid)](#ServerlessSDK+connections.syncAll) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.unsync(orgUid, connectionUid)](#ServerlessSDK+connections.unsync) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="ServerlessSDK+connections.create"></a>

#### connections.create(orgUid, providerUid, accountAlias) ⇒ <code>Promise.&lt;object&gt;</code>

Creates a new Connection between a vendor account and a Serverless Organization.

**Kind**: static method of [<code>connections</code>](#ServerlessSDK+connections)

| Param        | Type                | Description                                                                                                                                                                                                                                                                  |
| ------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| orgUid       | <code>string</code> | The UID of the Serverless Organization to create a Connection in.                                                                                                                                                                                                            |
| providerUid  | <code>string</code> | The UID of an existing Serverless Provider tied to a vendor account within the Organization to use for this Connection. A vendor account (e.g. an AWS account) can only be registered once with a Connection, across all Serverless Organizations. They are globally unique. |
| accountAlias | <code>string</code> | An alias or nickname of the vendor account used to conveniently identify which account this Connection is used with. This must be unique within the Serverless Organization.                                                                                                 |

<a name="ServerlessSDK+connections.list"></a>

#### connections.list(orgUid) ⇒ <code>Promise.&lt;object&gt;</code>

List all Connections within the Serverless Organization.

**Kind**: static method of [<code>connections</code>](#ServerlessSDK+connections)

| Param  | Type                | Description                                                       |
| ------ | ------------------- | ----------------------------------------------------------------- |
| orgUid | <code>string</code> | The UID of the Serverless Organization to create a Connection in. |

<a name="ServerlessSDK+connections.get"></a>

#### connections.get(orgUid, connectionUid) ⇒ <code>Promise.&lt;object&gt;</code>

Get a single Connection within the Serverless Organization.

**Kind**: static method of [<code>connections</code>](#ServerlessSDK+connections)

| Param         | Type                | Description                                                          |
| ------------- | ------------------- | -------------------------------------------------------------------- |
| orgUid        | <code>string</code> | The UID of the Serverless Organization to get a Connection in.       |
| connectionUid | <code>string</code> | The UID of the Connection to get within the Serverless Organization. |

<a name="ServerlessSDK+connections.getByOrgAndAccountAlias"></a>

#### connections.getByOrgAndAccountAlias(orgUid, accountAlias) ⇒ <code>Promise.&lt;object&gt;</code>

Get a single Connection by Organization UID and vendor account alias within the Serverless Organization.

**Kind**: static method of [<code>connections</code>](#ServerlessSDK+connections)

| Param        | Type                | Description                                                            |
| ------------ | ------------------- | ---------------------------------------------------------------------- |
| orgUid       | <code>string</code> | The UID of the Serverless Organization to get a Connection in.         |
| accountAlias | <code>string</code> | The alias of the Connection to get within the Serverless Organization. |

<a name="ServerlessSDK+connections.update"></a>

#### connections.update(orgUid, connectionUid, providerUid, accountAlias, status) ⇒ <code>Promise.&lt;object&gt;</code>

Update a single Connection within the Serverless Organization.

**Kind**: static method of [<code>connections</code>](#ServerlessSDK+connections)

| Param         | Type                | Description                                                             |
| ------------- | ------------------- | ----------------------------------------------------------------------- |
| orgUid        | <code>string</code> | The UID of the Serverless Organization to update a Connection in.       |
| connectionUid | <code>string</code> | The UID of the Connection to update within the Serverless Organization. |
| providerUid   | <code>string</code> | The updated Provider UID within the Connection.                         |
| accountAlias  | <code>string</code> | The updated alias of the Connection.                                    |
| status        | <code>string</code> | The updated status of the Connection.                                   |

<a name="ServerlessSDK+connections.remove"></a>

#### connections.remove(orgUid, connectionUid) ⇒ <code>Promise.&lt;object&gt;</code>

Remove a single Connection within the Serverless Organization.

**Kind**: static method of [<code>connections</code>](#ServerlessSDK+connections)

| Param         | Type                | Description                                                             |
| ------------- | ------------------- | ----------------------------------------------------------------------- |
| orgUid        | <code>string</code> | The UID of the Serverless Organization to remove a Connection in.       |
| connectionUid | <code>string</code> | The UID of the Connection to remove within the Serverless Organization. |

<a name="ServerlessSDK+connections.syncAll"></a>

#### connections.syncAll(orgUid) ⇒ <code>Promise.&lt;object&gt;</code>

Run a sync operation across all Connections within the Serverless Organization. This only runs sync on Connections with an "inactive", "synced", "unsynced", "error" state. Call `connections.list()` to view status of all Connections.

**Kind**: static method of [<code>connections</code>](#ServerlessSDK+connections)

| Param  | Type                | Description                                                        |
| ------ | ------------------- | ------------------------------------------------------------------ |
| orgUid | <code>string</code> | The UID of the Serverless Organization to sync all Connections in. |

<a name="ServerlessSDK+connections.unsync"></a>

#### connections.unsync(orgUid, connectionUid) ⇒ <code>Promise.&lt;object&gt;</code>

Run an unsync operation on a specific Connection within the Serverless Organization. This only runs sync on Connections with an "synced", "error" state. Call `connections.list()` to view status of all Connections.

**Kind**: static method of [<code>connections</code>](#ServerlessSDK+connections)

| Param         | Type                | Description                                                             |
| ------------- | ------------------- | ----------------------------------------------------------------------- |
| orgUid        | <code>string</code> | The UID of the Serverless Organization to sync all Connections in.      |
| connectionUid | <code>string</code> | The UID of the Connection to unsync within the Serverless Organization. |

<a name="ServerlessSDK+desktop"></a>

### serverlessSDK.desktop : <code>object</code>

Interact with the Serverless Desktop back-end functions, like storing state for views.

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)

- [.desktop](#ServerlessSDK+desktop) : <code>object</code>
  - [.createSavedQuery(orgUid, appUid, serviceName, savedQuery)](#ServerlessSDK+desktop.createSavedQuery) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.getSavedQuery(orgUid, appUid, serviceName, savedQueryUid)](#ServerlessSDK+desktop.getSavedQuery) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.updateSavedQuery(orgUid, appUid, serviceName, savedQueryUid, savedQuery)](#ServerlessSDK+desktop.updateSavedQuery) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.deleteSavedQuery(orgUid, appUid, serviceName, savedQueryUid)](#ServerlessSDK+desktop.deleteSavedQuery) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.listSavedQueries(orgUid, appUid, serviceName)](#ServerlessSDK+desktop.listSavedQueries) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="ServerlessSDK+desktop.createSavedQuery"></a>

#### desktop.createSavedQuery(orgUid, appUid, serviceName, savedQuery) ⇒ <code>Promise.&lt;object&gt;</code>

Create a Saved Query for a Service by specifying some data.

**Kind**: static method of [<code>desktop</code>](#ServerlessSDK+desktop)

| Param       | Type                | Description                                                                      |
| ----------- | ------------------- | -------------------------------------------------------------------------------- |
| orgUid      | <code>string</code> | The UID of the Serverless Organization to create the Saved Query in.             |
| appUid      | <code>string</code> | The UID of the Serverless Application to create the Saved Query in.              |
| serviceName | <code>string</code> | The name of the Serverless Service to create the Saved Query in.                 |
| savedQuery  | <code>string</code> | The object of arbitrary data you would like to save for this Serverless Service. |

<a name="ServerlessSDK+desktop.getSavedQuery"></a>

#### desktop.getSavedQuery(orgUid, appUid, serviceName, savedQueryUid) ⇒ <code>Promise.&lt;object&gt;</code>

Get Saved Query for a Service Stage via its key.

**Kind**: static method of [<code>desktop</code>](#ServerlessSDK+desktop)

| Param         | Type                | Description                                                         |
| ------------- | ------------------- | ------------------------------------------------------------------- |
| orgUid        | <code>string</code> | The UID of the Serverless Organization to get the Saved Query from. |
| appUid        | <code>string</code> | The UID of the Serverless Application to get the Saved Query from.  |
| serviceName   | <code>string</code> | The name of the Serverless Service to get the Saved Query from.     |
| savedQueryUid | <code>string</code> | The UID of the Saved Query to get for this Serverless Service.      |

<a name="ServerlessSDK+desktop.updateSavedQuery"></a>

#### desktop.updateSavedQuery(orgUid, appUid, serviceName, savedQueryUid, savedQuery) ⇒ <code>Promise.&lt;object&gt;</code>

Update a Saved Query for a Service by specifying the UID and the data.

**Kind**: static method of [<code>desktop</code>](#ServerlessSDK+desktop)

| Param         | Type                | Description                                                                      |
| ------------- | ------------------- | -------------------------------------------------------------------------------- |
| orgUid        | <code>string</code> | The UID of the Serverless Organization to create the Saved Query in.             |
| appUid        | <code>string</code> | The UID of the Serverless Application to create the Saved Query in.              |
| serviceName   | <code>string</code> | The name of the Serverless Service to create the Saved Query in.                 |
| savedQueryUid | <code>string</code> | The UID of the Saved Query to get for this Serverless Service.                   |
| savedQuery    | <code>string</code> | The object of arbitrary data you would like to save for this Serverless Service. |

<a name="ServerlessSDK+desktop.deleteSavedQuery"></a>

#### desktop.deleteSavedQuery(orgUid, appUid, serviceName, savedQueryUid) ⇒ <code>Promise.&lt;object&gt;</code>

Delete Saved Query for a Service Stage by specifying its key.

**Kind**: static method of [<code>desktop</code>](#ServerlessSDK+desktop)

| Param         | Type                | Description                                                            |
| ------------- | ------------------- | ---------------------------------------------------------------------- |
| orgUid        | <code>string</code> | The UID of the Serverless Organization to delete the Saved Query from. |
| appUid        | <code>string</code> | The UID of the Serverless Application to delete the Saved Query from.  |
| serviceName   | <code>string</code> | The name of the Serverless Service to delete the Saved Query from.     |
| savedQueryUid | <code>string</code> | The UID of the Saved Query to delete for this Serverless Service.      |

<a name="ServerlessSDK+desktop.listSavedQueries"></a>

#### desktop.listSavedQueries(orgUid, appUid, serviceName) ⇒ <code>Promise.&lt;object&gt;</code>

List Saved Queries for a Service.

**Kind**: static method of [<code>desktop</code>](#ServerlessSDK+desktop)

| Param       | Type                | Description                                                            |
| ----------- | ------------------- | ---------------------------------------------------------------------- |
| orgUid      | <code>string</code> | The UID of the Serverless Organization to list the Saved Queries from. |
| appUid      | <code>string</code> | The UID of the Serverless Application to list the Saved Queries from.  |
| serviceName | <code>string</code> | The name of the Serverless Service to list the Saved Queries from.     |

<a name="ServerlessSDK+logDestinations"></a>

### serverlessSDK.logDestinations : <code>object</code>

Manage Log Destinations for your Organization

Log Destination is represented by CloudWatch Logs Destination resource that is responsible for forwarding logs from selected service
to Kinesis streams. These logs are later forwarded form Kinesis streams to Elasticsearch service.

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)

- [.logDestinations](#ServerlessSDK+logDestinations) : <code>object</code>
  - [.getOrCreate([params])](#ServerlessSDK+logDestinations.getOrCreate) ⇒ <code>Promise.&lt;object&gt;</code>
  - [.remove([params])](#ServerlessSDK+logDestinations.remove) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="ServerlessSDK+logDestinations.getOrCreate"></a>

#### logDestinations.getOrCreate([params]) ⇒ <code>Promise.&lt;object&gt;</code>

Get or Create Log Destination.
If Log Destination already exists for a service in selected region and for selected stage, it will be returned, otherwise it will be created.

**Kind**: static method of [<code>logDestinations</code>](#ServerlessSDK+logDestinations)

| Param              | Type                | Description                                                                 |
| ------------------ | ------------------- | --------------------------------------------------------------------------- |
| [params]           | <code>Object</code> | Get or Create params                                                        |
| params.orgUid      | <code>string</code> | The UID of the Serverless Organization to create the Log Destination for.   |
| params.appUid      | <code>string</code> | The UID of the Serverless Application to create the Log Destination for.    |
| params.serviceName | <code>string</code> | The name of the Serverless Service to create the Log Destination for.       |
| params.stageName   | <code>string</code> | The name of the Serverless Service Stage to create the Log Destination for. |
| params.regionName  | <code>string</code> | The name of the AWS Region to create the Log Destination for.               |
| params.accountId   | <code>string</code> | The ID of the AWS Account to create the Log Destination for.                |

**Example**

```js
const result = await sdk.logDestinations.getOrCreate({
  orgUid: "1234",
  appUid: "123456789",
  serviceName: "log-dest-integration-test-service-name",
  stageName: "log-dest-integration-test-stage",
  regionName: "us-east-1",
  accountId: "111111111111",
});
console.log(JSON.stringify(result, null, 2));
// outputs:
// {
//   "destinationArn": "arn:aws:logs:us-east-1:111111111111:destination:c492b73f-3704-4d5b-839a-d4fbc7adc328#123456789#log-dest-integration-test-service-name#log-dest-integration-test-stage",
// }
```

<a name="ServerlessSDK+logDestinations.remove"></a>

#### logDestinations.remove([params]) ⇒ <code>Promise.&lt;object&gt;</code>

Remove Log Destination

**Kind**: static method of [<code>logDestinations</code>](#ServerlessSDK+logDestinations)

| Param              | Type                | Description                                                                  |
| ------------------ | ------------------- | ---------------------------------------------------------------------------- |
| [params]           | <code>Object</code> | Remove params                                                                |
| params.orgUid      | <code>string</code> | The UID of the Serverless Organization to remove the Log Destination from.   |
| params.appUid      | <code>string</code> | The UID of the Serverless Application to remove the Log Destination from.    |
| params.serviceName | <code>string</code> | The name of the Serverless Service to remove the Log Destination from.       |
| params.stageName   | <code>string</code> | The name of the Serverless Service Stage to remove the Log Destination from. |
| params.regionName  | <code>string</code> | The name of the AWS Region to remove the Log Destination from.               |

**Example**

```js
await sdk.logDestinations.remove({
  orgUid: "1234",
  appUid: "123456789",
  serviceName: "log-dest-integration-test-service-name",
  stageName: "log-dest-integration-test-stage",
  regionName: "us-east-1",
});
```

<a name="ServerlessSDK+deploymentProfiles"></a>

### serverlessSDK.deploymentProfiles : <code>object</code>

Manage Deployment Profiles for your Organization

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)

- [.deploymentProfiles](#ServerlessSDK+deploymentProfiles) : <code>object</code>
  - [.get([params])](#ServerlessSDK+deploymentProfiles.get) ⇒ <code>Promise.&lt;Object&gt;</code>
  - [.create([params])](#ServerlessSDK+deploymentProfiles.create) ⇒ <code>Promise.&lt;Object&gt;</code>
  - [.list([params])](#ServerlessSDK+deploymentProfiles.list) ⇒ <code>Promise.&lt;array&gt;</code>
  - [.setDefault([params])](#ServerlessSDK+deploymentProfiles.setDefault) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="ServerlessSDK+deploymentProfiles.get"></a>

#### deploymentProfiles.get([params]) ⇒ <code>Promise.&lt;Object&gt;</code>

Get a Deployment Profile associated with an Application

**Kind**: static method of [<code>deploymentProfiles</code>](#ServerlessSDK+deploymentProfiles)

| Param              | Type                | Description                               |
| ------------------ | ------------------- | ----------------------------------------- |
| [params]           | <code>Object</code> | Get params                                |
| params.orgName     | <code>string</code> | The name of the Serverless Organization.  |
| params.appName     | <code>string</code> | The name of the Serverless Organization.  |
| params.serviceName | <code>string</code> | The name of the Serverless Service.       |
| params.stageName   | <code>string</code> | The name of the Serverless Service Stage. |

<a name="ServerlessSDK+deploymentProfiles.create"></a>

#### deploymentProfiles.create([params]) ⇒ <code>Promise.&lt;Object&gt;</code>

Create a Deployment Profile

**Kind**: static method of [<code>deploymentProfiles</code>](#ServerlessSDK+deploymentProfiles)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Created Deployment Profile

| Param                      | Type                | Description                                                           |
| -------------------------- | ------------------- | --------------------------------------------------------------------- |
| [params]                   | <code>Object</code> | Create params                                                         |
| params.profileName         | <code>string</code> | The name of the created Deployment Profile.                           |
| params.orgName             | <code>string</code> | The name of the Serverless Organization.                              |
| params.description         | <code>string</code> | Optional The description for the created Deployment Profile.          |
| params.secrets             | <code>array</code>  | Optional The secrets for the created Deployment Profile.              |
| params.safeguardsPolicies  | <code>array</code>  | Optional The safeguard policies for the created Deployment Profile.   |
| params.providerCredentials | <code>object</code> | Optional The provider credentials for the created Deployment Profile. |

<a name="ServerlessSDK+deploymentProfiles.list"></a>

#### deploymentProfiles.list([params]) ⇒ <code>Promise.&lt;array&gt;</code>

List Deployment Profiles

**Kind**: static method of [<code>deploymentProfiles</code>](#ServerlessSDK+deploymentProfiles)  
**Returns**: <code>Promise.&lt;array&gt;</code> - Array of DeploymentProfile objects.

| Param          | Type                | Description                              |
| -------------- | ------------------- | ---------------------------------------- |
| [params]       | <code>Object</code> | List params                              |
| params.orgName | <code>string</code> | The name of the Serverless Organization. |

<a name="ServerlessSDK+deploymentProfiles.setDefault"></a>

#### deploymentProfiles.setDefault([params]) ⇒ <code>Promise.&lt;Object&gt;</code>

Set default Deployment Profile for an Application

**Kind**: static method of [<code>deploymentProfiles</code>](#ServerlessSDK+deploymentProfiles)

| Param             | Type                | Description                                                                      |
| ----------------- | ------------------- | -------------------------------------------------------------------------------- |
| [params]          | <code>Object</code> | Get params                                                                       |
| params.orgName    | <code>string</code> | The name of the Serverless Organization.                                         |
| params.appName    | <code>string</code> | The name of the Serverless Organization.                                         |
| params.profileUid | <code>string</code> | The UID of the Deployment Profile that should be associated with an Application. |

<a name="ServerlessSDK+organizations"></a>

### serverlessSDK.organizations : <code>object</code>

Create, get and list Serverless Platform Organizations.

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)

- [.organizations](#ServerlessSDK+organizations) : <code>object</code>
  - [.get([params])](#ServerlessSDK+organizations.get) ⇒ <code>object</code>
  - [.list([params])](#ServerlessSDK+organizations.list) ⇒ <code>array</code>
  - [.create([params])](#ServerlessSDK+organizations.create) ⇒ <code>object</code>
  - [.validate([params])](#ServerlessSDK+organizations.validate) ⇒ <code>array</code>

<a name="ServerlessSDK+organizations.get"></a>

#### organizations.get([params]) ⇒ <code>object</code>

Gets an Organization

**Kind**: static method of [<code>organizations</code>](#ServerlessSDK+organizations)  
**Returns**: <code>object</code> - Returns the Organization record.

| Param          | Type                | Description                                        |
| -------------- | ------------------- | -------------------------------------------------- |
| [params]       | <code>Object</code> | Get organization params                            |
| params.orgName | <code>string</code> | The name of the Organization you wish to retrieve. |

<a name="ServerlessSDK+organizations.list"></a>

#### organizations.list([params]) ⇒ <code>array</code>

List organizations

**Kind**: static method of [<code>organizations</code>](#ServerlessSDK+organizations)  
**Returns**: <code>array</code> - Returns an array of Organizations

| Param           | Type                | Description                                                |
| --------------- | ------------------- | ---------------------------------------------------------- |
| [params]        | <code>Object</code> | List organizations params                                  |
| params.username | <code>string</code> | The name of the User whose Organizations you wish to list. |

<a name="ServerlessSDK+organizations.create"></a>

#### organizations.create([params]) ⇒ <code>object</code>

Creates an Organization and User if one does not exist.

**Kind**: static method of [<code>organizations</code>](#ServerlessSDK+organizations)  
**Returns**: <code>object</code> - Returns the newly created Organization.

| Param           | Type                | Description                                                                                                                             |
| --------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [params]        | <code>Object</code> | Create organization params                                                                                                              |
| params.orgName  | <code>string</code> | The name of the Organization you wish to create.                                                                                        |
| params.username | <code>string</code> | Optional The username for a User that will be created if one does not exist. If it's not provided, it will default to `params.orgName`. |
| params.email    | <code>string</code> | Optional The email that will be associated with created User.                                                                           |
| params.password | <code>string</code> | Optional The password that will be associated with created User.                                                                        |

<a name="ServerlessSDK+organizations.validate"></a>

#### organizations.validate([params]) ⇒ <code>array</code>

Validates whether a potential User and Organization name meets the Platform requirements. Most importantly, this calls the Platform to validate whether the User and Organization names are already taken. This method is necessary because every User must have an Organization and we want to be sure both namespaces are available, before creating one or the other. In the future, both of these records should be created in the back-end, not on the client-side. Until then, this method is essential.

**Kind**: static method of [<code>organizations</code>](#ServerlessSDK+organizations)  
**Returns**: <code>array</code> - Returns an array of validation errors, if any. Otherwise, returns null.

| Param           | Type                | Description                                                                                  |
| --------------- | ------------------- | -------------------------------------------------------------------------------------------- |
| [params]        | <code>Object</code> | Validate params                                                                              |
| params.orgName  | <code>string</code> | The name of the Organization.                                                                |
| params.username | <code>string</code> | Optional The username for a User. If it's not provided, it will default to `params.orgName`. |

<a name="ServerlessSDK+apps"></a>

### serverlessSDK.apps : <code>object</code>

Register, update, delete and list Applications

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)

- [.apps](#ServerlessSDK+apps) : <code>object</code>
  - [.create([params])](#ServerlessSDK+apps.create) ⇒ <code>object</code>
  - [.get([params])](#ServerlessSDK+apps.get)
  - [.update([params])](#ServerlessSDK+apps.update) ⇒ <code>object</code>
  - [.remove([params])](#ServerlessSDK+apps.remove)
  - [.list([params])](#ServerlessSDK+apps.list)

<a name="ServerlessSDK+apps.create"></a>

#### apps.create([params]) ⇒ <code>object</code>

Create an Application within an Organization

**Kind**: static method of [<code>apps</code>](#ServerlessSDK+apps)  
**Returns**: <code>object</code> - Returns a data object of the newly created Application

| Param                         | Type                | Description                                                                                                                                                                                  |
| ----------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [params]                      | <code>Object</code> | Create app params                                                                                                                                                                            |
| params.orgName                | <code>string</code> | The name of the Organization you wish to create an Application in.                                                                                                                           |
| params.app.name               | <code>string</code> | The name of the Application.                                                                                                                                                                 |
| params.app.description        | <code>string</code> | The description of the Application.                                                                                                                                                          |
| params.app.deploymentProfiles | <code>object</code> | An object of deployment profiles and stages. This structure is a bit confusing. Look at the back-end service for more details and hopefully we can design this more elegantly in the future. |

<a name="ServerlessSDK+apps.get"></a>

#### apps.get([params])

Get an Application within an Organization

**Kind**: static method of [<code>apps</code>](#ServerlessSDK+apps)

| Param          | Type                | Description                                              |
| -------------- | ------------------- | -------------------------------------------------------- |
| [params]       | <code>Object</code> | Get app params                                           |
| params.orgName | <code>string</code> | The name of the Organization the Application belongs to. |
| params.appName | <code>string</code> | The name of the Application you want to retrieve.        |

<a name="ServerlessSDK+apps.update"></a>

#### apps.update([params]) ⇒ <code>object</code>

Update an Application within an Organization

**Kind**: static method of [<code>apps</code>](#ServerlessSDK+apps)  
**Returns**: <code>object</code> - Returns a data object of the updated Application

| Param                         | Type                | Description                                                                                                                                                                                                                |
| ----------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [params]                      | <code>Object</code> | Update app params                                                                                                                                                                                                          |
| params.orgName                | <code>string</code> | The name of the Organization the Application belongs to.                                                                                                                                                                   |
| params.app.name               | <code>string</code> | The name of the Application you wish to update. This property cannot be updated due to current data modeling issues.                                                                                                       |
| params.app.description        | <code>string</code> | The description of the Application. This property can be updated.                                                                                                                                                          |
| params.app.deploymentProfiles | <code>object</code> | An object of deployment profiles and stages. This property can be updated. This structure is a bit confusing. Look at the back-end service for more details and hopefully we can design this more elegantly in the future. |

<a name="ServerlessSDK+apps.remove"></a>

#### apps.remove([params])

Delete an Application within an Organization

**Kind**: static method of [<code>apps</code>](#ServerlessSDK+apps)

| Param          | Type                | Description                                              |
| -------------- | ------------------- | -------------------------------------------------------- |
| [params]       | <code>Object</code> | Update app params                                        |
| params.orgName | <code>string</code> | The name of the Organization the Application belongs to. |
| params.appName | <code>string</code> | The name of the Application you wish to delete.          |

<a name="ServerlessSDK+apps.list"></a>

#### apps.list([params])

List all Applications within an Organization

**Kind**: static method of [<code>apps</code>](#ServerlessSDK+apps)

| Param          | Type                | Description                                              |
| -------------- | ------------------- | -------------------------------------------------------- |
| [params]       | <code>Object</code> | Update app params                                        |
| params.orgName | <code>string</code> | The name of the Organization the Application belongs to. |

<a name="ServerlessSDK+metadata"></a>

### serverlessSDK.metadata : <code>object</code>

Get Metadata for Serverless Platform

**Kind**: instance namespace of [<code>ServerlessSDK</code>](#ServerlessSDK)  
<a name="ServerlessSDK+metadata.get"></a>

#### metadata.get() ⇒ <code>Promise.&lt;Object&gt;</code>

Get Metadata for Serverless Platform, which includes informations about regions and runtimes that are supported by the platform.

**Kind**: static method of [<code>metadata</code>](#ServerlessSDK+metadata)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A dictionary with an `awsAccountId`, `supportedRegions` and `supportedRuntimes` properties. Both `supportedRuntimes` and `supportedRegions` are arrays.  
**Example**

```js
const metadata = await sdk.metadata.get();
console.log(JSON.stringify(metadata, null, 2));
// outputs:
// {
//   "awsAccountId": "111111111111",
//   "supportedRuntimes": [
//     "nodejs8.10",
//     "nodejs10.x",
//     "nodejs12.x",
//     "python2.7",
//     "python3.6",
//     "python3.7",
//     "python3.8"
//   ],
//   "supportedRegions": [
//     "us-east-1",
//     "us-east-2",
//     "us-west-1",
//     "us-west-2",
//     "eu-central-1",
//     "eu-west-1",
//     "eu-west-2",
//     "eu-west-3",
//     "ap-northeast-1",
//     "ap-southeast-1",
//     "ap-southeast-2",
//     "eu-central-1",
//     "ap-south-1",
//     "ca-central-1",
//     "sa-east-1"
//   ]
// }
```

<a name="ServerlessSDK+config"></a>

### serverlessSDK.config() ⇒ <code>null</code>

Updates the SDK configuration

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param                      | Type                | Description                                                                                                                                                                              |
| -------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [config.accessKey]         | <code>string</code> | Can either be a Serverless Platform Access Key or an ID Token.                                                                                                                           |
| [config.platformStage]     | <code>string</code> | The Serverless Platform Stage you wish to interact with. This can also be set by the environment variable SERVERLESS_PLATFORM_STAGE=                                                     |
| [context.orgName]          | <code>string</code> | The name of the Serverless Platform Organization you wish to interact with. If set, this value is used upon creating a Websockets connection, and auto-added to every Event you publish. |
| [context.orgUid]           | <code>string</code> | The ID of the Serverless Platform Organization you wish to interact with. If set, this value is used upon creating a Websockets connection, and auto-added to every Event you publish.   |
| [context.stageName]        | <code>string</code> | The Serverless Platform Organization Stage you wish to interact with. If set, this value is auto-added to every Event you publish.                                                       |
| [context.appName]          | <code>string</code> | The Serverless Platform Application you wish to interact with. If set, this value is auto-added to every Event you publish.                                                              |
| [context.instanceName]     | <code>string</code> | The Serverless Platform Instance you wish to interact with. If set, this value is auto-added to every Event you publish.                                                                 |
| [context.componentName]    | <code>string</code> | The Serverless Platform Component you wish to interact with. If set, this value is auto-added to every Event you publish.                                                                |
| [context.componentVersion] | <code>string</code> | The Serverless Platform Component version you wish to interact with. If set, this value is auto-added to every Event you publish.                                                        |

**Example**

```js
const { ServerlessSDK } = require("@serverless/platform-client");

const sdk = new ServerlessSDK();
sdk.config({
  accessKey: "123456789",
  context: {
    orgName: "my-org",
    orgUid: "1234",
    stageName: "prod",
    appName: "my-app",
    instanceName: "my-instance",
  },
});
```

<a name="ServerlessSDK+getDomain"></a>

### serverlessSDK.getDomain(serviceName) ⇒ <code>string</code>

Gets a domain for a specific service: 'engine', 'registry', 'events-streaming'

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>string</code> - The domain of that service.

| Param       | Type                | Default           | Description                                                          |
| ----------- | ------------------- | ----------------- | -------------------------------------------------------------------- |
| serviceName | <code>string</code> | <code>null</code> | The name of the Serverless Platform Service you want the domain for. |

<a name="ServerlessSDK+getUser"></a>

### serverlessSDK.getUser() ⇒ <code>object</code>

Get User account

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns a user record.  
<a name="ServerlessSDK+getUserMeta"></a>

### serverlessSDK.getUserMeta() ⇒ <code>object</code>

Get User account meta information.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns a data object of custom "meta" information.  
<a name="ServerlessSDK+saveUserMeta"></a>

### serverlessSDK.saveUserMeta(userMeta) ⇒ <code>object</code>

Updates User account meta information. This method fetches meta information and merges it with the meta object you provide before saving. Please note that this does a shallow merge and not a deep merge. That means nested properties might be replaced.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns a data object of User data.

| Param    | Type                | Description                                                                        |
| -------- | ------------------- | ---------------------------------------------------------------------------------- |
| userMeta | <code>object</code> | An object of new userMeta that will be automaticaly merged with the old user meta. |

<a name="ServerlessSDK+validateUserAndOrgName"></a>

### ~~serverlessSDK.validateUserAndOrgName(userAndOrgName) ⇒ <code>array</code>~~

**_Deprecated_**

Validates whether a potential User and Organization name meets the Platform requirements. Most importantly, this calls the Platform to validate whether the User and Organization names are already taken. This method is necessary because every User must have an Organization and we want to be sure both namespaces are availbale, before creating one or the other. In the future, both of these records should be created in the back-end, not on the client-side. Until then, this method is essential.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>array</code> - Returns an array of validation errors, if any. Otherwise, returns null.

| Param          | Type                | Description                        |
| -------------- | ------------------- | ---------------------------------- |
| userAndOrgName | <code>string</code> | The name of the User and Org name. |

<a name="ServerlessSDK+createUserAndOrg"></a>

### ~~serverlessSDK.createUserAndOrg(userAndOrgName) ⇒ <code>object</code>~~

**_Deprecated_**

In the Serverless Platform, every User must have an Organization by default. This method creates both a User and an Organization record, at the same time. Please note, the endpoint called is specific to Tenants (Organizations), which also has User creation logic within it. This API design is non-sensible and we should consider a better API design ASAP. Until then, this method abstracts over that.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns the newly create Organization.

| Param          | Type                | Description                        |
| -------------- | ------------------- | ---------------------------------- |
| userAndOrgName | <code>string</code> | The name of the User and Org name. |

<a name="ServerlessSDK+createOrg"></a>

### ~~serverlessSDK.createOrg(userAndOrgName) ⇒ <code>object</code>~~

**_Deprecated_**

Creates an Organization.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns the newly create Organization.

| Param          | Type                | Description                                                                                                                                                                      |
| -------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| userAndOrgName | <code>string</code> | The name of the Organization you wish to create. WARNING: This also creates a User record if one does not exist under this Organization name. This API design needs improvement. |

<a name="ServerlessSDK+getOrgByName"></a>

### ~~serverlessSDK.getOrgByName(orgName) ⇒ <code>object</code>~~

**_Deprecated_**

Gets an Organization by Organization name.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns the Organization record.

| Param   | Type                | Description                                        |
| ------- | ------------------- | -------------------------------------------------- |
| orgName | <code>string</code> | The name of the Organization you wish to retrieve. |

<a name="ServerlessSDK+listOrgs"></a>

### ~~serverlessSDK.listOrgs(username) ⇒ <code>object</code>~~

**_Deprecated_**

Lists Organizations by User, whether the User is an Owner or a Member of a given Organization.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns an array of Organizations

| Param    | Type                | Description                                                |
| -------- | ------------------- | ---------------------------------------------------------- |
| username | <code>string</code> | The name of the User whose Organizations you wish to list. |

<a name="ServerlessSDK+createApp"></a>

### ~~serverlessSDK.createApp(orgName) ⇒ <code>object</code>~~

**_Deprecated_**

Create an Application within an Organization

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns a data object of the newly created Application

| Param                  | Type                | Default           | Description                                                                                                                                                                                  |
| ---------------------- | ------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| orgName                | <code>string</code> | <code>null</code> | The name of the Organization you wish to create an Application in.                                                                                                                           |
| app.name               | <code>string</code> |                   | The name of the Application.                                                                                                                                                                 |
| app.description        | <code>string</code> |                   | The description of the Application.                                                                                                                                                          |
| app.deploymentProfiles | <code>object</code> |                   | An object of deployment profiles and stages. This structure is a bit confusing. Look at the back-end service for more details and hopefully we can design this more elegantly in the future. |

<a name="ServerlessSDK+updateApp"></a>

### ~~serverlessSDK.updateApp(orgName) ⇒ <code>object</code>~~

**_Deprecated_**

Update an Application within an Organization

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns a data object of the updated Application

| Param                  | Type                | Default           | Description                                                                                                                                                                                                                |
| ---------------------- | ------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| orgName                | <code>string</code> | <code>null</code> | The name of the Organization the Application belongs to.                                                                                                                                                                   |
| app.name               | <code>string</code> |                   | The name of the Application you wish to update. This property cannot be updated due to current data modeling issues.                                                                                                       |
| app.description        | <code>string</code> |                   | The description of the Application. This property can be updated.                                                                                                                                                          |
| app.deploymentProfiles | <code>object</code> |                   | An object of deployment profiles and stages. This property can be updated. This structure is a bit confusing. Look at the back-end service for more details and hopefully we can design this more elegantly in the future. |

<a name="ServerlessSDK+deleteApp"></a>

### ~~serverlessSDK.deleteApp(orgName, appName)~~

**_Deprecated_**

Delete an Application within an Organization

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param   | Type                | Default           | Description                                              |
| ------- | ------------------- | ----------------- | -------------------------------------------------------- |
| orgName | <code>string</code> | <code>null</code> | The name of the Organization the Application belongs to. |
| appName | <code>string</code> | <code>null</code> | The name of the Application you wish to delete.          |

<a name="ServerlessSDK+listApps"></a>

### ~~serverlessSDK.listApps(orgName)~~

**_Deprecated_**

List all Applications within an Organization

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param   | Type                | Default           | Description                                              |
| ------- | ------------------- | ----------------- | -------------------------------------------------------- |
| orgName | <code>string</code> | <code>null</code> | The name of the Organization the Application belongs to. |

<a name="ServerlessSDK+createInitToken"></a>

### serverlessSDK.createInitToken(orgName)

Create an initToken for a user and organization

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param             | Type                              | Default           | Description                                                                                  |
| ----------------- | --------------------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| orgName           | <code>string</code>               | <code>null</code> | The name of the Organization the Init Token belongs to.                                      |
| template.type     | <code>string</code>               |                   | Must be either s3, github, or existing.                                                      |
| template.commands | <code>Array.&lt;string&gt;</code> |                   | Array of commands executed by the user's shell env in order to fetch and set up the template |

<a name="ServerlessSDK+getInitToken"></a>

### serverlessSDK.getInitToken(initTokenUid)

Get an initToken by UID

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param        | Type                | Description                       |
| ------------ | ------------------- | --------------------------------- |
| initTokenUid | <code>string</code> | Unique identifier of an initToken |

<a name="ServerlessSDK+createProvider"></a>

### serverlessSDK.createProvider(orgUid, data)

Create a provider

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param  | Type            |
| ------ | --------------- |
| orgUid | <code>\*</code> |
| data   | <code>\*</code> |

<a name="ServerlessSDK+updateProvider"></a>

### serverlessSDK.updateProvider(orgUid, providerUid, data)

Update a provider

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param       | Type            |
| ----------- | --------------- |
| orgUid      | <code>\*</code> |
| providerUid | <code>\*</code> |
| data        | <code>\*</code> |

<a name="ServerlessSDK+setDefaultProvider"></a>

### serverlessSDK.setDefaultProvider(orgUid, providerUid)

Set a default provider

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param       | Type            |
| ----------- | --------------- |
| orgUid      | <code>\*</code> |
| providerUid | <code>\*</code> |

<a name="ServerlessSDK+unsetDefaultProvider"></a>

### serverlessSDK.unsetDefaultProvider(orgUid, providerUid)

Unsets the default provider

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param       | Type            |
| ----------- | --------------- |
| orgUid      | <code>\*</code> |
| providerUid | <code>\*</code> |

<a name="ServerlessSDK+deleteProvider"></a>

### serverlessSDK.deleteProvider(orgUid, providerUid)

Delete a provider

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param       | Type            |
| ----------- | --------------- |
| orgUid      | <code>\*</code> |
| providerUid | <code>\*</code> |

<a name="ServerlessSDK+createProviderLink"></a>

### serverlessSDK.createProviderLink(orgUid, linkType, linkUid, providerUid)

Create a providerLink
Link type can be either `service` or `instance`

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param       | Type            |
| ----------- | --------------- |
| orgUid      | <code>\*</code> |
| linkType    | <code>\*</code> |
| linkUid     | <code>\*</code> |
| providerUid | <code>\*</code> |

<a name="ServerlessSDK+deleteProviderLink"></a>

### serverlessSDK.deleteProviderLink(orgUid, linkType, linkUid, providerUid)

Delete a providerLink
Link type can be either `service` or `instance`

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param       | Type            |
| ----------- | --------------- |
| orgUid      | <code>\*</code> |
| linkType    | <code>\*</code> |
| linkUid     | <code>\*</code> |
| providerUid | <code>\*</code> |

<a name="ServerlessSDK+getProviders"></a>

### serverlessSDK.getProviders(orgUid)

List providers by OrgUid

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param  | Type            |
| ------ | --------------- |
| orgUid | <code>\*</code> |

<a name="ServerlessSDK+getProvider"></a>

### serverlessSDK.getProvider(orgUid, providerUid)

Get a Provider

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param       | Type            |
| ----------- | --------------- |
| orgUid      | <code>\*</code> |
| providerUid | <code>\*</code> |

<a name="ServerlessSDK+getProvidersByOrgServiceInstance"></a>

### serverlessSDK.getProvidersByOrgServiceInstance(orgUid, serviceUid, instanceUid)

Get providers by org, service, and instance
Configuration set at the instance level will override
defaults set at the service level

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param       | Type            |
| ----------- | --------------- |
| orgUid      | <code>\*</code> |
| serviceUid  | <code>\*</code> |
| instanceUid | <code>\*</code> |

<a name="ServerlessSDK+getProvidersByLink"></a>

### serverlessSDK.getProvidersByLink(orgUid, linkType, linkUid)

List providers by Link

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param    | Type            |
| -------- | --------------- |
| orgUid   | <code>\*</code> |
| linkType | <code>\*</code> |
| linkUid  | <code>\*</code> |

<a name="ServerlessSDK+getAllowedProviders"></a>

### serverlessSDK.getAllowedProviders()

Returns the list of supported providers

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
<a name="ServerlessSDK+createParam"></a>

### serverlessSDK.createParam(orgUid, linkType, linkUid, data)

Create a param and link it to a service or an instance

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param    | Type            |
| -------- | --------------- |
| orgUid   | <code>\*</code> |
| linkType | <code>\*</code> |
| linkUid  | <code>\*</code> |
| data     | <code>\*</code> |

<a name="ServerlessSDK+deleteParam"></a>

### serverlessSDK.deleteParam(orgUid, linkType, linkUid, paramUid)

Destroy a param

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param    | Type            |
| -------- | --------------- |
| orgUid   | <code>\*</code> |
| linkType | <code>\*</code> |
| linkUid  | <code>\*</code> |
| paramUid | <code>\*</code> |

<a name="ServerlessSDK+updateParam"></a>

### serverlessSDK.updateParam(orgUid, linkType, linkUid, paramUid, data)

Update a param

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param    | Type            |
| -------- | --------------- |
| orgUid   | <code>\*</code> |
| linkType | <code>\*</code> |
| linkUid  | <code>\*</code> |
| paramUid | <code>\*</code> |
| data     | <code>\*</code> |

<a name="ServerlessSDK+getParams"></a>

### serverlessSDK.getParams(orgUid, linkType, linkUid)

List params by service or instance

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param    | Type            |
| -------- | --------------- |
| orgUid   | <code>\*</code> |
| linkType | <code>\*</code> |
| linkUid  | <code>\*</code> |

<a name="ServerlessSDK+getParamsByOrgServiceInstance"></a>

### serverlessSDK.getParamsByOrgServiceInstance(orgUid, serviceUid, instanceUid)

List params by org, service, and instance

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param       | Type            |
| ----------- | --------------- |
| orgUid      | <code>\*</code> |
| serviceUid  | <code>\*</code> |
| instanceUid | <code>\*</code> |

<a name="ServerlessSDK+getParamsAndProvidersByOrgServiceInstance"></a>

### serverlessSDK.getParamsAndProvidersByOrgServiceInstance(orgUid, serviceUid, instanceUid)

List parameters and providers by org, service, and instance

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param       | Type            |
| ----------- | --------------- |
| orgUid      | <code>\*</code> |
| serviceUid  | <code>\*</code> |
| instanceUid | <code>\*</code> |

<a name="ServerlessSDK+connect"></a>

### serverlessSDK.connect([options]) ⇒ <code>null</code>

Establishes a websockets connection with the Serverless Platform

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param                         | Type                                       | Default                      | Description                                                                             |
| ----------------------------- | ------------------------------------------ | ---------------------------- | --------------------------------------------------------------------------------------- |
| [options]                     | <code>Object</code>                        | <code>{}</code>              | Connection options.                                                                     |
| [options.orgName]             | <code>string</code>                        |                              | Name of the Serverless Platform Org. If not specified, inherits from SDK context.       |
| [options.orgUid]              | <code>string</code>                        |                              | ID of the Serverless Platform Org. If not specified, inherits from SDK context.         |
| [options.onEvent]             | [<code>onEvent</code>](#onEvent)           |                              | A function that handles events recieved from the Serverless Platform.                   |
| [options.onDisconnect]        | [<code>onDisconnect</code>](#onDisconnect) |                              | Register a disconnect callback.                                                         |
| [options.onError]             | <code>onError</code>                       |                              | Register an onError callback.                                                           |
| [options.filter]              | <code>Object</code>                        |                              | Filters which events this connection should receive.                                    |
| [options.filter.stageName]    | <code>string</code>                        |                              | Tells the SDK to only receive events on a specific stage.                               |
| [options.filter.appName]      | <code>string</code>                        |                              | Tells the SDK to only receive events on a specific app.                                 |
| [options.filter.instanceName] | <code>string</code>                        |                              | Tells the SDK to only receive events on a specific service.                             |
| [options.filter.events]       | <code>Array.&lt;string&gt;</code>          | <code>[&quot;*&quot;]</code> | Restrict the types of receivable events. `["*"]` indicates that all events are enabled. |

<a name="ServerlessSDK+disconnect"></a>

### serverlessSDK.disconnect() ⇒ <code>null</code>

Disconnects a websockets connection with the Serverless Platform

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
<a name="ServerlessSDK+isConnected"></a>

### serverlessSDK.isConnected() ⇒ <code>boolean</code>

Checks if the SDK is currently connected to the Serverless Platform

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>boolean</code> - Will return true if the websocket connection is active.  
<a name="ServerlessSDK+unpublishFromRegistry"></a>

### serverlessSDK.unpublishFromRegistry(registryPackage)

Unpublishes a package from the registry

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param           | Type            | Description                                                |
| --------------- | --------------- | ---------------------------------------------------------- |
| registryPackage | <code>\*</code> | An object containing the properties of a registry package. |

<a name="ServerlessSDK+publishToRegistry"></a>

### serverlessSDK.publishToRegistry(registryPackage) ⇒ <code>object</code>

Publishes a package to the registry

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - The published registry package is returned from the Platform API.

| Param           | Type            | Description                                                |
| --------------- | --------------- | ---------------------------------------------------------- |
| registryPackage | <code>\*</code> | An object containing the properties of a registry package. |

<a name="ServerlessSDK+getFromRegistry"></a>

### serverlessSDK.getFromRegistry(name, version) ⇒ <code>object</code>

Fetches package/s from the registry

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns a registry package from the Registry.

| Param   | Type            | Default       | Description                                                                                                                       |
| ------- | --------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| name    | <code>\*</code> | <code></code> | The name of the registry package to fetch. If this is not provided, this method will return a list of everything in the registry. |
| version | <code>\*</code> | <code></code> | The version of the registry package to fetch. If this is not provided, this method will always return the latest version.         |

<a name="ServerlessSDK+generateInstanceId"></a>

### serverlessSDK.generateInstanceId(orgUid, stageName, appUid, instanceName) ⇒ <code>object</code>

Returns a properly formatted ID for an Instance

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns a properly formatted ID for an Instance

| Param        | Type            | Description                                      |
| ------------ | --------------- | ------------------------------------------------ |
| orgUid       | <code>\*</code> | The Uid of the Serverless Platform Organization. |
| stageName    | <code>\*</code> | The name of the Serverless Platform Stage.       |
| appUid       | <code>\*</code> | The Uid of the Serverless Platform Application.  |
| instanceName | <code>\*</code> | The name of the Serverless Platform Instance.    |

<a name="ServerlessSDK+validateInstance"></a>

### serverlessSDK.validateInstance(instanceToValidate) ⇒ <code>object</code>

Validates the properties of an Instance, as well as auto-corrects shortened syntax (e.g. org => orgName)

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns a validated, formatted version of the Instance

| Param              | Type            | Description                                            |
| ------------------ | --------------- | ------------------------------------------------------ |
| instanceToValidate | <code>\*</code> | The Serverless Platform Instance you want to validate. |

<a name="ServerlessSDK+createInstance"></a>

### serverlessSDK.createInstance(orgName, stageName, appName, instanceName, instanceStatus) ⇒ <code>object</code>

Returns a new Instance as a Javascript object.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
**Returns**: <code>object</code> - Returns a new Instance definition as a Javascript Object.

| Param          | Type            | Default               | Description                                       |
| -------------- | --------------- | --------------------- | ------------------------------------------------- |
| orgName        | <code>\*</code> | <code></code>         | The name of the Serverless Platform Organization. |
| stageName      | <code>\*</code> | <code></code>         | The name of the Serverless Platform Stage.        |
| appName        | <code>\*</code> | <code></code>         | The name of the Serverless Platform Application.  |
| instanceName   | <code>\*</code> | <code></code>         | The name of the Serverless Platform Instance.     |
| instanceStatus | <code>\*</code> | <code>inactive</code> | The status of the instance                        |

<a name="ServerlessSDK+saveInstance"></a>

### serverlessSDK.saveInstance(instanceRecord)

Saves an instance record, defined by createInstance

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param          | Type            |
| -------------- | --------------- |
| instanceRecord | <code>\*</code> |

<a name="ServerlessSDK+getInstance"></a>

### serverlessSDK.getInstance(orgName, stageName, appName, instanceName)

Get an Instance from the Serverless Platform by it's name and the names of its Organization, Stage, Application.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param        | Type            | Default       | Description                                       |
| ------------ | --------------- | ------------- | ------------------------------------------------- |
| orgName      | <code>\*</code> | <code></code> | The name of the Serverless Platform Organization. |
| stageName    | <code>\*</code> | <code></code> | The name of the Serverless Platform Stage.        |
| appName      | <code>\*</code> | <code></code> | The name of the Serverless Platform Application.  |
| instanceName | <code>\*</code> | <code></code> | The name of the Serverless Platform Instance.     |

<a name="ServerlessSDK+listInstances"></a>

### serverlessSDK.listInstances(orgName, orgUid)

List all Component Instances within an Org, given an org name or org UId

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param   | Type            | Default       | Description                                      |
| ------- | --------------- | ------------- | ------------------------------------------------ |
| orgName | <code>\*</code> | <code></code> | Optional. Must include either orgName or orgUid. |
| orgUid  | <code>\*</code> |               | Optional. Must include either orgName or orgUid. |

<a name="ServerlessSDK+run"></a>

### serverlessSDK.run(action, instanceData, options)

Run an action on a Component Instance. Is an asynchronous call by default, but you can perform this synchronously if you set `options.sync`. Please note that synchronous runs have a 24 second timeout limit. That is not ideal for long operations, and is not recommended for deployments.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param        | Type            |
| ------------ | --------------- |
| action       | <code>\*</code> |
| instanceData | <code>\*</code> |
| options      | <code>\*</code> |

<a name="ServerlessSDK+runFinish"></a>

### serverlessSDK.runFinish(method, instanceData, meta)

Run Finish

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param        | Type                | Default           | Description                                      |
| ------------ | ------------------- | ----------------- | ------------------------------------------------ |
| method       | <code>string</code> | <code>null</code> | The Action that was performed on the Component.  |
| instanceData | <code>object</code> |                   | An object representing your Instance definition. |
| meta         | <code>object</code> |                   | Useful metadata about the Component Action.      |

<a name="ServerlessSDK+deploy"></a>

### serverlessSDK.deploy()

Performs a 'deploy' action and polls the 'getInstance' endpoint until its 'instanceStatus' reflects a successful deployment, or error.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
<a name="ServerlessSDK+remove"></a>

### serverlessSDK.remove()

Performs a 'remove' action and polls the 'getInstance' endpoint until its 'instanceStatus' reflects a successful deployment, or error.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
<a name="ServerlessSDK+startInterceptingLogs"></a>

### serverlessSDK.startInterceptingLogs(eventType, context)

Intercepts console 'log' 'debug' and 'error' methods, and sends their data to the Serverless Platform as an Event, before writing to stdout.

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)

| Param     | Type            | Default       | Description                                                                 |
| --------- | --------------- | ------------- | --------------------------------------------------------------------------- |
| eventType | <code>\*</code> | <code></code> | Optional. The event name used to publish logs. Defaults to "instance.logs". |
| context   | <code>\*</code> |               | Optional. Additional context added to the published log data.               |

<a name="ServerlessSDK+stopInterceptingLogs"></a>

### serverlessSDK.stopInterceptingLogs()

Stop intercepting console methods

**Kind**: instance method of [<code>ServerlessSDK</code>](#ServerlessSDK)  
<a name="onEvent"></a>

## onEvent : <code>function</code>

`onEvent` callback

**Kind**: global typedef

| Param | Type                | Description    |
| ----- | ------------------- | -------------- |
| event | <code>Object</code> | Incoming event |

<a name="onDisconnect"></a>

## onDisconnect : <code>function</code>

`onDisconnect` callback

**Kind**: global typedef

| Param      | Type                | Description                                                                         |
| ---------- | ------------------- | ----------------------------------------------------------------------------------- |
| closeEvent | <code>Object</code> | Websocket [CloseEvent](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) |

## Publishing the SDK

Before publishing the SDK, be sure to run the pre-publish script, which browserifies the code and updates its documentation, by running: `npm run pre-publish` within the `sdk` folder.

---

&copy; Serverless Inc.
