import Promise = require('pinkie-promise');

declare function getport(): Promise<Number>;

export = getport;
