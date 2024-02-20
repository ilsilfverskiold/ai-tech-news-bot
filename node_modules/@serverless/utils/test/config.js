'use strict';

const chai = require('chai');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const os = require('os');

chai.use(require('chai-as-promised'));
const expect = require('chai').expect;

describe('config', () => {
  it('should have CONFIG_FILE_NAME', () => {
    const configFilename = config.CONFIG_FILE_NAME;
    expect(configFilename).to.exist;
  });

  describe('for both global config in homedir and in ~/.config existing', () => {
    const homeConfigGlobalConfig = {
      trackingDisabled: true,
    };
    const defaultGlobalConfig = {
      trackingDisabled: false,
      enterpriseDisabled: true,
    };
    let homeConfigGlobalConfigPath;
    let defaultGlobalConfigPath;
    let configFileDir;

    before(async () => {
      await fs.promises.mkdir('local');
      process.chdir('local');
      configFileDir = path.join(os.homedir(), '.config');
      await fs.promises.mkdir(configFileDir);
      homeConfigGlobalConfigPath = path.join(configFileDir, config.CONFIG_FILE_NAME);
      defaultGlobalConfigPath = path.join(os.homedir(), config.CONFIG_FILE_NAME);
      await Promise.all([
        fs.promises.writeFile(
          homeConfigGlobalConfigPath,
          JSON.stringify(homeConfigGlobalConfig, null, 2)
        ),
        fs.promises.writeFile(
          defaultGlobalConfigPath,
          JSON.stringify(defaultGlobalConfig, null, 2)
        ),
      ]);
    });

    after(async () => {
      await Promise.all([
        fs.promises.unlink(homeConfigGlobalConfigPath),
        fs.promises.unlink(defaultGlobalConfigPath),
      ]);
      await fs.promises.rmdir(configFileDir);
      process.chdir(os.homedir());
      await fs.promises.rmdir(path.join(os.homedir(), 'local'));
    });

    it('should use only default global config', () => {
      const result = config.getConfig();

      expect(result).to.deep.equal(defaultGlobalConfig);
    });
  });

  describe('for both local and global config in homedir existing', () => {
    const localConfig = {
      trackingDisabled: true,
    };
    const globalConfig = {
      trackingDisabled: false,
      enterpriseDisabled: true,
    };
    let localConfigPath;
    let globalConfigPath;

    before(async () => {
      await fs.promises.mkdir('local');
      process.chdir('local');
      localConfigPath = path.join(process.cwd(), config.CONFIG_FILE_NAME);
      globalConfigPath = path.join(os.homedir(), config.CONFIG_FILE_NAME);
      await Promise.all([
        fs.promises.writeFile(localConfigPath, JSON.stringify(localConfig, null, 2)),
        fs.promises.writeFile(globalConfigPath, JSON.stringify(globalConfig, null, 2)),
      ]);
    });

    after(async () => {
      await Promise.all([
        fs.promises.unlink(localConfigPath),
        fs.promises.unlink(globalConfigPath),
      ]);
      process.chdir(os.homedir());
      await fs.promises.rmdir(path.join(os.homedir(), 'local'));
    });

    it('should return merged config', () => {
      const result = config.getConfig();

      expect(result).to.deep.equal({
        trackingDisabled: true,
        enterpriseDisabled: true,
      });
    });

    it('should include values from global config file', () => {
      const result = config.get('enterpriseDisabled');
      expect(result).to.be.true;
    });

    it('should prefer values from local over global config', () => {
      const result = config.get('trackingDisabled');
      expect(result).to.be.true;
    });

    it('should not have a value that does not exist in both configs ', () => {
      const result = config.get('nonexistentKey');
      expect(result).to.be.undefined;
    });

    it('when setting a new value, it should update only local config', async () => {
      config.set('newKey', 'somevalue');
      const localConfigContent = await fs.promises.readFile(localConfigPath, 'utf-8');
      expect(JSON.parse(localConfigContent).newKey).to.equal('somevalue');
      const globalConfigContent = await fs.promises.readFile(globalConfigPath, 'utf-8');
      expect(JSON.parse(globalConfigContent)).to.not.have.property('newKey');
    });

    it('when deleting a value, it should update only local config', async () => {
      config.delete('trackingDisabled');
      const localConfigContent = await fs.promises.readFile(localConfigPath, 'utf-8');
      expect(JSON.parse(localConfigContent)).to.not.have.property('trackingDisabled');
      const globalConfigContent = await fs.promises.readFile(globalConfigPath, 'utf-8');
      expect(JSON.parse(globalConfigContent)).to.have.property('trackingDisabled');
    });
  });

  describe('for only local config existing beforehand', () => {
    const localConfig = {
      trackingDisabled: true,
    };
    let localConfigPath;
    let globalConfigPath;

    before(async () => {
      await fs.promises.mkdir('local');
      process.chdir('local');
      localConfigPath = path.join(process.cwd(), config.CONFIG_FILE_NAME);
      await fs.promises.writeFile(localConfigPath, JSON.stringify(localConfig, null, 2));
      globalConfigPath = path.join(os.homedir(), config.CONFIG_FILE_NAME);
    });

    after(async () => {
      await Promise.all([
        fs.promises.unlink(localConfigPath),
        fs.promises.unlink(globalConfigPath),
      ]);
      process.chdir(os.homedir());
      await fs.promises.rmdir(path.join(os.homedir(), 'local'));
    });

    it('should return merged config', () => {
      const result = config.getConfig();

      expect(result).to.have.property('frameworkId');
      expect(result.meta.created_at).not.to.be.null;
      expect(result.meta.updated_at).not.to.be.null;
      delete result.frameworkId;
      delete result.meta;
      expect(result).to.deep.equal({
        trackingDisabled: true,
        enterpriseDisabled: false,
        userId: null,
      });
    });

    it('should include values from default global config file', () => {
      const result = config.get('enterpriseDisabled');
      expect(result).to.be.false;
    });

    it('should prefer values from local over global config', () => {
      const result = config.get('trackingDisabled');
      expect(result).to.be.true;
    });

    it('should not have a value that does not exist in both configs ', () => {
      const result = config.get('nonexistentKey');
      expect(result).to.be.undefined;
    });

    it('when setting a new value, it should update only local config', async () => {
      config.set('newKey', 'somevalue');
      const localConfigContent = await fs.promises.readFile(localConfigPath, 'utf-8');
      expect(JSON.parse(localConfigContent).newKey).to.equal('somevalue');
      const globalConfigContent = await fs.promises.readFile(globalConfigPath, 'utf-8');
      expect(JSON.parse(globalConfigContent)).to.not.have.property('newKey');
    });

    it('when deleting a value, it should update only local config', async () => {
      config.delete('trackingDisabled');
      const localConfigContent = await fs.promises.readFile(localConfigPath, 'utf-8');
      expect(JSON.parse(localConfigContent)).to.not.have.property('trackingDisabled');
      const globalConfigContent = await fs.promises.readFile(globalConfigPath, 'utf-8');
      expect(JSON.parse(globalConfigContent)).to.have.property('trackingDisabled');
    });
  });

  describe('for no config file existing beforehand', () => {
    let globalConfigPath;

    before(async () => {
      globalConfigPath = path.join(os.homedir(), config.CONFIG_FILE_NAME);
    });

    after(async () => {
      await fs.promises.unlink(globalConfigPath);
    });

    it('should create default config file in homedir during get', async () => {
      config.get('notImportant');
      const stat = await fs.promises.stat(globalConfigPath);
      expect(stat.isFile()).to.be.true;
    });

    it('should return default config', () => {
      const result = config.getConfig();

      expect(result).to.have.property('frameworkId');
      expect(result.meta.created_at).not.to.be.null;
      expect(result.meta.updated_at).not.to.be.null;
      delete result.frameworkId;
      delete result.meta;
      expect(result).to.deep.equal({
        trackingDisabled: false,
        enterpriseDisabled: false,
        userId: null,
      });
    });

    it('should include values from default global config file', () => {
      const result = config.get('enterpriseDisabled');
      expect(result).to.be.false;
    });

    it('should not have a value that does not exist in config', () => {
      const result = config.get('nonexistentKey');
      expect(result).to.be.undefined;
    });

    it('when setting a new value, it should properly update config file', async () => {
      config.set('newKey', 'somevalue');
      const globalConfigContent = await fs.promises.readFile(globalConfigPath, 'utf-8');
      expect(JSON.parse(globalConfigContent).newKey).to.equal('somevalue');
    });

    it('when deleting a value, it should properly update config file', async () => {
      config.delete('trackingDisabled');
      const globalConfigContent = await fs.promises.readFile(globalConfigPath, 'utf-8');
      expect(JSON.parse(globalConfigContent)).to.not.have.property('trackingDisabled');
    });
  });

  describe('for global config file in .config directory', () => {
    const globalConfig = {
      trackingDisabled: false,
      enterpriseDisabled: true,
    };
    let globalConfigPath;
    let configFileDir;

    before(async () => {
      configFileDir = path.join(os.homedir(), '.config');
      await fs.promises.mkdir(configFileDir);
      globalConfigPath = path.join(configFileDir, config.CONFIG_FILE_NAME);
      await fs.promises.writeFile(globalConfigPath, JSON.stringify(globalConfig, null, 2));
    });

    after(async () => {
      await fs.promises.unlink(globalConfigPath);
      await fs.promises.rmdir(configFileDir);
    });

    it('should not create default config file in homedir', async () => {
      config.get('notImportant');
      await expect(
        fs.promises.stat(path.join(os.homedir(), config.CONFIG_FILE_NAME))
      ).to.be.eventually.rejected.and.have.property('code', 'ENOENT');
    });

    it('should correctly return existing values', () => {
      const result = config.get('trackingDisabled');
      expect(result).to.be.false;
    });

    it('should not have a value that does not exist in config', () => {
      const result = config.get('nonexistentKey');
      expect(result).to.be.undefined;
    });

    it('when setting a new value, it should properly update config file', async () => {
      config.set('newKey', 'somevalue');
      const globalConfigContent = await fs.promises.readFile(globalConfigPath, 'utf-8');
      expect(JSON.parse(globalConfigContent).newKey).to.equal('somevalue');
    });

    it('when deleting a value, it should properly update config file', async () => {
      config.delete('trackingDisabled');
      const globalConfigContent = await fs.promises.readFile(globalConfigPath, 'utf-8');
      expect(JSON.parse(globalConfigContent)).to.not.have.property('trackingDisabled');
    });
  });

  describe('set scenarios', () => {
    const globalConfig = {
      trackingDisabled: false,
      enterpriseDisabled: true,
      items: {
        id1: {
          name: 'John',
        },
        id2: {
          name: 'James',
        },
      },
    };
    let globalConfigPath;

    before(async () => {
      globalConfigPath = path.join(os.homedir(), config.CONFIG_FILE_NAME);
      await fs.promises.writeFile(globalConfigPath, JSON.stringify(globalConfig, null, 2));
    });

    after(async () => {
      await fs.promises.unlink(globalConfigPath);
    });

    it('should work correctly for key-value pair provided', () => {
      config.set('newKey', 'somevalue');
      const resultConfig = config.getConfig();

      expect(resultConfig.newKey).to.equal('somevalue');
    });

    it('should work correctly for provided object', () => {
      const updateData = {
        trackingDisabled: true,
        items: {
          id3: {
            name: 'Joshua',
          },
        },
      };
      config.set(updateData);
      const resultConfig = config.getConfig();

      expect(resultConfig.trackingDisabled).to.be.true;
      expect(resultConfig.items).to.deep.equal({
        id1: {
          name: 'John',
        },
        id2: {
          name: 'James',
        },
        id3: {
          name: 'Joshua',
        },
      });
    });

    it('should set updated_at property', () => {
      config.set('newKey', 'somevalue');
      const resultConfig = config.getConfig();
      expect(resultConfig.meta.updated_at).not.to.be.null;
    });
  });

  describe('delete scenarios', () => {
    const globalConfig = {
      trackingDisabled: false,
      enterpriseDisabled: true,
      items: {
        id1: {
          name: 'John',
        },
        id2: {
          name: 'James',
        },
      },
      otherItems: {
        firstKey: {
          prop: 'nested',
        },
        secondKey: {
          prop: 'secondnested',
        },
      },
    };
    let globalConfigPath;

    before(async () => {
      globalConfigPath = path.join(os.homedir(), config.CONFIG_FILE_NAME);
      await fs.promises.writeFile(globalConfigPath, JSON.stringify(globalConfig, null, 2));
    });

    after(async () => {
      await fs.promises.unlink(globalConfigPath);
    });

    it('should remove plain key', () => {
      config.delete('trackingDisabled');
      const resultConfig = config.getConfig();

      expect(resultConfig).to.not.have.property('trackingDisabled');
    });

    it('should work correctly for nested key', () => {
      config.delete('items.id1');
      const resultConfig = config.getConfig();

      expect(resultConfig.items).to.deep.equal({
        id2: {
          name: 'James',
        },
      });
    });

    it('should work correctly for array of keys', () => {
      config.delete(['otherItems.secondKey', 'enterpriseDisabled']);
      const resultConfig = config.getConfig();

      expect(resultConfig).to.not.have.property('enterpriseDisabled');
      expect(resultConfig.otherItems).to.deep.equal({
        firstKey: {
          prop: 'nested',
        },
      });
    });

    it('should set updated_at property', () => {
      config.delete('items');
      const resultConfig = config.getConfig();
      expect(resultConfig.meta.updated_at).not.to.be.null;
    });
  });

  describe('with malformed config files', () => {
    const malformedConfigJson = '{"userId":null';
    const backupConfigFilename = `${config.CONFIG_FILE_NAME}.bak`;

    describe('for malformed local config', () => {
      let localConfigFilePath;

      before(async () => {
        await fs.promises.mkdir('local');
        process.chdir('local');
        localConfigFilePath = path.join(process.cwd(), config.CONFIG_FILE_NAME);
        await fs.promises.writeFile(localConfigFilePath, malformedConfigJson);
      });

      after(async () => {
        await fs.promises.unlink(path.join(process.cwd(), backupConfigFilename));
        process.chdir(os.homedir());
        await fs.promises.rmdir(path.join(os.homedir(), 'local'));
      });

      it('should handle malformed config and move it to backup file', async () => {
        delete require.cache[require.resolve('../log')];
        delete require.cache[require.resolve('../config')];

        const conf = require('../config').getConfig();

        expect(conf).to.not.be.empty;

        const backupConfigFile = await fs.promises.readFile(
          path.join(process.cwd(), backupConfigFilename),
          'utf-8'
        );
        expect(backupConfigFile).to.equal(malformedConfigJson);
        await expect(
          fs.promises.stat(localConfigFilePath)
        ).to.be.eventually.rejected.and.have.property('code', 'ENOENT');
      });
    });

    describe('for global config in homedir', () => {
      let configFilePath;

      before(async () => {
        await fs.promises.mkdir('local');
        process.chdir('local');
        configFilePath = path.join(os.homedir(), config.CONFIG_FILE_NAME);
        await fs.promises.writeFile(configFilePath, malformedConfigJson);
      });

      after(async () => {
        await fs.promises.unlink(configFilePath);
        process.chdir(os.homedir());
        await fs.promises.rmdir(path.join(os.homedir(), 'local'));
      });

      it('should handle malformed config file and regenerate it', async () => {
        delete require.cache[require.resolve('../log')];
        delete require.cache[require.resolve('../config')];

        const conf = require('../config').getConfig();

        expect(conf).to.not.be.empty;

        const [backupConfigFile, regeneratedConfigFile] = await Promise.all([
          fs.promises.readFile(path.join(os.homedir(), backupConfigFilename), 'utf-8'),
          fs.promises.readFile(configFilePath),
        ]);
        expect(backupConfigFile).to.equal(malformedConfigJson);
        expect(JSON.parse(regeneratedConfigFile)).to.deep.equal(conf);
      });
    });

    describe('for global config in ~/.config dir', () => {
      let configFilePath;
      let configFileDir;

      before(async () => {
        configFileDir = path.join(os.homedir(), '.config');
        await fs.promises.mkdir(configFileDir);
        configFilePath = path.join(configFileDir, config.CONFIG_FILE_NAME);
        await fs.promises.writeFile(configFilePath, malformedConfigJson);
      });

      after(async () => {
        await Promise.all([
          fs.promises.unlink(`${configFilePath}.bak`),
          fs.promises.unlink(path.join(os.homedir(), config.CONFIG_FILE_NAME)),
        ]);
        await fs.promises.rmdir(configFileDir);
      });

      it('should handle malformed config file and regenerate it in default global location', async () => {
        delete require.cache[require.resolve('../log')];
        delete require.cache[require.resolve('../config')];
        const conf = require('../config').getConfig();

        expect(conf).to.not.be.empty;

        const [backupConfigFile, regeneratedConfigFile] = await Promise.all([
          fs.promises.readFile(path.join(configFileDir, backupConfigFilename), 'utf-8'),
          fs.promises.readFile(path.join(os.homedir(), config.CONFIG_FILE_NAME)),
        ]);
        expect(backupConfigFile).to.equal(malformedConfigJson);
        expect(JSON.parse(regeneratedConfigFile)).to.deep.equal(conf);
      });
    });
  });

  describe('getLoggedInUser', () => {
    let globalConfigPath;

    before(async () => {
      globalConfigPath = path.join(os.homedir(), config.CONFIG_FILE_NAME);
    });

    after(async () => {
      await fs.promises.unlink(globalConfigPath);
    });

    it('should return null if no userId', async () => {
      const globalConfig = {
        userId: null,
      };
      await fs.promises.writeFile(globalConfigPath, JSON.stringify(globalConfig, null, 2));
      const result = config.getLoggedInUser();
      expect(result).to.be.null;
    });

    it('should return null if no configuration for userId', async () => {
      const globalConfig = {
        userId: 1,
      };
      await fs.promises.writeFile(globalConfigPath, JSON.stringify(globalConfig, null, 2));
      const result = config.getLoggedInUser();
      expect(result).to.be.null;
    });

    it('should return null if username missing', async () => {
      const globalConfig = {
        userId: 1,
        users: {
          1: {
            dashboard: {
              accessKeys: ['firstkey', 'secondkey'],
              idToken: 'idtoken',
            },
          },
        },
      };
      await fs.promises.writeFile(globalConfigPath, JSON.stringify(globalConfig, null, 2));
      const result = config.getLoggedInUser();
      expect(result).to.be.null;
    });

    it('should return proper user object', async () => {
      const globalConfig = {
        userId: 1,
        users: {
          1: {
            dashboard: {
              username: 'firstUsername',
              accessKeys: { firstOrg: 'firstkey', secondOrg: 'secondkey' },
              idToken: 'idtoken',
              refreshToken: 'refresh-token',
            },
          },
        },
      };
      await fs.promises.writeFile(globalConfigPath, JSON.stringify(globalConfig, null, 2));
      const result = config.getLoggedInUser();
      expect(result).to.deep.equal({
        idToken: 'idtoken',
        accessKeys: { firstOrg: 'firstkey', secondOrg: 'secondkey' },
        username: 'firstUsername',
        userId: 1,
        refreshToken: 'refresh-token',
      });
    });
  });
});
