'use strict';
const net = require('net');

const isAvailable = options => new Promise((resolve, reject) => {
	const server = net.createServer();
	server.unref();
	server.on('error', reject);
	server.listen(options, () => {
		const {port} = server.address();
		server.close(() => {
			resolve(port);
		});
	});
});

const getPort = options => new Promise((resolve, reject) => {
	// For backwards compatibility with number-only input
	// TODO: Remove this in the next major version
	if (typeof options === 'number') {
		options = getOptions(options);
	}

	if (typeof options.port === 'number') {
		options.port = [options.port];
	}

	options.port.reduce((seq, port) => {
		return seq.catch(() => {
			const input = getOptions(port, options.host);
			return isAvailable(input)
				.then(port => {
					return port;
				})
				.catch(() => {
					return new Promise((resolve, reject) => reject());
				});
		});
	}, Promise.reject())
		.then(port => resolve(port))
		.catch(() => reject());
});

function getOptions(portNumber, hostname) {
	let options;
	if (hostname === undefined) {
		options = {
			port: portNumber
		};
	} else {
		options = {
			port: portNumber,
			host: hostname
		};
	}
	return options;
}

module.exports = options => options ?
	getPort(options).catch(() => getPort(0)) :
	getPort(0);
