'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire');
const overrideEnv = require('process-utils/override-env');

const getNotificationsMode = proxyquire('../get-notifications-mode', {
  'ci-info': { isCI: false },
});

describe('get-notifications-mode', () => {
  it('for SLS_NOTIFICATIONS_MODE set to `on`', () => {
    let notificationMode;
    overrideEnv({ variables: { SLS_NOTIFICATIONS_MODE: 'on' } }, () => {
      notificationMode = getNotificationsMode();
    });
    expect(notificationMode).to.equal('on');
  });

  it('for SLS_NOTIFICATIONS_MODE set to `2`', () => {
    let notificationMode;
    overrideEnv({ variables: { SLS_NOTIFICATIONS_MODE: '2' } }, () => {
      notificationMode = getNotificationsMode();
    });
    expect(notificationMode).to.equal('on');
  });

  it('for SLS_NOTIFICATIONS_MODE set to `upgrades-only`', () => {
    let notificationMode;
    overrideEnv({ variables: { SLS_NOTIFICATIONS_MODE: 'upgrades-only' } }, () => {
      notificationMode = getNotificationsMode();
    });
    expect(notificationMode).to.equal('upgrades-only');
  });

  it('for SLS_NOTIFICATIONS_MODE set to `1`', () => {
    let notificationMode;
    overrideEnv({ variables: { SLS_NOTIFICATIONS_MODE: '1' } }, () => {
      notificationMode = getNotificationsMode();
    });
    expect(notificationMode).to.equal('upgrades-only');
  });

  it('for SLS_NOTIFICATIONS_MODE set to `off`', () => {
    let notificationMode;
    overrideEnv({ variables: { SLS_NOTIFICATIONS_MODE: 'off' } }, () => {
      notificationMode = getNotificationsMode();
    });
    expect(notificationMode).to.equal('off');
  });

  it('for SLS_NOTIFICATIONS_MODE set to `0`', () => {
    let notificationMode;
    overrideEnv({ variables: { SLS_NOTIFICATIONS_MODE: '0' } }, () => {
      notificationMode = getNotificationsMode();
    });
    expect(notificationMode).to.equal('off');
  });

  it('for SLS_NOTIFICATIONS_MODE set to `force`', () => {
    let notificationMode;
    overrideEnv({ variables: { SLS_NOTIFICATIONS_MODE: 'force' } }, () => {
      notificationMode = getNotificationsMode();
    });
    expect(notificationMode).to.equal('force');
  });

  it('for SLS_NOTIFICATIONS_MODE set to `3`', () => {
    let notificationMode;
    overrideEnv({ variables: { SLS_NOTIFICATIONS_MODE: '3' } }, () => {
      notificationMode = getNotificationsMode();
    });
    expect(notificationMode).to.equal('force');
  });

  it('for SLS_NOTIFICATIONS_MODE set to invalid value', () => {
    let notificationMode;
    overrideEnv({ variables: { SLS_NOTIFICATIONS_MODE: 'invalid' } }, () => {
      notificationMode = getNotificationsMode();
    });
    expect(notificationMode).to.equal('on');
  });

  it('for SLS_NOTIFICATIONS_MODE not set', () => {
    let notificationMode;
    overrideEnv({}, () => {
      notificationMode = getNotificationsMode();
    });
    expect(notificationMode).to.equal('on');
  });
});
