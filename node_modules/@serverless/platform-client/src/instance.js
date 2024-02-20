'use strict';

/*
 * SERVERLESS PLATFORM SDK: INSTANCE
 */

const path = require('path');
const exec = require('child_process').exec;
const utils = require('./utils');

/**
 * Correctly formats an instanceId
 * @param {*} orgUid
 * @param {*} stageName
 * @param {*} appUid
 * @param {*} instanceName
 */
const generateId = (orgUid, stageName, appUid, instanceName) => {
  // Validate
  if (!orgUid || !stageName || !appUid || !instanceName) {
    throw new Error("'orgUid' 'stageName' 'appUid' and 'instanceName' are required");
  }
  return `${orgUid}.${stageName}.${appUid}.${instanceName}`;
};

/**
 * Create a new Instance
 * @param {*} orgName
 * @param {*} stageName
 * @param {*} appName
 * @param {*} instanceName
 * @param {*} instanceStatus
 */
const create = (
  orgName = null,
  stageName = null,
  appName = null,
  instanceName = null,
  instanceStatus = 'inactive'
) => {
  // Validate
  if (!orgName || !stageName || !appName || !instanceName) {
    throw new Error("'orgName' 'stageName' 'appName' and 'instanceName' are required");
  }

  // Instance
  const instance = {};
  instance.orgName = orgName;
  instance.appName = appName;
  instance.stageName = stageName;
  instance.instanceName = instanceName;
  instance.componentName = null;
  instance.componentVersion = null;
  instance.inputs = {};
  instance.outputs = {};
  instance.state = {};
  instance.description = null;
  // Status
  instance.instanceStatus = instanceStatus;
  instance.deploymentError = null;
  instance.deploymentErrorStack = null;
  instance.lastAction = null;
  // Dates
  instance.createdAt = Date.now();
  instance.updatedAt = Date.now();
  instance.lastDeployedAt = null;
  instance.lastActionAt = null;
  // Metrics
  instance.instanceMetrics = {};
  instance.instanceMetrics.actions = 0;
  instance.instanceMetrics.deployments = 0;
  instance.instanceMetrics.removes = 0;
  instance.instanceMetrics.errors = 0;

  return instance;
};

/**
 * Validates and (re)formats the component instance properties
 */
const validateAndFormat = (rawInstance) => {
  // Copy input object, otherwise the inputter will have unintended data modifications
  const instance = JSON.parse(JSON.stringify(rawInstance));

  // Format Helper - If shortened properties are used, replace them with full properties
  if (instance.org) {
    instance.orgName = instance.org;
    delete instance.org;
  }
  if (instance.stage) {
    instance.stageName = instance.stage;
    delete instance.stage;
  }
  if (instance.app) {
    instance.appName = instance.app;
    delete instance.app;
  }
  if (instance.name) {
    instance.instanceName = instance.name;
    delete instance.name;
  }

  // Ensure all required properties exist
  if (!instance.orgName || !instance.stageName || !instance.appName || !instance.instanceName) {
    throw new Error("'orgName' 'stageName' 'appName' and 'instanceName' are required");
  }

  // Format - If shortened component syntax is used, expand into full syntax
  if (instance.component) {
    instance.componentName = instance.component.includes('@')
      ? instance.component.split('@')[0]
      : instance.component;
    instance.componentVersion = instance.component.includes('@')
      ? instance.component.split('@')[1]
      : '';
    delete instance.component;
  }

  // Ensure all required component properties exist
  if (!instance.componentName) {
    throw new Error("'componentName' is required");
  }

  // Ensure an inputs object exists
  if (!instance.inputs) {
    instance.inputs = {};
  }

  return instance;
};

/**
 * Create or update an Instance
 */
const save = async (sdk, instance = {}) => {
  // Validate
  instance = validateAndFormat(instance);

  // Send request
  return utils.request({
    endpoint: `${sdk.getDomain('engine')}/saveInstance`,
    accessKey: sdk.accessKey,
    method: 'POST',
    data: {
      instance,
    },
  });
};

/**
 * Get an Instance record by name
 */
const getByName = async (
  sdk,
  orgName = null,
  stageName = null,
  appName = null,
  instanceName = null
) => {
  return utils.request({
    endpoint: `${sdk.getDomain('engine')}/getInstance`,
    accessKey: sdk.accessKey,
    method: 'POST',
    data: {
      orgName,
      appName,
      stageName,
      instanceName,
    },
  });
};

/**
 * List Instance records by Org
 */
const listByOrgName = async (sdk, orgName = null, orgUid = null) => {
  return utils.request({
    endpoint: `${sdk.getDomain('engine')}/listInstances`,
    accessKey: sdk.accessKey,
    method: 'POST',
    data: {
      orgName,
      orgUid,
    },
  });
};

/*
 * Run a "src" hook, if one is specified
 */
const preRunSrcHook = async (src) => {
  if (typeof src === 'object' && src.hook && src.dist) {
    // First run the build hook, if "hook" and "dist" are specified
    const options = { cwd: src.src, env: src.env };

    return new Promise((resolve, reject) => {
      exec(src.hook, options, (err) => {
        if (err) {
          return reject(
            new Error(
              `Failed running "src.hook": "${src.hook}" due to the following error: ${err.message}`
            )
          );
        }
        return resolve(src.dist);
      });
    });
  } else if (typeof src === 'object' && src.src) {
    src = path.resolve(src.src);
  } else if (typeof src === 'string') {
    src = path.resolve(src);
  }
  return src;
};

/**
 * Run a method. "inputs" override serverless.yml inputs and should only be provided when using custom methods.
 */
const run = async (sdk, method = {}, instanceData = {}, options = {}) => {
  let instance = JSON.parse(JSON.stringify(instanceData));

  // Validate method
  if (!method) {
    throw new Error('A "method" argument is required');
  }

  // Validate instance
  instance = validateAndFormat(instanceData);

  // Run source hook and upload source, if "src" input is used...
  let size;
  if (instance.inputs.src) {
    let p = instance.inputs.src;
    if (typeof p !== 'string' && p.dist) {
      p = p.dist;
    } else if (typeof p !== 'string' && p.src) {
      p = p.src;
    }

    // Save original src to present neatly in Dashboard/clients, or this will be replaced by the S3 location by the functions below
    if (instance.inputs.src) {
      instance.inputs.srcOriginal = JSON.parse(JSON.stringify(instance.inputs.src));
    }

    // Process source code, or skip if not provided...
    instance.inputs.src = await preRunSrcHook(instance.inputs.src);

    // this should eventually move to the CLI
    if (process.argv.includes('--force')) {
      options.force = true;
    }

    const { srcDownloadUrl, bytes } = await utils.cache(sdk, instance, options);

    if (bytes > 200000000) {
      throw new Error(
        'Your code size must be less than 200MB.  Try using Webpack, Parcel, or AWS Lambda layers to reduce your code size.'
      );
    }

    instance.inputs.src = srcDownloadUrl;
    size = bytes;
  }

  return utils.request({
    endpoint: `${sdk.getDomain('engine')}/run`,
    accessKey: sdk.accessKey,
    method: 'POST',
    data: {
      method,
      instance,
      options,
      size,
    },
  });
};

/**
 * Finish a run
 */
const runFinish = async (sdk, method = null, instance = {}, meta = {}) => {
  return utils.request({
    endpoint: `${sdk.getDomain('engine')}/runFinish`,
    accessKey: sdk.accessKey,
    method: 'POST',
    data: {
      method,
      instance,
      meta,
    },
  });
};

/**
 * Run a deployment
 * @param {object} instance The Instance definition.
 * @param {object} options Any options you wish to supply the Instance method.
 * @param {number} size The size in bytes of the source code, so that the Instance method can validate it beforehand.
 */
const deploy = async (sdk, instance, options) => {
  // Set defaults
  options.timeout = options.timeout || 240000; // 240000 = 4 minutes
  options.interval = options.interval || 500;

  // Set timer
  const startedAt = Date.now();

  // Perform Run
  await run(sdk, 'deploy', instance, options);

  // Set up polling
  // Poll function calls the instance constantly to check its status
  const poll = async () => {
    // Check if timed out
    if (Date.now() - options.timeout > startedAt) {
      throw new Error(`Request timed out after ${options.timeout / 60000} minutes`);
    }

    // Fetch instance
    let instanceRecord = await getByName(
      sdk,
      instance.orgName || instance.org,
      instance.stageName || instance.stage,
      instance.appName || instance.app,
      instance.instanceName || instance.name
    );
    instanceRecord = instanceRecord.instance;

    // Sleep before calling again
    if (instanceRecord.instanceStatus === 'active') {
      return instanceRecord;
    } else if (instanceRecord.instanceStatus === 'error') {
      const error = new Error(instanceRecord.deploymentError);
      error.stack = instanceRecord.deploymentErrorStack;
      throw error;
    }
    await utils.sleep(options.interval);
    return poll();
  };

  return poll();
};

/**
 * Run a removal
 * @param {object} instance The Instance definition.
 * @param {object} options Any options you wish to supply the Instance method.
 * @param {number} size The size in bytes of the source code, so that the Instance method can validate it beforehand.
 */
const remove = async (sdk, instance, options) => {
  // Set defaults
  options.timeout = options.timeout || 60000;
  options.interval = options.interval || 500;

  // Set timer
  const startedAt = Date.now();

  // Perform Run
  await run(sdk, 'remove', instance, options);

  // Set up polling
  // Poll function calls the instance constantly to check its status
  const poll = async () => {
    // Check if timed out
    if (Date.now() - options.timeout > startedAt) {
      throw new Error(`Request timed out after ${options.timeout / 1000} seconds`);
    }

    // Fetch instance
    let instanceRecord = await getByName(
      sdk,
      instance.orgName || instance.org,
      instance.stageName || instance.stage,
      instance.appName || instance.app,
      instance.instanceName || instance.name
    );
    instanceRecord = instanceRecord.instance;

    // Sleep before calling again
    if (instanceRecord.instanceStatus === 'inactive') {
      return instanceRecord;
    } else if (instanceRecord.instanceStatus === 'error') {
      const error = new Error(instanceRecord.deploymentError);
      error.stack = instanceRecord.deploymentErrorStack;
      throw error;
    }
    await utils.sleep(options.interval);
    return poll();
  };

  return poll();
};

module.exports = {
  generateId,
  validateAndFormat,
  create,
  save,
  getByName,
  listByOrgName,
  run,
  runFinish,
  deploy,
  remove,
};
