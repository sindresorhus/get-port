import net from 'net';
import test from 'ava';
import m from '.';

test('port can be bound when promise resolves', async t => {
	const port = await m();
	t.is(typeof port, 'number');
	t.true(port > 0);

	const server = net.createServer();

	await new Promise(resolve => {
		server.listen(port, resolve);
	});

	t.is(server.address().port, port);
});

test('preferred port', async t => {
	const desiredPort = 8080;
	const port = await m(desiredPort);

	t.is(port, desiredPort);
});

test('preferred port unavailable', async t => {
	t.plan(3);

	const desiredPort = 8282;
	const server = net.createServer();

	await new Promise(resolve => {
		server.listen(desiredPort, resolve);
	});

	const port = await m(desiredPort);
	t.is(typeof port, 'number');
	t.true(port > 0);
	t.not(port, desiredPort);
});

test('port can be bound to IPv4 host when promise resolves', async t => {
	const port = await m({host: '0.0.0.0'});
	t.is(typeof port, 'number');
	t.true(port > 0);

	const server = net.createServer();

	await new Promise(resolve => {
		server.listen(port, '0.0.0.0', resolve);
	});

	t.is(server.address().port, port);
});

test('preferred port given IPv4 host', async t => {
	const desiredPort = 8080;
	const port = await m({port: desiredPort, host: '0.0.0.0'});

	t.is(port, desiredPort);
});
