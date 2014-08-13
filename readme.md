# get-port [![Build Status](https://travis-ci.org/sindresorhus/get-port.svg?branch=master)](https://travis-ci.org/sindresorhus/get-port)

> Get an available port


## Install

```sh
$ npm install --save get-port
```


## Usage

```js
var getPort = require('get-port');

getPort(function (err, port) {
	console.log(port);
	//=> 51402
});
```


## CLI

```sh
$ npm install --global get-port
```

```sh
$ get-port --help

  Example
    get-port
    51402
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
