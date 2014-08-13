'use strict';
var assert = require('assert');
var getPort = require('./');

it('should get an available port', function (cb) {
	getPort(function (err, port) {
		assert(!err, err);
		assert(port > 0);
		cb();
	});
});
