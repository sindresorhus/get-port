import test from 'ava';
import fn from './';

test(t => {
	fn(function (err, port) {
		t.ifError(err);
		t.is(typeof port, 'number');
		t.true(port > 0);
		t.end();
	});
});
