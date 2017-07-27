'use strict';
const net = require('net');

const getPort = (port, host) => new Promise((resolve, reject) => {
	const server = net.createServer();

	server.unref();
	server.on('error', reject);

	server.listen({port, host}, () => {
		const port = server.address().port;
		server.close(() => {
			resolve(port);
		});
	});
});

module.exports = (preferredPort, preferredHost) => preferredPort ?
	getPort(preferredPort, preferredHost).catch(() => getPort(0)) :
	getPort(0);
