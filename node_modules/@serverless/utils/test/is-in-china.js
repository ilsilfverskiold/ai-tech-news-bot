'use strict';

const { expect } = require('chai');
const requireUncached = require('ncjsm/require-uncached');
const isInChina = require('../is-in-china');

describe('is-in-china', () => {
  it('Should resole boolean', () => {
    expect(typeof isInChina).to.equal('boolean');
  });
  it('Should be overridable by SLS_GEO_LOCATION env var', () => {
    process.env.SLS_GEO_LOCATION = 'cn';
    expect(
      requireUncached(require.resolve('../is-in-china'), () => require('../is-in-china'))
    ).to.equal(true);
    process.env.SLS_GEO_LOCATION = 'us';
    expect(
      requireUncached(require.resolve('../is-in-china'), () => require('../is-in-china'))
    ).to.equal(false);
  });
});
