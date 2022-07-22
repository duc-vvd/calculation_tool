import db from './helper/db.js';
import { readAllFile } from './file-handler/index.js';
import { calSaMr, calAddOnUnmargined1111FX, calAddOnUnmargined1111IRD } from './calculate/index.js';

try {
    await readAllFile();
    console.time('calc');
    const saMr = calSaMr();
    const addOnUnmargined1111FX = calAddOnUnmargined1111FX();
    const addOnUnmargined1111IRD = calAddOnUnmargined1111IRD();
    console.timeEnd('calc');
    console.log('============= DONE =============');
} catch (error) {
    console.error(`main - catch error: ${error.message}`);
}
