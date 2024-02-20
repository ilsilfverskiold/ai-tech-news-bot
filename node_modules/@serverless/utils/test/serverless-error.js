'use strict';

const { expect } = require('chai');

const ServerlessError = require('../serverless-error');

describe('test/serverless-error.test.js', () => {
  it('should store message', () => {
    const error = new ServerlessError('Some message', 'SOME_CODE');
    expect(error.message).to.be.equal('Some message');
  });

  it('should expose constructor name', () => {
    const error = new ServerlessError('Some message', 'SOME_CODE');
    expect(error.name).to.be.equal('ServerlessError');
  });

  it('should store code', () => {
    const error = new ServerlessError('Some message', 'ERROR_CODE');
    expect(error.code).to.be.equal('ERROR_CODE');
  });

  it('should have stack trace', () => {
    function testStackFrame() {
      throw new ServerlessError('Some message', 'SOME_CODE');
    }

    try {
      testStackFrame();
    } catch (error) {
      expect(error.stack).to.have.string('testStackFrame');
    }
  });
});
