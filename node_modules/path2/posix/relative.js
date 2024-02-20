'use strict';

var resolve = require('./resolve');

module.exports = function (from, to) {
	var trim, fromParts, toParts, length, samePartsLength, i, outputParts;

	from = resolve(from).substr(1);
	to = resolve(to).substr(1);

	trim = function (arr) {
		var start, end;
		for (start = 0; start < arr.length; start++) {
			if (arr[start] !== '') break;
		}

		for (end = arr.length - 1; end >= 0; end--) {
			if (arr[end] !== '') break;
		}

		if (start > end) return [];
		return arr.slice(start, end - start + 1);
	};

	fromParts = trim(from.split('/'));
	toParts = trim(to.split('/'));

	length = Math.min(fromParts.length, toParts.length);
	samePartsLength = length;
	for (i = 0; i < length; i++) {
		if (fromParts[i] !== toParts[i]) {
			samePartsLength = i;
			break;
		}
	}

	outputParts = [];
	for (i = samePartsLength; i < fromParts.length; i++) {
		outputParts.push('..');
	}

	outputParts = outputParts.concat(toParts.slice(samePartsLength));

	return outputParts.join('/');
};
