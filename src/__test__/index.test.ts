import {createServer} from 'net'
import {getPort} from '../'
import 'jest'

describe('getPort', () => {
	it('port should be a number', () => {
		getPort().then((port) => {
			expect(typeof port).toBe('number');
		});
	});

	it('port can be bound when promise resolves', () => {
		getPort().then(port => {
			const server = createServer();
			return new Promise((resolve) => {
				server.listen(port, resolve)
			}).then(() => {
				expect(server.address().port).toBe(port);
				server.close();
			})
		});
	});

	it('preferred port', () => {
		const desiredPort = 8080;
		getPort(8080).then((port) => {
			expect(desiredPort).toBe(port);
		});
	});

	it('preferred port unavailable', () => {
		const desiredPort = 8282;
		const server = createServer();
		const host = 'localhost';
		new Promise((resolve) => {
			server.listen({port: desiredPort, host}, resolve);
		}).then(() => {
			return getPort(desiredPort)
		}).then((port) => {
			expect(typeof port).toBe('number');
			expect(port).toBeGreaterThan(0);
			expect(port != desiredPort).toBe(true);
			server.close()
		});
	});

	it('localhost:8282 not equal 0.0.0.0:8282', () => {
		const desiredPort = 8282;
		const server = createServer();
		const host = 'localhost';
		new Promise((resolve) => {
			server.listen({host, port: desiredPort}, resolve);
		}).then(() => {
			return getPort(desiredPort, 'localhost');
		}).then((port) => {
			expect(port != desiredPort).toBe(true);
		}).then(() => {
			return getPort(desiredPort, '0.0.0.0');
		}).then((port) => {
			expect(port).toBe(desiredPort);
			server.close();
		})
	})

});
