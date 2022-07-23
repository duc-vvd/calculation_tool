import db from './helper/db.js';
import { readAllFile } from './file-handler/index.js';
import {
    calSaMr,
    calAddOnUnmargined1111FX,
    calAddOnUnmargined1111IRD,
    calEADUnmargined1111,
    calEADUnmargined1113,
    calEADUnmargined1114,
    calEADUnmargined1115,
    calEAD,
    calCVA,
} from './calculate/index.js';

try {
    await readAllFile();
    console.time('calc');
    const saMr = calSaMr();
    const addOnUnmargined1111FX = calAddOnUnmargined1111FX();
    const addOnUnmargined1111IRD = calAddOnUnmargined1111IRD();
    const EADUnmargined1111 = calEADUnmargined1111();
    const EADUnmargined1113 = calEADUnmargined1113();
    const EADUnmargined1114 = calEADUnmargined1114();
    const EADUnmargined1115 = calEADUnmargined1115();
    const EAD = calEAD();
    const CVA = calCVA();
    console.timeEnd('calc');
    console.log('============= DONE =============');
} catch (error) {
    console.error(`main - catch error: ${error.message}`);
}
