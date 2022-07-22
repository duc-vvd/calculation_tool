import db from './helper/db.js';
import { readAllFile } from './file-handler/index.js';
import { calSaMr, calAddOnUnmargined1111FX, calAddOnUnmargined1111IRD, calEADUnmargined1111, calEADUnmargined1113 } from './calculate/index.js';

try {
    await readAllFile();
    console.time('calc');
    const saMr = calSaMr();
    const addOnUnmargined1111FX = calAddOnUnmargined1111FX();
    const addOnUnmargined1111IRD = calAddOnUnmargined1111IRD();
    const EADUnmargined1111 = calEADUnmargined1111();
    const EADUnmargined1113 = calEADUnmargined1113();
    console.timeEnd('calc');
    console.log('============= DONE =============');
} catch (error) {
    console.error(`main - catch error: ${error.message}`);
}
