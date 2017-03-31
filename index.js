'use strict';
const net = require('net');

const getPort = port => new Promise((resolve, reject) => {
	const server = net.createServer();

	server.unref();
	server.on('error', reject);

	server.listen(port, () => {
		const port = server.address().port;
		server.close(() => {
			resolve(port);
		});
	});
});

module.exports = preferredPort => preferredPort ?
	getPort(preferredPort).catch(() => getPort(0)) :
	getPort(0);
