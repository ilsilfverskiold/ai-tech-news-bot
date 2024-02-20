'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const configureInquirerStub = require('@serverless/test/configure-inquirer-stub');

const inquirer = require('../../inquirer');
const inquirerPromptWithHistory = require('../../inquirer/prompt-with-history');
const { StepHistory } = require('../../telemetry');

describe('inquirer/confirm', () => {
  let backupIsTTY;

  before(() => {
    backupIsTTY = process.stdin.isTTY;
    process.stdin.isTTY = true;
  });

  after(() => {
    process.stdin.isTTY = backupIsTTY;
    sinon.restore();
  });

  it('Should work and anonymize freeform input in history', async () => {
    const stepHistory = new StepHistory();

    configureInquirerStub(inquirer, {
      input: { someQuestion: 'response' },
    });

    expect(
      await inquirerPromptWithHistory({
        message: 'Question?',
        name: 'someQuestion',
        stepHistory,
        type: 'input',
      })
    ).to.equal('response');
    expect(stepHistory.get('someQuestion').value).to.equal('_user_input_');
    expect(stepHistory.get('someQuestion')).to.have.property('startedAt');
    expect(stepHistory.get('someQuestion')).to.have.property('finalizedAt');
  });

  it('Should work and not anonymize freeform input in history if `recordRawAnswerInHistory` provided', async () => {
    const stepHistory = new StepHistory();

    configureInquirerStub(inquirer, {
      input: { someQuestion: 'response' },
    });

    expect(
      await inquirerPromptWithHistory({
        message: 'Question?',
        name: 'someQuestion',
        stepHistory,
        type: 'input',
        recordRawAnswerInHistory: true,
      })
    ).to.equal('response');
    expect(stepHistory.get('someQuestion').value).to.equal('response');
    expect(stepHistory.get('someQuestion')).to.have.property('startedAt');
    expect(stepHistory.get('someQuestion')).to.have.property('finalizedAt');
  });

  it('Should work and correctly report `_continuation_` for empty answers', async () => {
    const stepHistory = new StepHistory();

    configureInquirerStub(inquirer, {
      input: { someQuestion: '' },
    });

    expect(
      await inquirerPromptWithHistory({
        message: 'Question?',
        name: 'someQuestion',
        stepHistory,
      })
    ).to.equal('');
    expect(stepHistory.get('someQuestion').value).to.equal('_continuation_');
    expect(stepHistory.get('someQuestion')).to.have.property('startedAt');
    expect(stepHistory.get('someQuestion')).to.have.property('finalizedAt');
  });

  it('Should work and report predefined select answers in history', async () => {
    const stepHistory = new StepHistory();

    configureInquirerStub(inquirer, {
      list: { someQuestion: '_something_' },
    });

    expect(
      await inquirerPromptWithHistory({
        message: 'Question?',
        name: 'someQuestion',
        stepHistory,
        type: 'list',
        choices: [
          { name: 'somename', value: '_something_' },
          { name: 'another', value: '_another_value_' },
        ],
      })
    ).to.equal('_something_');
    expect(stepHistory.get('someQuestion').value).to.equal('_something_');
    expect(stepHistory.get('someQuestion')).to.have.property('startedAt');
    expect(stepHistory.get('someQuestion')).to.have.property('finalizedAt');
  });

  it('Should work and report user-dependent select answers in history', async () => {
    const stepHistory = new StepHistory();

    configureInquirerStub(inquirer, {
      list: { someQuestion: 'providerId' },
    });

    expect(
      await inquirerPromptWithHistory({
        message: 'Question?',
        name: 'someQuestion',
        stepHistory,
        type: 'list',
        choices: [
          { name: 'somename', value: '_something_' },
          { name: 'another', value: '_another_value_' },
          { name: 'specificToUser', value: 'providerId' },
        ],
      })
    ).to.equal('providerId');
    expect(stepHistory.get('someQuestion').value).to.equal('_user_choice_');
    expect(stepHistory.get('someQuestion')).to.have.property('startedAt');
    expect(stepHistory.get('someQuestion')).to.have.property('finalizedAt');
  });
});
