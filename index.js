'use strict';
const net = require('net');
const os = require('os');

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

// Lazily create interval on first use
let interval;

const getHosts = () => {
	let interfaces = {};
	try {
		interfaces = os.networkInterfaces();
	} catch (error) {
		// As of October 2016, Windows Subsystem for Linux (WSL) does not support
		// the os.networkInterfaces() call and throws instead. For this platform,
		// assume 0.0.0.0 as the only address
		//
		// - https://github.com/Microsoft/BashOnWindows/issues/468
		//
		// - Workaround is a mix of good work from the community:
		//   - https://github.com/http-party/node-portfinder/commit/8d7e30a648ff5034186551fa8a6652669dec2f2f
		//   - https://github.com/yarnpkg/yarn/pull/772/files
		if (error.syscall === 'uv_interface_addresses') {
			// Swallow error because we're just going to use defaults
			// documented @ https://github.com/nodejs/node/blob/4b65a65e75f48ff447cabd5500ce115fb5ad4c57/doc/api/net.md#L231
		} else {
			throw error;
		}
	}

	const results = [];

	for (const _interface of Object.values(interfaces)) {
		for (const config of _interface) {
			results.push(config.address);
		}
	}

	// Add undefined value, for createServer function, do not use host and default 0.0.0.0 host
	return results.concat(undefined, '0.0.0.0');
};

const getAvailablePort = options =>
	new Promise((resolve, reject) => {
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

const testPortForHosts = async (options, hosts) => {
	if (options.host || options.port === 0) {
		return getAvailablePort(options);
	}

	for (const host of hosts) {
		try {
			await getAvailablePort({port: options.port, host}); // eslint-disable-line no-await-in-loop
		} catch (error) {
			if (['EADDRNOTAVAIL', 'EINVAL'].includes(error.code)) {
				hosts.splice(hosts.indexOf(host), 1);
			} else {
				throw error;
			}
		}
	}

	return options.port;
};

const portCheckSequence = function * (ports) {
	if (ports) {
		yield * ports;
	}

	yield 0; // Fall back to 0 if anything else failed
};

module.exports = async options => {
	let ports;

	if (options) {
		ports = typeof options.port === 'number' ? [options.port] : options.port;
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

	const hosts = getHosts();
	for (const port of portCheckSequence(ports)) {
		try {
			let availablePort = await testPortForHosts({...options, port}, hosts); // eslint-disable-line no-await-in-loop
			while (lockedPorts.old.has(availablePort) || lockedPorts.young.has(availablePort)) {
				if (port !== 0) {
					throw new Locked(port);
				}

				availablePort = await testPortForHosts({...options, port}, hosts); // eslint-disable-line no-await-in-loop
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
