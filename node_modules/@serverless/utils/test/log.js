'use strict';

const expect = require('chai').expect;
const log = require('../log');

describe('log', () => {
  describe('`log` (Event messaging interface)', () => {
    it('should export methods that allow to write to different levels', () => {
      expect(typeof log.log.debug).to.equal('function');
      expect(typeof log.log.info).to.equal('function');
      expect(typeof log.log.notice).to.equal('function');
      expect(typeof log.log.warn).to.equal('function');
      expect(typeof log.log.error).to.equal('function');
    });
    it('should export methods that allow to create namespaced logger', () => {
      const nsLog = log.log.get('some-ns');
      expect(typeof nsLog.debug).to.equal('function');
      expect(typeof nsLog.info).to.equal('function');
      expect(typeof nsLog.notice).to.equal('function');
      expect(typeof nsLog.warn).to.equal('function');
      expect(typeof nsLog.error).to.equal('function');
    });
    it('should export log decorators', () => {
      expect(typeof log.log.notice.success).to.equal('function');
      expect(typeof log.log.notice.skip).to.equal('function');
      const nsLog = log.log.get('some-ns');
      expect(typeof nsLog.notice.success).to.equal('function');
      expect(typeof nsLog.notice.skip).to.equal('function');
    });
    it('should export log aliases', () => {
      expect(typeof log.log.verbose).to.equal('function');
      expect(typeof log.log.success).to.equal('function');
      const nsLog = log.log.get('some-ns');
      expect(typeof nsLog.verbose).to.equal('function');
      expect(typeof nsLog.success).to.equal('function');
    });
  });

  describe('`logLevelIndex` and side utils', () => {
    it('should export used log level', () => {
      expect(Number.isInteger(log.logLevelIndex)).to.be.true;
    });
    it("should resolve if we're in verbose mode", () => {
      expect(typeof log.isVerboseMode).to.equal('boolean');
    });
  });

  describe('`writeText`', () => {
    it('should export function', () => {
      expect(typeof log.writeText).to.equal('function');
      expect(log.writeText.length).to.equal(1);
    });
  });

  describe('`progress`', () => {
    it('should expose progress interface', () => {
      expect(typeof log.progress.get('some-progress').info).to.equal('function');
    });
    it('should expose `clear` method', () => {
      expect(typeof log.progress.clear).to.equal('function');
    });
  });

  describe('`getPluginWriters`', () => {
    let testWriters;
    before(() => {
      testWriters = log.getPluginWriters('test');
    });

    it('should expose event logging interface', () => {
      const testLog = testWriters.log;
      expect(typeof testLog.debug).to.equal('function');
      expect(typeof testLog.info).to.equal('function');
      expect(typeof testLog.notice).to.equal('function');
      expect(typeof testLog.warn).to.equal('function');
      expect(typeof testLog.error).to.equal('function');
      expect(typeof testLog.get).to.equal('function');
    });

    it('should expose output writing interface', () => {
      expect(typeof testWriters.writeText).to.equal('function');
    });

    it('should expose progress writing interface', () => {
      expect(typeof testWriters.progress.get('some-progress').info).to.equal('function');
    });

    it('should create one set of writers for a plugin', () => {
      expect(testWriters).to.equal(log.getPluginWriters('test'));
    });
  });

  describe('`style`', () => {
    it('should expose styling functions', () => {
      const { style } = log;
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
});
