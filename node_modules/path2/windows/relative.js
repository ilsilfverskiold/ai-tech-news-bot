'use strict';

var resolve = require('./resolve');

module.exports = function (from, to) {
	var lowerFrom, lowerTo, trim, toParts, lowerFromParts, lowerToParts, length
	  , samePartsLength, i, outputParts;

	from = resolve(from);
	to = resolve(to);

	// windows is not case sensitive
	lowerFrom = from.toLowerCase();
	lowerTo = to.toLowerCase();

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

	toParts = trim(to.split('\\'));

	lowerFromParts = trim(lowerFrom.split('\\'));
	lowerToParts = trim(lowerTo.split('\\'));

	length = Math.min(lowerFromParts.length, lowerToParts.length);
	samePartsLength = length;
	for (i = 0; i < length; i++) {
		if (lowerFromParts[i] !== lowerToParts[i]) {
			samePartsLength = i;
			break;
		}
	}

	if (samePartsLength === 0) {
		return to;
	}

	outputParts = [];
	for (i = samePartsLength; i < lowerFromParts.length; i++) {
		outputParts.push('..');
	}

	outputParts = outputParts.concat(toParts.slice(samePartsLength));

	return outputParts.join('\\');
};
