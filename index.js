'use strict';
var net = require('net');

module.exports = function (cb) {
	var server = net.createServer();
	server.unref();
	server.on('error', cb);
	server.listen(0, function () {
		server.close(cb.bind(null, null, server.address().port));
	});
};
