#!/usr/bin/env node
'use strict';
var meow = require('meow');
var getPort = require('./');

meow({
	help: [
		'Example',
		'  $ get-port',
		'  51402'
	].join('\n')
});

getPort(function (err, port) {
	if (err) {
		throw err;
	}

	console.log(port);
});
