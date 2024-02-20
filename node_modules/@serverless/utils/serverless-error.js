// WARNING: Do not use in utilities that are used by `serverless` v3.15.2 and lower
// TODO: Remove above notice with the next major

'use strict';

const ensureString = require('type/string/ensure');
const isObject = require('type/object/is');
const ensure = require('type/ensure');

class ServerlessError extends Error {
  constructor(message, code, options = {}) {
    [message, code] = ensure(['message', message, ensureString], ['code', code, ensureString]);
    if (!isObject(options)) options = {};
    const decoratedMessage = ensureString(options.decoratedMessage, {
      name: 'options.decoratedMessage',
      isOptional: true,
    });
    super(message);
    this.code = code;
    this.decoratedMessage = decoratedMessage;
  }
}

Object.defineProperty(ServerlessError.prototype, 'name', {
  value: ServerlessError.name,
  configurable: true,
  writable: true,
});

module.exports = ServerlessError;
