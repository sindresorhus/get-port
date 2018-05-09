# get-port [![Build Status](https://travis-ci.org/sindresorhus/get-port.svg?branch=master)](https://travis-ci.org/sindresorhus/get-port)

> Get an available [TCP port](https://en.wikipedia.org/wiki/Port_(computer_networking))


## Install

```
$ npm install get-port
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
getPort({port: 3000}).then(port => {
	console.log(port);
	// Will use 3000 if available, otherwise fall back to a random port
});
```
## Limitations
-  The port number will almost always be available to use. But, there is a possibility of race condition as another service may have started to use the same port number in between the time `get-port` takes to determine if the port is available and the time when the program actually starts using the port. So, It isn't always guaranteed to be available. 

## API

### getPort([options])

Returns a `Promise` for a port number.

#### options

Type: `Object`

##### port

Type: `number`

The preferred port to use.

##### host

Type: `string`

The host on which port resolution should be performed. Can be either an IPv4 or IPv6 address.


## Related

- [get-port-cli](https://github.com/sindresorhus/get-port-cli) - CLI for this module


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
