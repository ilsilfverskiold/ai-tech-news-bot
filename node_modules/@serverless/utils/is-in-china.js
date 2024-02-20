'use strict';

if (process.env.SLS_GEO_LOCATION) {
  module.exports = process.env.SLS_GEO_LOCATION === 'cn';
  return;
}

module.exports = new Intl.DateTimeFormat('en', { timeZoneName: 'long' })
  .format()
  .includes('China Standard Time');
