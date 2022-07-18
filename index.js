import db from './helper/db.js';
import { readAllFile } from './file-handler/index.js';
import { calRRAO, calDRC, calDeltaFx, calVegaFx } from './calculate/index.js';

try {
    await readAllFile();
    // const RRAO = calRRAO();
    // const DRC = calDRC();
    // const deltaFx = calDeltaFx();
    const vegaFx = calVegaFx();
    console.log('============= DONE =============');
} catch (error) {
    console.error(`main - catch error: ${error.message}`);
}
