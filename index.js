import db from './helper/db.js';
import { readAllFile } from './file-handler/index.js';
import {
    calRRAO,
    calDRC,
    calDeltaFx,
    calVegaFx,
    calDeltaGirr,
    calVegaGirr,
    calCurvatureFx,
    calCurvatureGirr,
} from './calculate/index.js';

try {
    await readAllFile();
    // const RRAO = calRRAO();
    // const DRC = calDRC();
    // const deltaFx = calDeltaFx();
    // const vegaFx = calVegaFx();
    // const deltaGirr = calDeltaGirr();
    // const vegaGirr = calVegaGirr();
    // const curvatureFx = calCurvatureFx();
    const curvatureGirr = calCurvatureGirr();
    console.log('============= DONE =============');
} catch (error) {
    console.error(`main - catch error: ${error.message}`);
}
