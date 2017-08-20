'use strict';
const net = require('net');

const getPort = opts => new Promise((resolve, reject) => {
	// For backwards compatibility with number-only input
	// TODO: Remove this in the next major version
	if (typeof opts === 'number') {
		opts = {
			port: opts
		};
	}

	const server = net.createServer();

	server.unref();
	server.on('error', reject);

	server.listen(opts, () => {
		const port = server.address().port;
		server.close(() => {
			resolve(port);
		});
	});
});

module.exports = opts => opts ?
	getPort(opts).catch(() => getPort(0)) :
	getPort(0);
