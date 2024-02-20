"use strict";

const fs            = require("fs")
    , path          = require("path")
    , ensureString  = require("type/string/ensure")
    , isObject      = require("type/object/is")
    , toShortString = require("type/lib/to-short-string");

const removeDir = dirname => {
	let errors;
	for (let filename of fs.readdirSync(dirname)) {
		filename = path.resolve(dirname, filename);
		try {
			const stats = fs.statSync(filename);
			if (stats.isDirectory()) removeDir(filename);
			else fs.unlinkSync(filename);
		} catch (error) {
			if (!errors) errors = [];
			if (error.errors) errors.push(...error.errors);
			else errors.push(Object.assign(error, { _filename: filename }));
		}
	}
	if (errors) throw Object.assign(new Error("Could not remove dir"), { errors });
	else fs.rmdirSync(dirname);
};

module.exports = (dirnameInput, options = {}) => {
	const dirname = path.resolve(ensureString(dirnameInput));
	if (!isObject(options)) options = {};
	if (!options.recursive) {
		fs.rmdirSync(dirname);
		return;
	}
	try {
		removeDir(dirname);
	} catch (error) {
		if (!error.errors) throw error;
		let errorMessage = `Could not remove ${ toShortString(dirnameInput) } due to:\n- ${
			error.errors.slice(0, 5).map(({ code, _filename }) => `${ code } on ${ _filename }`)
		}`;
		if (error.errors.length > 5) {
			errorMessage += `\nand ${ error.errors.length - 5 } other errors`;
		}
		throw Object.assign(new Error(errorMessage), { errors: error.errors });
	}
};
