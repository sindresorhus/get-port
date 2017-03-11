import test from 'ava';
import m from '.';

test(async t => {
	const port = await m();
	t.is(typeof port, 'number');
	t.true(port > 0);
});
