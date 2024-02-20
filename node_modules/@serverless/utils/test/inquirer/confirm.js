'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const configureInquirerStub = require('@serverless/test/configure-inquirer-stub');

const inquirer = require('../../inquirer');
const inquirerConfirm = require('../../inquirer/confirm');

describe('inquirer/confirm', () => {
  let backupIsTTY;

  before(() => {
    backupIsTTY = process.stdin.isTTY;
    process.stdin.isTTY = true;
    configureInquirerStub(inquirer, {
      confirm: { shouldConfirm: true },
    });
  });
  after(() => {
    process.stdin.isTTY = backupIsTTY;
    sinon.restore();
  });

  it('Should work', async () =>
    expect(
      await inquirerConfirm('Should?', {
        name: 'shouldConfirm',
      })
    ).to.be.true);
});
