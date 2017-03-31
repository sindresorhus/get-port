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

	t.true(server.address().port === port);
});

test('preferred port', async t => {
	const desiredPort = 8080;
	const port = await m(desiredPort);

	t.true(port === desiredPort);
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
	t.true(port !== desiredPort);
});
