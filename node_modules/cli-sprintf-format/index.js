"use strict";

const getFormatFunction = require("sprintf-kit")
    , getModifiers      = require("./get-modifiers");

module.exports = getFormatFunction(getModifiers());
