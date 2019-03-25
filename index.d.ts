/// <reference types="node"/>
import {Omit} from 'type-fest';
import {ListenOptions} from 'net';

declare namespace getPort {
	interface Options extends Omit<ListenOptions, 'port'> {
		/**
		A preferred port or an array of preferred ports to use.
		*/
		readonly port?: number | ReadonlyArray<number>,

		/**
		The host on which port resolution should be performed. Can be either an IPv4 or IPv6 address.
		*/
		readonly host?: string;
	}
}

/**
Get an available TCP port number.

@returns Port number.

@example
```
import getPort = require('get-port');

(async () => {
	console.log(await getPort());
	//=> 51402

	// Pass in a preferred port
	console.log(await getPort({port: 3000}));
	// Will use 3000 if available, otherwise fall back to a random port

	// Pass in an array of preferred ports
	console.log(await getPort({port: [3000, 3001, 3002]}));
	// Will use any element in the preferred ports array if available, otherwise fall back to a random port
})();
```
*/
declare function getPort(options?: getPort.Options): Promise<number>;

export = getPort;
