'use strict';
const net = require('net');

const getAvailablePort = options => new Promise((resolve, reject) => {
	const server = net.createServer();
	server.unref();
	server.on('error', err => (err.code === 'EADDRINUSE') ? resolve(null) : reject(err));
	server.listen(options, () => {
		const {port} = server.address();
		server.close(() => {
			resolve(port);
		});
	});
});

module.exports = async options => {
	let ports = null;

	if (options) {
		ports = (typeof options.port === 'number') ? [options.port] : options.port;
	}

	const portGenerator = function * (ports) {
		if (ports) {
			for (const port of ports) {
				yield port;
			}
		}

		yield 0; // Fall back to 0 if anything else failed
	};

	for (const port of portGenerator(ports)) {
		const gotPort = await getAvailablePort({...options, port}); // eslint-disable-line no-await-in-loop
		if (gotPort !== null) {
			return gotPort;
		}
	}

	throw new Error('no available ports found');
};

module.exports.makeRange = (from, to) => {
	if (!Number.isInteger(from) || !Number.isInteger(to)) {
		throw new TypeError('`from` and `to` must be integer numbers');
	}

	if (from < 1024 || from > 65535) {
		throw new RangeError('`from` must be between 1024 and 65535');
	}

	if (to < 1024 || to > 65536) {
		throw new RangeError('`to` must be between 1024 and 65536');
	}

	if (to < from) {
		throw new RangeError('`to` must be greater than or equal to `from`');
	}

	const generator = function * (from, to) {
		for (let port = from; port <= to; port++) {
			yield port;
		}
	};

	return generator(from, to);
};

module.exports.default = module.exports;
