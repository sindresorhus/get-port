'use strict';
const net = require('net');

const usedPorts = {};

const _getPort = options => new Promise((resolve, reject) => {
	// For backwards compatibility with number-only input
	// TODO: Remove this in the next major version
	if (typeof options === 'number') {
		options = {
			port: options
		};
	}

	const server = net.createServer();

	server.unref();
	server.on('error', reject);

	server.listen(options, () => {
		const port = server.address().port;
		server.close(() => {
			if (options.name) {
				usedPorts[options.name] = port;
			}

			resolve(port);
		});
	});
});

module.exports = options => options ? _getPort(options).catch(() => _getPort({name: options.name, port: 0})) : _getPort(0);
module.exports.getUsedPorts = () => usedPorts;
