import db from './helper/db.js';
import { readAllFile } from './file-handler/index.js';
import { calRRAO, calDRC } from './calculate/index.js';

try {
    await readAllFile();
    const RRAO = calRRAO();
    const DRC = calDRC();
    console.log('============= DONE =============');
} catch (error) {
    console.error(`main - catch error: ${error.message}`);
}
