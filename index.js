'use strict';
const net = require('net');

class Locked extends Error {
	constructor(port) {
		super(`${port} is locked`);
	}
}

const lockedPorts = {
	old: new Set(),
	young: new Set()
};

// On this interval, the old locked ports are discarded,
// the young locked ports are moved to old locked ports,
// and a new young set for locked ports are created.
const releaseOldLockedPortsIntervalMs = 1000 * 15;

const portMin = 1024;
const portMax = 65535;

// Lazily create interval on first use
let interval;

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
	let ports;
	let exclusions = [];

	if (options) {
		if (options.port) {
			ports = typeof options.port === 'number' ? [options.port] : options.port;
		}

		if (options.exclusions) {
			exclusions = typeof options.exclusions === 'number' ? [options.exclusions] : options.exclusions;
		}
	}

	if (interval === undefined) {
		interval = setInterval(() => {
			lockedPorts.old = lockedPorts.young;
			lockedPorts.young = new Set();
		}, releaseOldLockedPortsIntervalMs);

		// Does not exist in some environments (Electron, Jest jsdom env, browser, etc).
		if (interval.unref) {
			interval.unref();
		}
	}

	for (const port of portCheckSequence(ports)) {
		try {
			if (exclusions.includes(port)) {
				continue;
			}

			let availablePort = await getAvailablePort({...options, port}); // eslint-disable-line no-await-in-loop
			while (lockedPorts.old.has(availablePort) || lockedPorts.young.has(availablePort) || exclusions.includes(availablePort)) {
				if (port !== 0) {
					throw new Locked(port);
				}

				availablePort = await getAvailablePort({...options, port}); // eslint-disable-line no-await-in-loop
			}

			lockedPorts.young.add(availablePort);
			return availablePort;
		} catch (error) {
			if (!['EADDRINUSE', 'EACCES'].includes(error.code) && !(error instanceof Locked)) {
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

	if (from < portMin || from > portMax) {
		throw new RangeError(`'from' must be between ${portMin} and ${portMax}`);
	}

	if (to < portMin || to > portMax + 1) {
		throw new RangeError(`'to' must be between ${portMin} and ${portMax + 1}`);
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
