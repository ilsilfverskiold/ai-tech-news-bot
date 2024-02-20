"use strict";

// TOOD: Configure tests bulletproof against environment side-effects
// In this case test is vulnerable to location of tested package
// (any upmost package.json or node_modules folder will affect its result)
module.exports = function (t, a, d) { d(); };
