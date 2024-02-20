'use strict';

const { expect } = require('chai');
const fsp = require('fs').promises;
const wait = require('timers-ext/promise/sleep');
const proxyquire = require('proxyquire');
const configFileName = require('../config').CONFIG_FILE_NAME;
const log = require('../log').log.get('test');

const sinon = require('sinon');

const getNotificationsModeStub = sinon.stub();

const processBackendNotificationRequest = proxyquire('../process-backend-notification-request', {
  './get-notifications-mode': getNotificationsModeStub,
});

const defaultFixture = [
  { code: 'CODE12', message: 'Some notification', visibilityInterval: 12 },
  { code: 'CODE0A', message: 'Some notification', visibilityInterval: 0 },
  { code: 'CODE6', message: 'Some notification', visibilityInterval: 6 },
  { code: 'CODE0B', message: 'Some notification', visibilityInterval: 0 },
  { code: 'CODE24', message: 'Some notification', visibilityInterval: 24 },
  { code: 'CODE0C', message: 'Some notification', visibilityInterval: 0 },
];

// Reason for enforcing time progress is that the test became flaky - in some situations two notifications
// had the same lastShown value in config
const processTargetNotifications = async (notifications) => {
  try {
    const result = processBackendNotificationRequest(notifications);
    log.debug('process notification %o success: %s', notifications, result);
    return result;
  } catch (error) {
    log.debug('process notification %o error: %o', notifications, error);
    throw error;
  } finally {
    await wait(1);
  }
};

describe('process-backend-notification-request', () => {
  afterEach(async () => fsp.unlink(configFileName));

  it('Should ignore invalid input', async () => {
    expect(await processTargetNotifications()).to.equal(null);
    expect(
      await processTargetNotifications([
        null,
        'foo',
        NaN,
        new Error(),
        { message: 'FOO' },
        { code: 'CODE1' },
      ])
    ).to.equal(null);
  });

  it('Should show not shown notification', async () => {
    const notification = await processTargetNotifications([
      { code: 'CODE1', message: 'Some notification #1' },
      { code: 'CODE2', message: 'Some notification #2' },
    ]);

    expect(notification.code).to.equal('CODE1');
  });

  it('Should skip shown notification', async () => {
    await processTargetNotifications([
      { code: 'CODE1', message: 'Some notification #1' },
      { code: 'CODE2', message: 'Some notification #2' },
    ]);
    const notification = await processTargetNotifications([
      { code: 'CODE1', message: 'Some notification #1' },
      { code: 'CODE2', message: 'Some notification #2' },
    ]);

    expect(notification.code).to.equal('CODE2');
  });

  it('Should favor notification to be shown least frequently', async () => {
    expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE24');
    expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE12');
    expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE6');
    expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE0A');
  });

  it('If notification is to be shown always, favor one shown least recently', async () => {
    const fixture = [
      { code: 'CODE0A', message: 'Some notification', visibilityInterval: 0 },
      { code: 'CODE0B', message: 'Some notification', visibilityInterval: 0 },
      { code: 'CODE0C', message: 'Some notification', visibilityInterval: 0 },
    ];
    expect((await processTargetNotifications(fixture)).code).to.equal('CODE0A');
    expect((await processTargetNotifications(fixture)).code).to.equal('CODE0B');
    expect((await processTargetNotifications(fixture)).code).to.equal('CODE0C');
    expect((await processTargetNotifications(fixture)).code).to.equal('CODE0A');
    expect((await processTargetNotifications(fixture)).code).to.equal('CODE0B');
    expect((await processTargetNotifications(fixture)).code).to.equal('CODE0C');
  });

  describe('Notifications mode', () => {
    it("Should ignore all notifications if notification mode set to 'off'", async () => {
      getNotificationsModeStub.returns('off');
      const notification = await processTargetNotifications([
        { code: 'CODE123', message: 'Some notification #1' },
        { code: 'CODE456', message: 'Some notification #2' },
      ]);

      expect(notification).to.be.null;
    });

    it("Should only consider outdated version notifications if notifications mode set to 'upgrades-only'", async () => {
      getNotificationsModeStub.returns('upgrades-only');
      const notification = await processTargetNotifications([
        { code: 'CODE456', message: 'Some notification' },
        { code: 'OUTDATED_MINOR_VERSION', message: 'outdated' },
      ]);

      expect(notification.code).to.equal('OUTDATED_MINOR_VERSION');
    });

    it("Should consider all notifications if notifications mode set to 'on'", async () => {
      getNotificationsModeStub.returns('on');
      const notification = await processTargetNotifications([
        { code: 'CODE123', message: 'Some notification #1' },
        { code: 'CODE456', message: 'Some notification #2' },
      ]);

      expect(notification.code).to.equal('CODE123');
    });

    it("Should force not shown or oldest shown with notifications mode  set to 'force'", async () => {
      getNotificationsModeStub.returns('force');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE24');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE12');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE6');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE0A');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE0B');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE0C');

      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE24');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE12');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE6');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE0A');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE0B');
      expect((await processTargetNotifications(defaultFixture)).code).to.equal('CODE0C');
    });
  });
});
