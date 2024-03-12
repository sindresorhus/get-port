import {promisify} from 'node:util';
import net from 'node:net';
import test from 'ava';
import getPort, {portNumbers, clearLockedPorts} from './index.js';

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
		host: '0.0.0.0',
	});

	t.is(port, desiredPort);
});

test('preferred ports', async t => {
	const desiredPorts = [9910, 9912, 9913];
	const port = await getPort({
		port: desiredPorts,
		host: '0.0.0.0',
	});

	t.is(port, desiredPorts[0]);
});

test('first port in preferred ports array is unavailable', async t => {
	const desiredPorts = [9090, 9091];

	const server = net.createServer();
	await promisify(server.listen.bind(server))(desiredPorts[0]);

	const port = await getPort({
		port: desiredPorts,
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
		port: desiredPorts,
	});

	t.is(typeof port, 'number');
	t.true(port > 0 && port < 65_536);
	t.not(port, desiredPorts[0]);
	t.not(port, desiredPorts[1]);
});

test('non-array iterables work', async t => {
	const desiredPorts = (function * () {
		yield 9920;
	})();

	const port = await getPort({
		port: desiredPorts,
		host: '0.0.0.0',
	});

	t.is(port, 9920);
});

test('portNumbers throws on invalid ranges', t => {
	t.throws(() => portNumbers('abc', 3000), {instanceOf: TypeError}, '`from` is not an integer number');
	t.throws(() => portNumbers(3000, 'abc'), {instanceOf: TypeError}, '`to` is not an integer number');

	t.throws(() => portNumbers(1023, 1024), {instanceOf: RangeError}, '`from` is less than the minimum port');
	t.throws(() => portNumbers(65_536, 65_536), {instanceOf: RangeError}, '`from` is greater than the maximum port');

	t.throws(() => portNumbers(1024, 1023), {instanceOf: RangeError}, '`to` is less than the minimum port');
	t.throws(() => portNumbers(65_535, 65_537), {instanceOf: RangeError}, '`to` is greater than the maximum port');

	t.throws(() => portNumbers(1025, 1024), {instanceOf: RangeError}, '`from` is less than `to`');
});

test('portNumbers produces valid ranges', t => {
	t.deepEqual([...portNumbers(1024, 1024)], [1024]);
	t.deepEqual([...portNumbers(1024, 1025)], [1024, 1025]);
	t.deepEqual([...portNumbers(1024, 1027)], [1024, 1025, 1026, 1027]);
});

test('exclude produces ranges that exclude provided exclude list', async t => {
	const exclude = [1024, 1026];
	const foundPorts = await getPort({exclude, port: portNumbers(1024, 1026)});

	// We should not find any of the exclusions in `foundPorts`.
	t.is(foundPorts, 1025);
});

test('exclude throws error if not provided with a valid iterator', async t => {
	const exclude = 42;
	await t.throwsAsync(getPort({exclude}));
});

test('exclude throws error if provided iterator contains items which are non number', async t => {
	const exclude = ['foo'];
	await t.throwsAsync(getPort({exclude}));
});

test('exclude throws error if provided iterator contains items which are unsafe numbers', async t => {
	const exclude = [Number.NaN];
	await t.throwsAsync(getPort({exclude}));
});

// TODO: Re-enable this test when ESM supports import hooks.
// test('ports are locked for up to 30 seconds', async t => {
// 	// Speed up the test by overriding `setInterval`.
// 	const {setInterval} = global;
// 	global.setInterval = (fn, timeout) => setInterval(fn, timeout / 100);

// 	delete require.cache[require.resolve('.')];
// 	const getPort = require('.');
// 	const timeout = promisify(setTimeout);
// 	const port = await getPort();
// 	const port2 = await getPort({port});
// 	t.not(port2, port);
// 	await timeout(300); // 30000 / 100
// 	const port3 = await getPort({port});
// 	t.is(port3, port);
// 	global.setInterval = setInterval;
// });

const bindPort = async ({port, host}) => {
	const server = net.createServer();
	await promisify(server.listen.bind(server))({port, host});
	return server;
};

test('preferred ports is bound up with different hosts', async t => {
	const desiredPorts = [10_990, 10_991, 10_992, 10_993];

	await bindPort({port: desiredPorts[0]});
	await bindPort({port: desiredPorts[1], host: '0.0.0.0'});
	await bindPort({port: desiredPorts[2], host: '127.0.0.1'});

	const port = await getPort({port: desiredPorts});

	t.is(port, desiredPorts[3]);
});

test('clear locked ports by lockedPorts', async t => {
	const desiredPort = 8088;
	const port1 = await getPort({port: desiredPort});
	t.is(port1, desiredPort);

	const port2 = await getPort({port: desiredPort});
	// Port1 is locked
	t.not(port2, desiredPort);

	// Clear locked ports
	clearLockedPorts()
	const port3 = await getPort({port: desiredPort});
	t.is(port3, desiredPort);
});
