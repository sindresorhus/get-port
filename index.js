'use strict';
const net = require('net');

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

const getPort = options => new Promise((resolve, reject) => {
	// For backwards compatibility with number-only input
	// TODO: Remove this in the next major version
	if (typeof options === 'number') {
		options = {
			port: options
		};
	}

	if ('ports' in options) {
		options.ports.forEach((e, index) => {
			const input = getOptions(e, options.host);
			isAvailable(input, res => {
				if (res === false) {
					if (index !== options.ports.length - 1) {
						return;
					}
					reject();
				}
				resolve(res);
			});
		});
	} else {
		isAvailable(options, res => {
			if (res === false) {
				reject();
			}
			resolve(res);
		});
	}
});

function getOptions(portnumber, hostname) {
	let options;
	if (typeof hostname === undefined) {
		options = {
			port: portnumber
		};
	} else {
		options = {
			port: portnumber,
			host: hostname
		};
	}
	return options;
}

module.exports = options => options ?
	getPort(options).catch(() => getPort(0)) :
	getPort(0);
