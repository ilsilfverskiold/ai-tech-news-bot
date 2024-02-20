'use strict';

const ci = require('ci-info');

const NOTIFICATIONS_MODE_OFF = 'off';
const NOTIFICATIONS_MODE_ONLY_OUTDATED_VERSION = 'upgrades-only';
const NOTIFICATIONS_MODE_ON = 'on';
const NOTIFICATIONS_MODE_FORCE = 'force';

const oldNotationMap = [
  NOTIFICATIONS_MODE_OFF,
  NOTIFICATIONS_MODE_ONLY_OUTDATED_VERSION,
  NOTIFICATIONS_MODE_ON,
  NOTIFICATIONS_MODE_FORCE,
];

const ALLOWED_NOTIFICATIONS_MODES = new Set([
  NOTIFICATIONS_MODE_ON,
  NOTIFICATIONS_MODE_ONLY_OUTDATED_VERSION,
  NOTIFICATIONS_MODE_OFF,
  NOTIFICATIONS_MODE_FORCE,
]);

const getNotificationsMode = () => {
  const modeFromEnv =
    oldNotationMap[Number(process.env.SLS_NOTIFICATIONS_MODE)] ||
    process.env.SLS_NOTIFICATIONS_MODE;

  if (modeFromEnv && ALLOWED_NOTIFICATIONS_MODES.has(modeFromEnv)) return modeFromEnv;

  if (ci.isCI) return NOTIFICATIONS_MODE_ONLY_OUTDATED_VERSION;

  return NOTIFICATIONS_MODE_ON;
};

module.exports = getNotificationsMode;
