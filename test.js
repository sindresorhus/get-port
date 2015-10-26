import test from 'ava';
import fn from './';

test(async t => {
	const port = await fn();
	t.is(typeof port, 'number');
	t.true(port > 0);
});
