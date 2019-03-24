export interface Options {
	/**
	 * A preferred port or an array of preferred ports to use.
	 */
	readonly port?: number | ReadonlyArray<number>,

	/**
	 * The host on which port resolution should be performed. Can be either an IPv4 or IPv6 address.
	 */
	readonly host?: string;
}

declare const getPort: {
  /**
   * Get an available TCP port number.
   *
   * @returns Port number.
   */
  (options?: Options): Promise<number>;

  /**
   * Make a range of ports [from,to).
   * @param from - First port of range(inclusive)
   * @param to - Last port of range(exclusive)
   * @returns Array with ports in range.
   */
  makeRange(from: number, to: number): number[];
}

export default getPort;
