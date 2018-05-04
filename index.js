'use strict';
const net = require('net');

const getPort = options => new Promise((resolve, reject) => {
	// For backwards compatibility with number-only input
	// TODO: Remove this in the next major version
	if (typeof options === 'number') {
		options = {
			port: [options]
		};
	} else if (typeof options.port === 'number') {
		options = {
			port: [options.port]
		};
	}

	options.port.forEach( (e, index) => {
		isAvailable(e, res => {
			if(res === false){
				if(index !== options.port.length-1) return;
				reject();
			}

			resolve(res);
		});
	});
});

const isAvailable = (options, callback) => {
	const server = net.createServer();

	server.unref();
	server.on('error', () => {
		callback(false);
	});

	server.listen(options, () => {
		const port = server.address().port;
		server.close(() => {
			callback(port);
		});
	});
};

module.exports = options => options ?
	getPort(options).catch(() => getPort(0)) :
	getPort(0);
