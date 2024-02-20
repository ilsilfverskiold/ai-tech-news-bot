'use strict';

var re = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

module.exports = function (filename) { return re.exec(filename).slice(1); };
