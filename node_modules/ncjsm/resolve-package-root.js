// Find top most package root

"use strict";

const resolveRoot = require("./lib/resolve-root");

module.exports = function (path) { return resolveRoot(path); };
