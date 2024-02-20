'use strict';
const telemetry = require('../telemetry');
const expect = require('chai').expect;

describe('telemetry', () => {
  describe('StepHistory', () => {
    it('stores values within object with a timestamp', () => {
      const history = new telemetry.StepHistory();
      history.set('key', 'val');
      expect(history.get('key').value).to.equal('val');
      expect(history.get('key')).to.have.property('timestamp');
    });

    it('supports `toJSON` method', () => {
      const history = new telemetry.StepHistory([['key', 'val']]);
      const result = history.toJSON();
      expect(result).to.have.lengthOf(1);
      expect(result[0].key).to.equal('key');
      expect(result[0].value).to.equal('val');
      expect(result[0]).to.have.property('timestamp');
    });

    it('supports `valuesMap` method', () => {
      const history = new telemetry.StepHistory([['key', 'val']]);
      expect(history.valuesMap()).to.deep.equal(new Map([['key', 'val']]));
    });

    it('supports `start` and `finalize` methods', () => {
      const history = new telemetry.StepHistory();
      history.start('key');
      expect(history.get('key')).to.have.property('startedAt');
      expect(history.get('key')).not.to.have.property('value');
      history.finalize('key', 'another');
      expect(history.get('key').value).to.equal('another');
      expect(history.get('key')).to.have.property('startedAt');
      expect(history.get('key')).to.have.property('finalizedAt');
      expect(history.get('key')).to.have.property('value');
    });
  });
});
