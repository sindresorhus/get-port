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

const getPort = (options = {}) => {
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
	getPort(options).catch(() => getPort({port: 0})) :
	getPort({port: 0});
