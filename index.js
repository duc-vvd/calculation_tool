import db from './helper/db.js';
import { readAllFile } from './file-handler/index.js';
import { calSaMr, calAddOnUnmargined1111FX } from './calculate/index.js';

try {
    await readAllFile();
    console.time('calc');
    const saMr = calSaMr();
    const addOnUnmargined1111FX = calAddOnUnmargined1111FX();
    console.timeEnd('calc');
    console.log('============= DONE =============');
} catch (error) {
    console.error(`main - catch error: ${error.message}`);
}
