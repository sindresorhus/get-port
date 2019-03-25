export interface Options {
	/**
	 * A preferred port or an iterable of preferred ports to use.
	 */
	readonly port?: number | Iterable<number>,

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
   * Make a range of ports [from,to].
   * @param from - First port of range, must be in range [1024,65535]
   * @param to - Last port of range, must be in range [1024,65535], must be greater than `from`
   * @returns Iterable of ports in range.
   */
  makeRange(from: number, to: number): Iterable<number>;
}

export default getPort;
