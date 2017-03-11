'use strict';
const net = require('net');

module.exports = () => new Promise((resolve, reject) => {
	const server = net.createServer();

	server.unref();
	server.on('error', reject);

	server.listen(0, () => {
		const port = server.address().port;
		server.close(() => {
			resolve(port);
		});
	});
});
