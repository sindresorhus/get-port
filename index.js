'use strict';
const net = require('net');

const getPort = opts => new Promise((resolve, reject) => {
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
