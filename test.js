import db from './helper/db.js';
import { readAllFile } from './file-handler/index.js';
import { readFileXlsx } from './helper/file-utils.js';
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
    calSMAOR,
} from './calculate/index.js';

try {
    // await readAllFile();
    await readFileXlsx('/home/ducvu/Documents/work/calculation_tool/dataExample/Data-b3 (5) (4).xlsx');
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
    const SMAOR = calSMAOR();
    console.log({ saMr, EAD, CVA, SMAOR });

    // {
    //     saMr: 1062462084555.7852,
    //     EAD: 50521176062.94285,
    //     CVA: 819557752.7572119,
    //     SMAOR: { sma_or: 5.898159161151159, sma_or_vnd: 167991369227.90732 }
    // }
    console.timeEnd('calc');
    console.log('============= DONE =============');
} catch (error) {
    console.error(`main - catch error: ${error.message}`);
}
