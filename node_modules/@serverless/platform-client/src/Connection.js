'use strict';
const utils = require('./utils');

/**
 * Connection
 * NOTICE: This code has been turned into no-op code,
 * due to depracation of this websockets endpoint.
 * It now only fetches a new Provider, if recently created.
 */

class Connection {
  constructor(sdk) {
    this.sdk = sdk;
    this.connection = null;
    this.context = {};
  }

  isConnected() {
    return !!this.connection;
  }

  /**
   * Polls the Providers List endpoint until a new Provider is created
   */
  async connect({ orgUid, onEvent }) {
    if (!orgUid) {
      throw new Error('You must specify an "orgUid" to connect');
    }

    if (orgUid) {
      this.sdk.context.orgUid = orgUid;
    }

    // This function calls the Providers List endpoint
    const listProviders = async ({ orgUid, accessKey }) => {
      // Get Providers domain based on the stage
      let domain = this.sdk.getDomain('providers');

      const providers = await utils.request({
        endpoint: `${domain}/orgs/${orgUid}/providers`,
        method: 'GET',
        accessKey,
      });
      return providers.result;
    };

    // Poll  Providers and determine if a new Provider was created
    // Timeout after 15 minutes
    const pollProviders = async ({ orgUid, accessKey, initialProviders, startTime }) => {
      startTime = startTime || Date.now();
      // Check if we have timed out
      if (Date.now() - startTime > 900000) {
        throw new Error('Timeout: Could not find provider');
      }
      let interval = 5000;
      let providers = await listProviders({
        orgUid,
        accessKey,
      });

      // Check if a new Provider was created
      if (providers.length > initialProviders.length) {
        // Get the new Provider
        let newProvider = providers.find((provider) => {
          return !initialProviders.find((p) => p.providerUid === provider.providerUid);
        });
        return newProvider;
      }
      // Sleep via promise for 5 seconds
      await new Promise((resolve) => setTimeout(resolve, interval));
      return pollProviders({
        orgUid,
        accessKey,
        initialProviders,
        startTime,
      });
    };

    // List the Providers initially, to determine what exists already
    let initialProviders = await listProviders({
      orgUid: orgUid,
      accessKey: this.sdk.accessKey,
    });

    // Poll Providers until a new Provider is created
    let provider = await pollProviders({
      orgUid,
      accessKey: this.sdk.accessKey,
      initialProviders,
    });

    // Handle message event
    if (onEvent) {
      return onEvent(provider);
    }
  }

  /**
   * Sends data up to the websocket connection
   * @param {*} data
   */
  send(data) {}

  /**
   * Terminates the websockets connection
   */
  disconnect(code) {
    this.connection = null;
  }
}

module.exports = Connection;
