'use strict';

if (process.env.SLS_ANALYTICS_URL) {
  module.exports = process.env.SLS_ANALYTICS_URL;
  return;
}

const isInChina = require('./is-in-china');

const ChinaNotifyUrl =
  process.env.SERVERLESS_PLATFORM_STAGE === 'dev'
    ? 'https://service-pwww3r9f-1300963013.sh.apigw.tencentcs.com/release/'
    : 'https://service-9p6tdp4y-1300963013.gz.apigw.tencentcs.com/release/';

module.exports = isInChina
  ? ChinaNotifyUrl
  : 'https://sp-notifications-and-metrics-v1.serverless-platform.com';
