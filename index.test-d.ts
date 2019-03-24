import {expectType} from 'tsd-check';
import getPort from '.';

expectType<number>(await getPort());
expectType<number>(await getPort({port: 3000}));
expectType<number>(await getPort({port: [3000, 3001, 3002]}));
expectType<number>(await getPort({host: 'https://localhost'}));

expectType<number[]>(getPort.makeRange(1024, 1025));
