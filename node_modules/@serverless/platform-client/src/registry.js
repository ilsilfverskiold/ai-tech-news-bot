'use strict';

/*
 * SERVERLESS PLATFORM SDK: REGISTRY
 */

const path = require('path');
const fs = require('fs');
const { tmpdir } = require('os');
const axios = require('axios');
const utils = require('./utils');

/**
 * Validates and (re)formats the package properties
 */
const validateAndFormat = (registryPackageRaw) => {
  // Copy input object, otherwise the inputter will have unintended data modifications
  const registryPackage = Object.assign({}, registryPackageRaw);

  if (!registryPackage.name) {
    throw new Error("The 'name' property is required");
  }

  if (!registryPackage.version) {
    throw new Error("The 'version' property is required");
  }

  // Ensure "dev" version uses correct syntax
  if (registryPackage.version === 'dev') {
    registryPackage.version = '0.0.0-dev';
  }

  // Format Helper - If shortened properties are used, replace them with full properties
  if (registryPackage.org) {
    registryPackage.orgName = registryPackage.org;
    delete registryPackage.org;
  }

  if (!registryPackage.orgName) {
    throw new Error("'orgName' is required");
  }
  if (!registryPackage.src) {
    throw new Error("'src' is required");
  }
  if (!registryPackage.type) {
    throw new Error("'type' is required");
  }

  // Validate and format Provider & Action Types
  if (registryPackage.providers) {
    registryPackage.types = registryPackage.types || {};
    registryPackage.types.providers = registryPackage.providers;
    delete registryPackage.providers;
  }
  if (registryPackage.actions) {
    registryPackage.types = registryPackage.types || {};
    registryPackage.types.actions = registryPackage.actions;
    delete registryPackage.actions;
  }

  return registryPackage;
};

const omit = (content, propsToOmit = []) => {
  for (const prop of propsToOmit) {
    const omitRegex = new RegExp(`^${prop}\\s*:\\s+.*$`, 'm');
    content = content.replace(omitRegex, () => '');
  }

  // remove extra blank lines
  return content.replace(/(\r\n|\r|\n){2,}/g, '$1\n');
};

/*
 * Returns a serverless config file from the given dir
 */
const getConfigFile = async (directoryPath, propsToOmit) => {
  const directoryName = path.basename(directoryPath);
  directoryPath = path.resolve(directoryPath);

  const ymlFilePath = path.join(directoryPath, 'serverless.yml');
  const yamlFilePath = path.join(directoryPath, 'serverless.yaml');
  const jsonFilePath = path.join(directoryPath, 'serverless.json');
  let filePath;

  // Check to see if exists and is yaml or json file
  if (utils.fileExistsSync(ymlFilePath)) {
    filePath = ymlFilePath;
  }
  if (utils.fileExistsSync(yamlFilePath)) {
    filePath = yamlFilePath;
  }
  if (utils.fileExistsSync(jsonFilePath)) {
    filePath = jsonFilePath;
  }
  if (!filePath) {
    return null;
  }

  const fileName = path.join(directoryName, path.basename(filePath));
  const fileContent = await fs.promises.readFile(filePath, 'utf-8');

  const configFile = {};
  configFile.fileName = fileName;
  configFile.fileContent = omit(fileContent, propsToOmit);

  return configFile;
};

const isDirectory = (fileOrDirPath) => {
  return fs.statSync(fileOrDirPath).isDirectory();
};

/*
 * Returns a list of serverless config files found in the given dir
 */
const getConfigFiles = async (root) => {
  const configFilesPromises = [];

  // list of properties we want to omit from config files
  const propsToOmit = [
    'org',
    'app',
    'service',
    'stage',
    'description',
    'keywords',
    'repo',
    'license',
    'service',
  ];

  const filesOrDirNames = await fs.promises.readdir(root);

  for (const fileOrDirName of filesOrDirNames) {
    const fileOrDirPath = path.join(root, fileOrDirName);

    // ignore hidden directories and files
    if (!fileOrDirName.startsWith('.') && isDirectory(fileOrDirPath)) {
      // find a config file in each directory
      configFilesPromises.push(getConfigFile(fileOrDirPath, propsToOmit));
    }
  }

  const configFiles = (await Promise.all(configFilesPromises)).filter((file) => file !== null);

  // get the root config file
  const rootConfigFile = await getConfigFile(root, propsToOmit);

  // if found
  if (rootConfigFile) {
    // make sure the fileName property is not an absolute path
    // otherwise that would break the zip
    rootConfigFile.fileName = path.basename(rootConfigFile.fileName);

    if (configFiles.length !== 0) {
      // if more than 1 config files found in given directory
      // then it's a nested template and we shouldnt include the root config file
      rootConfigFile.doNotInclude = true;
    }

    configFiles.push(rootConfigFile);
  }

  return configFiles;
};

/*
 * Zips a package for publishing
 */
const zipPackage = async (registryPackage) => {
  // Get Registry path and temporary path for packaging
  const outputFilePath = path.join(tmpdir(), `${Math.random().toString(36).substring(6)}.zip`);

  let includeContent = [];
  let exclude = [];
  if (registryPackage.type === 'component') {
    // If packaging component, add the special "handler.js"
    includeContent.push({
      fileName: '_handler.js',
      fileContent:
        "const { handler } = require('@serverless/core');module.exports.handler = handler;",
    });
  } else {
    // if publishing template, exclude template file, node_modules and any .env files.
    exclude.push('**/serverless.template.yml');
    exclude.push('**/node_modules/**');
    exclude.push('**/.env');
    exclude.push('**/.env.*');
    exclude.push('**/.git/**');
  }

  // get a list of all the config files in the src (ie. serverless.yml)
  const configFiles = await getConfigFiles(registryPackage.src);

  // get a list of config files to include in the zip
  const configFilesToInclude = configFiles.filter(
    (packageConfigFile) => !packageConfigFile.doNotInclude
  );

  // include them...
  includeContent = includeContent.concat(configFilesToInclude);

  // get a list of config files to exclude from the zip
  const configFilesToExclude = configFiles.map((packageConfigFile) => packageConfigFile.fileName);

  // exclude them...
  exclude = exclude.concat(configFilesToExclude);

  await utils.zip(registryPackage.src, {
    outputFilePath,
    exclude,
    includeContent,
    shouldFilterByGitignore: registryPackage.type === 'template',
  });

  return outputFilePath;
};

/**
 * Publish to the Registry
 */
const publish = async (sdk, registryPackage) => {
  // Validate
  registryPackage = validateAndFormat(registryPackage);

  // Pre-Publish gets a pre-signed URL for upload and a bucket key
  const preResponse = await utils.request({
    endpoint: `${sdk.getDomain('registry')}/packages/prePublish`,
    accessKey: sdk.accessKey,
    method: 'POST',
    data: registryPackage,
  });

  const { packageUploadUrl, packageKey } = preResponse;

  const registryPackagePath = await zipPackage(registryPackage);

  // Axios auto-adds headers that causes signature mismatch
  // So we remove them manually
  const request = axios.create();
  request.defaults.headers.common = {};
  request.defaults.headers.put = {};
  const file = fs.readFileSync(registryPackagePath);

  // Make sure axios handles large packages
  const config = {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  };

  // Upload
  await request.put(packageUploadUrl, file, config);

  // Post-Publish sends a bucket key to finalize publishing and create a lambda funnction if applicable
  return utils.request({
    endpoint: `${sdk.getDomain('registry')}/packages/postPublish`,
    accessKey: sdk.accessKey,
    method: 'POST',
    data: {
      orgName: registryPackage.orgName,
      packageKey,
    },
  });
};

/**
 * Unpublish a package from the Registry
 */
const unpublish = async (sdk, { name, version, org }) => {
  const endpoint = `${sdk.getDomain('registry')}/packages/${name}/${version}`;
  // Validate

  // Pre-Publish gets a pre-signed URL for upload and a bucket key
  return utils.request({
    endpoint,
    accessKey: sdk.accessKey,
    method: 'DELETE',
    headers: {
      org,
    },
  });
};

/**
 * Fetches a package from the Registry
 */
const get = async (sdk, name, version) => {
  let endpoint = `${sdk.getDomain('registry')}/packages`;

  if (name) {
    endpoint = `${endpoint}/${name}`;
  }

  if (version) {
    endpoint = `${endpoint}/${version}`;
  }

  const data = await utils.request({
    accessKey: sdk.accessKey,
    endpoint,
    method: 'GET',
  });

  // exclude these properties from the response,
  // which is returned only for backward compatability
  // newer clients (using this version of the sdk)
  // should ignore these properties
  delete data.componentName;
  delete data.component;
  delete data.componentDefinition;

  // remove versioning props in case of templates
  if (data.type === 'template') {
    delete data.version;
    delete data.versions;
  }

  return data;
};

module.exports = {
  get,
  publish,
  unpublish,
};
