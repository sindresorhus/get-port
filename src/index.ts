'use strict';

import {createServer} from 'net'

export async function getPort(port?: number, host: string = 'localhost'): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		const server = createServer();
		server.unref();
		server.on('error', reject);

		server.listen({port, host}, () => {
			const port = server.address().port;
			server.close(() => {
				return resolve(port);
			})
		})
	}).catch(() => {
		return getPort(0, host);
	})
}
