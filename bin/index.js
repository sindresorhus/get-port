#!/usr/bin/env node

const args = require('gar')(process.argv.slice(2));
const getPort = require('..');

const displayUsage = () => {
	console.log('Examples :');
	console.log(' get-port\t\treturns any available port');
	console.log(' get-port 3000 3005\treturns 3000 or 3005 if available (or any available port)');
	console.log(' get-port -r 3000,3100\treturns an available port between 3000 and 3100 (or any)');
};

(async () => {
	if (args.h || args.help) {
		displayUsage();
		return;
	}

	// Range
	if (args.r || args.range) {
		const from = (args.r || args.range).split(',')[0];
		const to = (args.r || args.range).split(',')[1];
		if (!from || !to) {
			displayUsage();
			return;
		}

		console.log(await getPort({port: getPort.makeRange(from, to)}));
		return;
	}

	// Preferred
	if (args._.length > 0) {
		const preferred = args._.filter(a => Number.isInteger(a));
		console.log(await getPort({port: preferred}));
		return;
	}

	// Default
	console.log(await getPort());
})();
