#!/usr/bin/env node
'use strict';
var pkg = require('./package.json');
var getPort = require('./');
var argv = process.argv.slice(2);

function help() {
	console.log([
		'',
		'  ' + pkg.description,
		'',
		'  Example',
		'    get-port',
		'    51402'
	].join('\n'));
}

if (argv.indexOf('--help') !== -1) {
	help();
	return;
}

if (argv.indexOf('--version') !== -1) {
	console.log(pkg.version);
	return;
}

getPort(function (err, port) {
	if (err) {
		throw err;
	}

	console.log(port);
});
