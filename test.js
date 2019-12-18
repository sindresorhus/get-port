import {promisify} from 'util';
import net from 'net';
import test from 'ava';
import getPort from '.';

test('port can be bound when promise resolves', async t => {
	const port = await getPort();
	t.is(typeof port, 'number');
	t.true(port > 0);

	const server = net.createServer();
	await promisify(server.listen.bind(server))(port);

	t.is(server.address().port, port);
});

test('preferred port', async t => {
	const desiredPort = 8080;
	const port = await getPort({port: desiredPort});

	t.is(port, desiredPort);
});

test('preferred port unavailable', async t => {
	const desiredPort = 8282;
	const server = net.createServer();
	await promisify(server.listen.bind(server))(desiredPort);

	const port = await getPort({port: desiredPort});
	t.is(typeof port, 'number');
	t.true(port > 0);
	t.not(port, desiredPort);
});

test('preferred port privileged', async t => {
	const desiredPort = 80;
	const port = await getPort({host: '127.0.0.1', port: desiredPort});

	t.is(typeof port, 'number');
	t.true(port > 0);
	t.not(port, desiredPort);
});

test('port can be bound to IPv4 host when promise resolves', async t => {
	const port = await getPort({host: '0.0.0.0'});
	t.is(typeof port, 'number');
	t.true(port > 0);

	const server = net.createServer();
	await promisify(server.listen.bind(server))(port, '0.0.0.0');

	t.is(server.address().port, port);
});

test('preferred port given IPv4 host', async t => {
	const desiredPort = 8081;
	const port = await getPort({
		port: desiredPort,
		host: '0.0.0.0'
	});

	t.is(port, desiredPort);
});

test('preferred ports', async t => {
	const desiredPorts = [9910, 9912, 9913];
	const port = await getPort({
		port: desiredPorts,
		host: '0.0.0.0'
	});

	t.is(port, desiredPorts[0]);
});

test('first port in preferred ports array is unavailable', async t => {
	const desiredPorts = [9090, 9091];

	const server = net.createServer();
	await promisify(server.listen.bind(server))(desiredPorts[0]);

	const port = await getPort({
		port: desiredPorts
	});

	t.is(port, desiredPorts[1]);
});

test('all preferred ports in array are unavailable', async t => {
	const desiredPorts = [9990, 9991];

	const server1 = net.createServer();
	await promisify(server1.listen.bind(server1))(desiredPorts[0]);
	const server2 = net.createServer();
	await promisify(server2.listen.bind(server2))(desiredPorts[1]);

	const port = await getPort({
		port: desiredPorts
	});

	t.is(typeof port, 'number');
	t.true(port > 0 && port < 65536);
	t.not(port, desiredPorts[0]);
	t.not(port, desiredPorts[1]);
});

test('non-array iterables work', async t => {
	const desiredPorts = (function * () {
		yield 9920;
	})();
	const port = await getPort({
		port: desiredPorts,
		host: '0.0.0.0'
	});
	t.is(port, 9920);
});

test('makeRange throws on invalid ranges', t => {
	t.throws(() => {
		getPort.makeRange(1025, 1024);
	});

	// Invalid port values
	t.throws(() => {
		getPort.makeRange(0, 0);
	});
	t.throws(() => {
		getPort.makeRange(1023, 1023);
	});
	t.throws(() => {
		getPort.makeRange(65536, 65536);
	});
});

test('makeRange produces valid ranges', t => {
	t.deepEqual([...getPort.makeRange(1024, 1024)], [1024]);
	t.deepEqual([...getPort.makeRange(1024, 1025)], [1024, 1025]);
	t.deepEqual([...getPort.makeRange(1024, 1027)], [1024, 1025, 1026, 1027]);
});

test('ports are locked for up to 30 seconds', async t => {
	// Speed up the test by overriding `setInterval`.
	const {setInterval} = global;
	global.setInterval = (fn, timeout) => setInterval(fn, timeout / 100);

	delete require.cache[require.resolve('.')];
	const getPort = require('.');
	const timeout = promisify(setTimeout);
	const port = await getPort();
	const port2 = await getPort({port});
	t.not(port2, port);
	await timeout(300); // 30000 / 100
	const port3 = await getPort({port});
	t.is(port3, port);
	global.setInterval = setInterval;
});
