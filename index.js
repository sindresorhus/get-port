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
	options = {...options};

	if (typeof options.port === 'number') {
		options.port = [options.port];
	}

	return (options.port || []).reduce(
		(seq, port) => seq.catch(
			() => isAvailable({...options, port})
		),
		Promise.reject()
	);
};

module.exports = async options => {
	if (options) {
		try {
			return await getPort(options);
		} catch (error) {
			return getPort({...options, port: 0});
		}
	}

	return getPort({port: 0});
};
