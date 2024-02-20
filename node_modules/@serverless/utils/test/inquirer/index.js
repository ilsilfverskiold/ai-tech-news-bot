'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const configureInquirerStub = require('@serverless/test/configure-inquirer-stub');

const inquirer = require('../../inquirer');

describe('inquirer', () => {
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
      (
        await inquirer.prompt({
          message: 'Should?',
          type: 'confirm',
          name: 'shouldConfirm',
        })
      ).shouldConfirm
    ).to.be.true);
});
