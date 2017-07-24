import {getPort} from '../index'

getPort().then((port: number) => {
	console.log(port)
});
