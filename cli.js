#!/usr/bin/env node
'use strict';
var pkg = require('./package.json');
var getPort = require('./index');
var input = process.argv[2];

function help() {
	console.log(pkg.description);
	console.log('');
	console.log('Usage');
	console.log('  $ get-port');
	console.log('  51402');
}

if (process.argv.indexOf('-h') !== -1 || process.argv.indexOf('--help') !== -1) {
	help();
	return;
}

if (process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1) {
	console.log(pkg.version);
	return;
}

getPort(function (err, port) {
	if (err) {
		throw err;
	}

	console.log(port);
});
