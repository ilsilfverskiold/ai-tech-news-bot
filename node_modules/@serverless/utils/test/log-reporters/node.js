'use strict';

const { expect } = require('chai');
const path = require('path');
const requireUncached = require('ncjsm/require-uncached');
const resolveSync = require('ncjsm/resolve/sync');
const overrideStdoutWrite = require('process-utils/override-stdout-write');
const overrideStderrWrite = require('process-utils/override-stderr-write');
const overrideArgv = require('process-utils/override-argv');
const overrideEnv = require('process-utils/override-env');

const getLog = () =>
  requireUncached(() => {
    const uniGlobalPath = resolveSync(path.dirname(require.resolve('log')), 'uni-global').realPath;
    require(uniGlobalPath);
    const uniGlobal = {};
    require.cache[uniGlobalPath].exports = function () {
      return uniGlobal;
    };
    if (require.resolve('uni-global') !== uniGlobalPath) {
      require('uni-global');
      require.cache[require.resolve('uni-global')].exports = function () {
        return uniGlobal;
      };
    }
    require('../../log-reporters/node');
    return require('../../log');
  });

describe('log-reporters/node.js', () => {
  describe('Default visibility', () => {
    let log;
    let writeText;
    let restoreEnv;
    before(() => {
      ({ restoreEnv } = overrideEnv());
      ({ log, writeText } = getLog());
    });
    after(() => restoreEnv());

    it('should write logs of notice, warn and error levels', () => {
      let stderrData = '';
      overrideStderrWrite(
        (data) => (stderrData += data),
        () => {
          log.notice('Notice log');
          log.warn('Warn log');
          log.error('Error log');
        }
      );
      expect(stderrData).to.include('Notice log');
      expect(stderrData).to.include('Warn log');
      expect(stderrData).to.include('Error log');
    });

    it('should write level prefixes', () => {
      let stderrData = '';
      overrideStderrWrite(
        (data) => (stderrData += data),
        () => {
          log.warn('Warn log');
        }
      );
      expect(stderrData).to.include('Warning: ');
    });

    it('should not write level prefixes on deprecation logs', () => {
      let stderrData = '';
      overrideStderrWrite(
        (data) => (stderrData += data),
        () => {
          log.get('deprecation').warn('Warn log');
        }
      );
      expect(stderrData).to.not.include('Warning: ');
    });

    it('should not write logs of debug and info levels', () => {
      let stderrData = '';
      overrideStderrWrite(
        (data) => (stderrData += data),
        () => {
          log.info('Info log');
          log.debug('Debug log');
        }
      );
      expect(stderrData).to.equal('');
    });

    it('should write text output', () => {
      let stdoutData = '';
      overrideStdoutWrite(
        (data) => (stdoutData += data),
        () => {
          writeText('foo', 'bar', ['other', 'stuff']);
        }
      );
      expect(stdoutData).to.equal('foo\nbar\nother\nstuff\n');
    });
  });

  describe('Extended visibility', () => {
    describe('SLS_LOG_LEVEL env variable', () => {
      let log;
      let restoreEnv;
      before(() => {
        ({ restoreEnv } = overrideEnv());
        process.env.SLS_LOG_LEVEL = 'debug';
        ({ log } = getLog());
      });
      after(() => restoreEnv());

      it('should write logs of all levels', () => {
        let stderrData = '';
        overrideStderrWrite(
          (data) => (stderrData += data),
          () => {
            log.info('Info log');
            log.debug('Debug log');
            log.notice('Notice log');
            log.warn('Warn log');
            log.error('Error log');
          }
        );
        expect(stderrData).to.include('Debug log');
        expect(stderrData).to.include('Info log');
        expect(stderrData).to.include('Notice log');
        expect(stderrData).to.include('Warn log');
        expect(stderrData).to.include('Error log');
      });

      it('should write decorated logs', () => {
        let stderrData = '';
        overrideStderrWrite(
          (data) => (stderrData += data),
          () => {
            log.notice.success('Success log');
            log.notice.skip('Skip log');
          }
        );
        expect(stderrData).to.include('Success log');
        expect(stderrData).to.include('Skip log');
      });

      it('should write aliased logs', () => {
        let stderrData = '';
        overrideStderrWrite(
          (data) => (stderrData += data),
          () => {
            log.verbose('Verbose log');
            log.success('Success log');
          }
        );
        expect(stderrData).to.include('Verbose log');
        expect(stderrData).to.include('Success log');
      });
    });

    describe('--verbose flag', () => {
      let log;
      let restoreEnv;
      let restoreArgv;
      before(() => {
        ({ restoreEnv } = overrideEnv());
        ({ restoreArgv } = overrideArgv({ args: ['serverless', '--verbose'] }));
        ({ log } = getLog());
      });
      after(() => {
        restoreEnv();
        restoreArgv();
      });

      it('should write info level logs', () => {
        let stderrData = '';
        overrideStderrWrite(
          (data) => (stderrData += data),
          () => {
            log.info('Info log');
          }
        );
        expect(stderrData).to.include('Info log');
      });

      it('should not write debug level logs', () => {
        let stderrData = '';
        overrideStderrWrite(
          (data) => (stderrData += data),
          () => {
            log.debug('Debug log');
          }
        );
        expect(stderrData).to.not.include('Debug log');
      });
    });

    describe('--debug flag', () => {
      let log;
      let restoreEnv;
      let restoreArgv;
      before(() => {
        ({ restoreEnv } = overrideEnv());
        ({ restoreArgv } = overrideArgv({ args: ['serverless', '--debug=foo'] }));
        ({ log } = getLog());
      });
      after(() => {
        restoreEnv();
        restoreArgv();
      });

      it('should write debug level logs for specified namespace', () => {
        let stderrData = '';
        overrideStderrWrite(
          (data) => (stderrData += data),
          () => {
            log.get('foo').debug('Foo debug log');
            log.get('bar').debug('Bar debug log');
          }
        );
        expect(stderrData).to.include('Foo debug log');
        expect(stderrData).to.not.include('Bar debug log');
      });
    });
  });

  describe('Style', () => {
    let style;
    let restoreEnv;
    before(() => {
      ({ restoreEnv } = overrideEnv());
      ({ style } = getLog());
    });
    after(() => restoreEnv());

    it('style function should return input', () => {
      expect(style.aside('foo')).to.include('foo');
      expect(style.error('foo')).to.include('foo');
      expect(style.link('foo')).to.include('foo');
      expect(style.linkStrong('foo')).to.include('foo');
      expect(style.noticeSymbol('foo')).to.include('foo');
      expect(style.strong('foo')).to.include('foo');
      expect(style.title('foo')).to.include('foo');
      expect(style.warning('foo')).to.include('foo');
    });
  });

  describe('Progress', () => {
    let progress;
    let restoreEnv;
    let stdoutData = '';
    let restoreStdoutWrite;
    before(() => {
      ({ restoreEnv } = overrideEnv());
      ({ restoreStdoutWrite } = overrideStdoutWrite((data, originalWrite) => {
        stdoutData += data;
        originalWrite(data);
      }));
      process.env.SLS_INTERACTIVE_SETUP_ENABLE = 1;
      ({ progress } = getLog());
    });
    beforeEach(() => {
      stdoutData = '';
    });

    after(() => {
      progress.clear();
      restoreStdoutWrite();
      restoreEnv();
    });

    it('should write progress of notice levels', () => {
      const progressItem = progress.get('first');
      progressItem.notice('Notice progress');
      progressItem.remove();
      expect(stdoutData).to.include('Notice progress');
    });

    it('should not write progress of info levels', () => {
      const progressItem = progress.get('first');
      progressItem.info('Info progress');
      progressItem.remove();
      expect(stdoutData).to.not.include('Info progress');
    });

    it('should write main progress', () => {
      const progressItem = progress.get('main');
      progressItem.notice('Packaging');
      expect(stdoutData).to.include('Packaging (0s)');
    });

    it('should prevent any writing after `clear` method is invoked', () => {
      const progressItem = progress.get('first');
      progress.clear();
      progressItem.notice('Notice progress');
      progressItem.remove();
      expect(stdoutData).to.not.include('Notice progress');
    });
  });

  describe('Progress: Verbose', () => {
    let progress;
    let restoreEnv;
    let stdoutData = '';
    let restoreStdoutWrite;
    before(() => {
      ({ restoreEnv } = overrideEnv());
      ({ restoreStdoutWrite } = overrideStdoutWrite((data, originalWrite) => {
        stdoutData += data;
        originalWrite(data);
      }));
      process.env.SLS_LOG_LEVEL = 'info';
      process.env.SLS_INTERACTIVE_SETUP_ENABLE = 1;
      ({ progress } = getLog());
    });

    after(() => {
      restoreStdoutWrite();
      restoreEnv();
    });

    it('should write progress of notice levels', () => {
      const progressItem = progress.get('first');
      progressItem.notice('Notice progress');
      progressItem.remove();
      expect(stdoutData).to.include('Notice progress');
    });

    it('should write progress of info levels', () => {
      const progressItem = progress.get('first');
      progressItem.info('Info progress');
      progressItem.remove();
      expect(stdoutData).to.include('Info progress');
    });
  });
});
