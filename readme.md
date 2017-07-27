# get-port [![Build Status](https://travis-ci.org/sindresorhus/get-port.svg?branch=master)](https://travis-ci.org/sindresorhus/get-port)

> Get an available port


## Install

```
$ npm install --save get-port
```


## Usage

```js
const getPort = require('get-port');

getPort().then(port => {
	console.log(port);
	//=> 51402
});
```

Optionally, pass in a preferred port:

```js
getPort(3000).then(port => {
	console.log(port);
	// Will use 3000 if available, otherwise fall back to a random port
});
```

Additionally, you can check if a preferred port is available for a given host

```js
getPort(3000, '127.0.0.1').then(port => {
	console.log(port);
	// Will use 3000 if available, otherwise fall back to a random port
});
```


## Related

- [get-port-cli](https://github.com/sindresorhus/get-port-cli) - CLI for this module


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
