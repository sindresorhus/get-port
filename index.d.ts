export default function getPort(options?:{
	port?: number | number[],
	host?: string;
}): Promise<number>;
