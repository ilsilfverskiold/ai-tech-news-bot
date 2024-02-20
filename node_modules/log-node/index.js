"use strict";

const NodeLogWriter = require("./lib/writer");

module.exports = (options = {}) => new NodeLogWriter(options);
