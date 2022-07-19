import db from './helper/db.js';
import { readAllFile } from './file-handler/index.js';
import { calSaMr } from './calculate/index.js';

try {
    await readAllFile();
    console.time('calc');
    const saMr = calSaMr();
    console.timeEnd('calc');
    console.log('============= DONE =============');
} catch (error) {
    console.error(`main - catch error: ${error.message}`);
}
