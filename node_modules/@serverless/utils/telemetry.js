'use strict';

class StepHistory extends Map {
  // Deprecated, remove with next major
  set(key, value) {
    const newValueWithTimestamp = {
      value,
      timestamp: Date.now(),
    };
    return super.set(key, newValueWithTimestamp);
  }

  start(key) {
    const valueObject = {
      startedAt: Date.now(),
    };
    return super.set(key, valueObject);
  }

  finalize(key, value) {
    Object.assign(super.get(key), { finalizedAt: Date.now(), value });
  }

  valuesMap() {
    return new Map(Array.from(this.entries()).map(([key, obj]) => [key, obj.value]));
  }

  toJSON() {
    return Array.from(this.entries()).map(([key, obj]) => ({ key, ...obj }));
  }
}

module.exports = {
  StepHistory,
};
