'use strict';

const path = require('path');
const os = require('os');
const crypto = require('crypto');
const spawn = require('child-process-ext/spawn');
const { ensureDir, ensureSymlink, writeJson, realpath, removeSync } = require('fs-extra');
const fetch = require('node-fetch');
const tar = require('tar');
const memoizee = require('memoizee');
const log = require('log').get('test');

const tmpDir = os.tmpdir();

const ignoreIfDoesntExist = (error) => {
  if (error.code !== 'ENOENT') throw error;
  return null;
};

module.exports = memoizee(
  (options = {}) => {
    const serverlessTmpDir = path.join(
      tmpDir,
      `serverless-dashboard-plugin-test-serverless-${crypto.randomBytes(2).toString('hex')}`
    );

    if (process.env.LOCAL_SERVERLESS_LINK_PATH) {
      // Test against local serverless installation which is expected to have
      // this instance of `@serverless/dashboard-plugin` linked in its node_modules
      const serverlessPath = path.resolve(
        __dirname,
        '../..',
        process.env.LOCAL_SERVERLESS_LINK_PATH
      );
      return Promise.all([
        realpath(path.join(__dirname, '../..')),
        realpath(path.join(serverlessPath, 'node_modules/@serverless/dashboard-plugin')).catch(
          ignoreIfDoesntExist
        ),
      ]).then(([pluginPath, serverlessPluginPath]) => {
        if (!serverlessPluginPath || pluginPath !== serverlessPluginPath) {
          throw new Error(
            `LOCAL_SERVERLESS_LINK_PATH which resolves to ${serverlessPath}, doesn't point a ` +
              'serverless installation which links this installation of a plugin'
          );
        }
        log.notice(`Rely on 'serverless' at ${serverlessPath}`);
        return {
          root: serverlessPath,
          binary: path.join(serverlessPath, 'bin/serverless.js'),
          version: require(path.join(serverlessPath, 'package.json')).version,
          plugin: pluginPath,
        };
      });
    }

    log.notice(`Setup 'serverless' at ${serverlessTmpDir}`);
    return ensureDir(serverlessTmpDir)
      .then(() => {
        if (!options.shouldKeepServerlessDir) {
          process.on('exit', () => {
            try {
              removeSync(serverlessTmpDir);
            } catch (error) {
              // Safe to ignore
            }
          });
        }

        log.debug('... fetch tarball');
        return fetch('https://github.com/serverless/serverless/archive/main.tar.gz');
      })
      .then((res) => {
        const tarDeferred = tar.x({ cwd: serverlessTmpDir, strip: 1 });
        res.body.pipe(tarDeferred);
        return new Promise((resolve, reject) => {
          res.body.on('error', reject);
          tarDeferred.on('error', reject);
          tarDeferred.on('finish', resolve);
        });
      })
      .then(() => {
        log.debug('... patch serverless/package.json');
        const pkgJsonPath = `${serverlessTmpDir}/package.json`;
        const pkgJson = require(pkgJsonPath);
        // Do not npm install @serverless/dashboard-plugin
        // (local installation will be linked in further steps)
        delete pkgJson.dependencies['@serverless/dashboard-plugin'];
        // Prevent any postinstall setup (stats requests, automcomplete setup, logs etc.)
        delete pkgJson.scripts.postinstall;
        return writeJson(pkgJsonPath, pkgJson);
      })
      .then(() => {
        return spawn('npm', ['install', '--production'], { cwd: serverlessTmpDir });
      })
      .then(() => {
        log.debug('... link @serverless/dashboard-plugin dependency');
        return ensureSymlink(
          path.join(__dirname, '../../'),
          path.join(serverlessTmpDir, 'node_modules/@serverless/dashboard-plugin'),
          'junction'
        );
      })
      .then(() => {
        return realpath(path.join(serverlessTmpDir, 'node_modules/@serverless/dashboard-plugin'));
      })
      .then((pluginPath) => {
        return {
          root: serverlessTmpDir,
          binary: path.join(serverlessTmpDir, 'bin/serverless.js'),
          version: require(`${serverlessTmpDir}/package`).version,
          plugin: pluginPath,
        };
      });
  },
  { promise: true }
);
