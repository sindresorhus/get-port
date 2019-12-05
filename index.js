'use strict';
const net = require('net');

const used = {
	old: new Set(),
	young: new Set()
};

const getAvailablePort = options => new Promise((resolve, reject) => {
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

const portCheckSequence = function * (ports) {
	if (ports) {
		yield * ports;
	}

	yield 0; // Fall back to 0 if anything else failed
};

module.exports = async options => {
	let ports = null;
	const sweep = 1000 * 15;
	if (options) {
		ports = typeof options.port === 'number' ? [options.port] : options.port;
	}

	const interval = setInterval(() => {
		used.old = used.young;
		used.young = new Set();
	}, sweep).unref();
	interval.unref();

	for (const port of portCheckSequence(ports)) {
		try {
			let p = await getAvailablePort({...options, port}); // eslint-disable-line no-await-in-loop
			while (used.old.has(p) || used.young.has(p)) {
				if (port !== 0) {
					throw new Error('locked');
				}

				p = await getAvailablePort({...options, port}); // eslint-disable-line no-await-in-loop
			}

			used.young.add(p);

			return p;
		} catch (error) {
			if (error.code !== 'EADDRINUSE' && error.message !== 'locked') {
				throw error;
			}
		}
	}

	throw new Error('No available ports found');
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
