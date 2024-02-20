'use strict';

/**
 * SERVERLESS PLATFORM CLIENT SDK: UTILS
 */

const Axios = require('axios');
const traverse = require('traverse');
const minimatch = require('minimatch');

const utils = {};

/**
 * Wait for a number of miliseconds
 * @param {*} wait
 */
const sleep = async (wait) => new Promise((resolve) => setTimeout(() => resolve(), wait));

/**
 * Make HTTP API requests, easily
 * @param {*} options.endpoint
 * @param {*} options.data
 * @param {*} options.accessKey
 * @param {*} options.method
 */
const request = async (options) => {
  const requestOptions = {
    url: options.endpoint,
    method: options.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options.data,
  };

  if (options.accessKey) {
    requestOptions.headers.authorization = `Bearer ${options.accessKey}`;
  }

  if (options.headers) {
    requestOptions.headers = { ...requestOptions.headers, ...options.headers };
  }
  try {
    const axios = Axios.create();
    const res = await axios(requestOptions);
    return res.data;
  } catch (error) {
    // Add useful details if they are included in the HTTP response
    if (error.response && error.response.data) {
      const data = error.response.data;
      let message;
      let name;
      if (data.message) {
        ({ message } = data);
        name = data.name || null;
      } else if (data.errorMessage) {
        name = 'Error'; // enterprise backend doesn't return error names
        message = data.errorMessage;
      } else if (data.errors && data.errors.length) {
        // Join error messages
        message = data.errors.map((e) => e.message).join(', ');
        name = data.errors.map((e) => e.name).join(', ');
      }
      const err = new Error(message);
      err.statusCode = data.statusCode || error.response.status || null;
      err.name = name;
      err.details = data.details || null;
      err.url = error.response.config.url || null;
      throw err;
    }

    // otherwise, throw the typical axios error
    throw error;
  }
};

/**
 * Resolves any variables that require resolving before the engine.
 * This currently supports only ${env}.  All others should be resolved within the deployment engine.
 * @param {*} inputs
 */
const resolveInputEnvVariables = (inputs) => {
  const regex = /\${(\w*:?[\w\d.-]+)}/g;
  let variableResolved = false;
  const resolvedInputs = traverse(inputs).forEach(function (value) {
    const matches = typeof value === 'string' ? value.match(regex) : null;
    if (matches) {
      let newValue = value;
      for (const match of matches) {
        // Search for ${env:}
        if (/\${env:(\w*[\w.-_]+)}/g.test(match)) {
          const referencedPropertyPath = match.substring(2, match.length - 1).split(':');
          newValue = process.env[referencedPropertyPath[1]];
          variableResolved = true;
        }
      }
      this.update(newValue);
    }
  });
  if (variableResolved) {
    return resolveInputEnvVariables(resolvedInputs);
  }
  return resolvedInputs;
};

// Add to utils object
utils.sleep = sleep;
utils.request = request;
utils.resolveInputEnvVariables = resolveInputEnvVariables;

/**
 *
 * Only load these Utilies when in a Node.js Environment
 *
 */

if (typeof window === 'undefined') {
  const crypto = require('crypto');
  const path = require('path');
  const fs = require('fs');
  const ignore = require('ignore');
  const AdmZip = require('adm-zip');
  const { parse } = require('url');
  const https = require('https');
  const HttpsProxyAgent = require('https-proxy-agent');
  const archiver = require('archiver');
  const throat = require('throat');
  const fg = require('fast-glob');
  const runParallelLimit = require('run-parallel-limit');

  const httpsAgent = new https.Agent({
    keepAlive: true,
  });
  // Create a new axios instance and make sure we clear the default axios headers
  // as they cause a mismatch with the signature provided by aws
  const axios = Axios.create({
    httpsAgent,
  });
  axios.defaults.headers.common = {};
  axios.defaults.headers.put = {};
  axios.defaults.headers.get = {};

  // make sure axios handles large packages
  const axiosConfig = {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  };

  const getAgent = () => {
    // Use HTTPS Proxy (Optional)
    const proxy =
      process.env.proxy ||
      process.env.HTTP_PROXY ||
      process.env.http_proxy ||
      process.env.HTTPS_PROXY ||
      process.env.https_proxy;

    const agentOptions = {};
    if (proxy) {
      // parse is deprecated, but see https://github.com/TooTallNate/node-https-proxy-agent/issues/117
      Object.assign(agentOptions, parse(proxy));
    }

    const ca = process.env.ca || process.env.HTTPS_CA || process.env.https_ca;

    let caCerts = [];

    if (ca) {
      // Can be a single certificate or multiple, comma separated.
      const caArr = ca.split(',');
      // Replace the newline -- https://stackoverflow.com/questions/30400341
      caCerts = caCerts.concat(caArr.map((cert) => cert.replace(/\\n/g, '\n')));
    }

    const cafile = process.env.cafile || process.env.HTTPS_CAFILE || process.env.https_cafile;

    if (cafile) {
      // Can be a single certificate file path or multiple paths, comma separated.
      const caPathArr = cafile.split(',');
      caCerts = caCerts.concat(caPathArr.map((cafilePath) => fs.readFileSync(cafilePath.trim())));
    }

    if (caCerts.length > 0) {
      Object.assign(agentOptions, {
        rejectUnauthorized: true,
        ca: caCerts,
      });
    }

    if (proxy) {
      return new HttpsProxyAgent(agentOptions);
    } else if (agentOptions.ca) {
      return new https.Agent(agentOptions);
    }
    return undefined;
  };

  const readFiles = async (input, exclude = []) => {
    const inputPath = path.resolve(input);
    const base = path.resolve(process.cwd(), input);
    const files = [];
    let totalSize = 0;

    const readDir = async (dir) => {
      const items = await fs.promises.readdir(dir);
      itemIteration: for (const item of items) {
        const itemPath = path.resolve(dir, item);
        const relativeItemPath = path.relative(base, itemPath);

        for (const excludeItem of exclude) {
          if (minimatch(relativeItemPath, excludeItem, { nocase: true, dot: true })) {
            continue itemIteration;
          }
        }

        const fsItem = await fs.promises.stat(itemPath);
        if (fsItem.isDirectory()) {
          await readDir(itemPath);
        } else {
          totalSize += fsItem.size;
          files.push({ path: relativeItemPath, mode: fsItem.mode });
        }
      }
    };

    await readDir(inputPath);

    return { files, totalSize };
  };

  /**
   * Resovles eventual gitIgnore filter function for provided servicePath
   *
   * @param {string} servicePath
   */
  const resolveGitignoreFilter = async (servicePath) => {
    const gitIgnoreContent = await (async () => {
      try {
        return await fs.promises.readFile(path.resolve(servicePath, '.gitignore'));
      } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
      }
    })();
    if (!gitIgnoreContent) return null;
    const ig = ignore().add(String(gitIgnoreContent).split(/[\r\n]+/));
    return (filePath) => !ig.ignores(filePath);
  };

  /**
   * Zip a file
   * @param {string} inputDirPath
   * @param {Object} data
   */
  const zip = async (
    inputDirPath,
    { outputFilePath, includeContent, exclude, shouldFilterByGitignore }
  ) => {
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const [{ files }, gitignoreFilter] = await Promise.all([
      readFiles(inputDirPath, exclude),
      shouldFilterByGitignore && resolveGitignoreFilter(inputDirPath),
    ]);

    function addFileToArchive(file) {
      return new Promise((resolve) => {
        if (gitignoreFilter && !gitignoreFilter(file.path)) return;
        // create a read stream from the file
        const stream = fs.createReadStream(path.resolve(inputDirPath, file.path));

        const mode = file.mode & 0o100 ? 0o755 : 0o644;

        // add the file stream to the zip
        archive.append(stream, {
          name: file.path,
          mode,
          date: new Date(0),
        });

        // close is also emitted on error, we trust that archive will emit an error below to fail the overall process
        stream.on('close', () => resolve());
      });
    }

    return new Promise((resolve, reject) => {
      // create a write stream for the zip file
      const output = fs.createWriteStream(outputFilePath);

      output.on('open', async () => {
        try {
          // pipe to the output stream
          archive.pipe(output);

          await Promise.all(files.map(throat(10, addFileToArchive)));

          // add files to include
          if (includeContent) {
            for (const file of includeContent) {
              archive.append(Buffer.alloc(file.fileContent.length, file.fileContent), {
                name: file.fileName,
                date: new Date(0),
              });
            }
          }

          // done packaging
          archive.finalize();
        } catch (err) {
          archive.destroy(err);
        }
      });

      // when packaging is done, return the output file path
      output.on('close', () => resolve(outputFilePath));

      // in case of errors, reject
      output.on('error', (err) => reject(err));
      archive.on('error', (err) => reject(err));
    });
  };

  /**
   * Unzip a zipped file
   * @param {*} zipPath
   */
  const unzip = async (inputZipPath, removeZip) => {
    const destPath = path.join('/tmp', Math.random().toString(36).substring(6));
    const unzipper = new AdmZip(inputZipPath);
    unzipper.extractAllTo(destPath, true);
    // Delete zip file to preserve space on AWS Lambda (it's limited to 250MB)
    if (removeZip) {
      fs.rmdirSync(inputZipPath);
    }
    return destPath;
  };

  /**
   * Checks whether a file exists
   * @param {*} filePath
   */
  const fileExistsSync = (filePath) => {
    try {
      const stats = fs.lstatSync(filePath);
      return stats.isFile();
    } catch (e) {
      return false;
    }
  };

  const getFilesToUpload = (map = {}, previousMap = {}, options) => {
    const filesToUpload = [];

    if (options.force) {
      return Object.keys(map);
    }

    Object.keys(map).forEach((filePath) => {
      if (!previousMap[filePath] || previousMap[filePath] !== map[filePath]) {
        filesToUpload.push(filePath);
      }
    });

    return filesToUpload;
  };

  const getFilesToDelete = (map = {}, previousMap = {}) => {
    const filesToDelete = [];

    Object.keys(previousMap).forEach((filePath) => {
      if (!map[filePath]) {
        filesToDelete.push(filePath);
      }
    });

    return filesToDelete;
  };

  const getPreviousMap = async (previousMapDownloadUrl) => {
    try {
      return (await axios.get(previousMapDownloadUrl, null, axiosConfig)).data;
    } catch (e) {
      return undefined;
    }
  };

  const preCache = async (sdk, { orgName, stageName, appName, instanceName }, options) => {
    // console.time('preCache');

    const res = await request({
      endpoint: `${sdk.getDomain('engine')}/preCache`,
      accessKey: sdk.accessKey,
      method: 'POST',
      data: { orgName, stageName, appName, instanceName },
    });

    if (!options.force) {
      res.previousMap = await getPreviousMap(res.previousMapDownloadUrl);
    }

    // console.timeEnd('preCache');

    return res;
  };

  const getFilesAndMap = async (inputs) => {
    // console.time('getFilesAndMap');
    const { srcOriginal } = inputs;
    const { src } = inputs;

    let exclude = [
      '.git',
      'package-lock.json',
      'node_modules/serverless',
      'node_modules/aws-sdk/**/*.d.ts',
      'node_modules/aws-sdk/**/*.examples.json',
      'node_modules/aws-sdk/**/*.md',
      'node_modules/aws-sdk/dist',
      'node_modules/aws-sdk/dist-tools',
      'node_modules/aws-sdk/scripts',
    ];

    if (typeof srcOriginal === 'object' && srcOriginal.exclude) {
      exclude = exclude.concat(srcOriginal.exclude);
    }

    const files = {};
    const map = {};

    let bytes = 0;

    // eslint-disable-next-line
    await new Promise(async (resolve, reject) => {
      const filesPaths = await fg('**/*', { cwd: src, ignore: exclude });
      const tasks = filesPaths.map((filePath) => {
        return (callback) => {
          const absoluteFilePath = path.resolve(src, filePath);

          fs.readFile(absoluteFilePath, (readErr, file) => {
            if (readErr) {
              callback(readErr);
              return;
            }

            // this fixes the following permissions issue:
            // https://github.com/serverless/components/issues/687
            fs.stat(absoluteFilePath, (statErr, stat) => {
              if (statErr) {
                callback(statErr);
                return;
              }

              bytes += stat.size;

              files[filePath] = {
                file,
                stat,
              };

              map[filePath] = crypto.createHash('md5').update(file).digest('hex');

              callback();
            });
          });
        };
      });

      runParallelLimit(tasks, 2048, (err) => {
        if (err) {
          reject(err);
        } else {
          // console.timeEnd('getFilesAndMap');
          resolve();
        }
      });
    });

    return { map, files, bytes };
  };

  const zipChanges = async (filesToUpload, filesToDelete, map, files) => {
    if (filesToUpload.length === 0 && filesToDelete.length === 0) {
      return null;
    }

    const archive = new AdmZip();

    if (filesToDelete.length !== 0) {
      const filesToDeleteContent = JSON.stringify(filesToDelete);
      archive.addFile(
        'deleted.files',
        Buffer.alloc(filesToDeleteContent.length, filesToDeleteContent)
      );
    }

    const mapContent = JSON.stringify(map);
    archive.addFile('src.map', Buffer.alloc(mapContent.length, mapContent));

    for (const filePath of filesToUpload) {
      const mode = files[filePath].stat.mode & 0o100 ? 0o755 : 0o644;
      archive.addFile(filePath, files[filePath].file, null, mode);
    }

    return archive.toBuffer();
  };

  const cache = async (sdk, instance, options) => {
    const [{ map, files, bytes }, { previousMap, changesUploadUrl, srcDownloadUrl }] =
      await Promise.all([getFilesAndMap(instance.inputs), preCache(sdk, instance, options)]);

    const filesToUpload = getFilesToUpload(map, previousMap, options);
    const filesToDelete = getFilesToDelete(map, previousMap, options);

    if (filesToUpload.length !== 0 || filesToDelete.length !== 0) {
      options.cacheOutdated = true;

      const zipBuffer = await zipChanges(filesToUpload, filesToDelete, map, files);

      await axios.put(changesUploadUrl, zipBuffer, axiosConfig);
    } else {
      options.cacheOutdated = false;
    }

    return { srcDownloadUrl, bytes };
  };

  // Add to utils object
  utils.getAgent = getAgent;
  utils.zip = zip;
  utils.unzip = unzip;
  utils.fileExistsSync = fileExistsSync;
  utils.cache = cache;
}

// Export
module.exports = utils;
