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

const getPort = options => {
	options = Object.assign({}, options);

	if (typeof options.port === 'number') {
		options.port = [options.port];
	}

	return (options.port || []).reduce(
		(seq, port) => seq.catch(
			() => isAvailable(Object.assign({}, options, {port}))
		),
		Promise.reject()
	);
};

module.exports = options => options ?
	getPort(options).catch(() => getPort(Object.assign(options, {port: 0}))) :
	getPort({port: 0});

module.exports.makeRange = (from, to) => {
	if (!Number.isInteger(from) || !Number.isInteger(to)) {
		throw new TypeError('`from` and `to` must ne integer numbers');
	}

	if (from < 1025 || from > 65535) {
		throw new RangeError('`from` must be between 1025 and 65535');
	}

	if (to < 1025 || to > 65535) {
		throw new RangeError('`to` must be between 1025 and 65535');
	}

	if (from >= to) {
		throw new RangeError('`to` must be greater than `from`');
	}

	const ports = [];
	for (let port = from; port < to; port++) {
		ports.push(port);
	}

	return ports;
};

module.exports.default = module.exports;
