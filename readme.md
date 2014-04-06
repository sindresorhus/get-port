# get-port [![Build Status](https://travis-ci.org/sindresorhus/get-port.svg?branch=master)](https://travis-ci.org/sindresorhus/get-port)

> Get an available port


## Install

```bash
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

You can also use it as a CLI app by installing it globally:

```bash
$ npm install --global get-port
```

#### Usage

```bash
$ get-port --help

Usage
  $ get-port
  51402
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
