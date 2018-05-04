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

To pass in a preferred port:

```js
getPort({port: 3000}).then(port => {
	console.log(port);
	// Will use 3000 if available, otherwise fall back to a random port
});
```

TO pass in a list of preferred ports:

```js
getPort({ports: [3000,3001,3002]}).then(port => {
	console.log(port);
	// Will use any element in the preferred ports array if available, otherwise fall back to a random port
});
```

## Limitations
-  In practice, under typical circumstances, the port number almost always will be available to use. But, there's a possibility of race condition as another service may have started to occupy the port in between the time it takes to determine whether the port is available and the program actually starts using the port. So, It isn't always guaranteed to be available. 

## API

### getPort([options])

Returns a `Promise` for a port number.

#### options

Type: `Object`

##### port

Type: `number`

The preferred port to use.

##### ports 

Type: `Array`

The array of preferred ports to use

##### host

Type: `string`

The host on which port resolution should be performed. Can be either an IPv4 or IPv6 address.


## Related

- [get-port-cli](https://github.com/sindresorhus/get-port-cli) - CLI for this module


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
