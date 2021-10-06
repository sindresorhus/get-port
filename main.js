const getPort = require(".");

(async()=>{
	const exclude = [1024,1337];
	const foundPort = await getPort({exclude, port: getPort.makeRange(1024, 1025)});
	const foundPort2 = await getPort({ exclude: getPort.makeRange(1024, 1444), port: getPort.makeRange(1024, 9000)});
    console.log(foundPort)
	console.log(foundPort2)
})()

