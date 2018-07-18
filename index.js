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
				.then(port => port)
				.catch(Promise.reject.bind(Promise));
		});
	}, Promise.reject()).then(resolve).catch(reject);
});

function getOptions(port, host) {
	return {port, host};
}

module.exports = options => options ?
	getPort(options).catch(() => getPort(0)) :
	getPort(0);
