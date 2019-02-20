/**
 * Options to configure how to find an available port.
 */
export type Options = Readonly<{
	/**
	 * A preferred port or an array of preferred ports to use.
	 */
	port?: number | ReadonlyArray<number>,

	/**
	 * The host on which port resolution should be performed. Can be either an IPv4 or IPv6 address.
	 */
	host?: string;
}>;

/**
 * Returns a `Promise` for an available port number.
 *
 * @param options
 * @returns Available port number.
 */
export default function getPort(options?:Options): Promise<number>;
