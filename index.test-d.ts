import {expectType} from 'tsd';
import getPort, {portNumbers} from './index.js';

expectType<Promise<number>>(getPort());
expectType<Promise<number>>(getPort({port: 3000}));
expectType<Promise<number>>(getPort({port: [3000, 3001, 3002]}));
expectType<Promise<number>>(getPort({host: 'https://localhost'}));
expectType<Promise<number>>(getPort({ipv6Only: true}));
expectType<Iterable<number>>(portNumbers(1024, 1025));
