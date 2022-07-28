import { default as readXlsxFile, readSheetNames } from 'read-excel-file/node';

import db from '../helper/db.js';
import { FILE_HASHMAP, HASHMAP_KEY, SHEET_NAMES, SHEET_NAMES_HASHMAP } from '../common/enum.js';
import { mappingDataDeal } from '../mapper/index.js';
import { schemaXlsx } from '../schema/index.js';

async function readFileXlsxBySheetName(pathFile, sheet) {
    const fullSheetName = SHEET_NAMES_HASHMAP[sheet];
    const schema = schemaXlsx[fullSheetName];
    const { errors, rows } = await readXlsxFile(pathFile, { sheet, schema });

    if (errors.length) {
        throw new Error(JSON.stringify(errors[0]));
    }

    const hashmapKey = HASHMAP_KEY[fullSheetName];
    db.data[fullSheetName] = rows;
    db.data[FILE_HASHMAP[fullSheetName]] = rows.reduce((obj, row) => {
        if (!obj[row[hashmapKey]]) {
            obj[row[hashmapKey]] = row;
        }

        return obj;
    }, {});
}

export async function readFileXlsx(pathFile = './data/input/Data-b3 (5) (4).xlsx') {
    try {
        const sheetNames = await readSheetNames(pathFile);

        for (const sheetName of SHEET_NAMES) {
            if (!sheetNames.includes(sheetName)) {
                throw new Error(`Missing ${sheetName} sheet in file`);
            }
            await readFileXlsxBySheetName(pathFile, sheetName);
        }
        db.write();
        mappingDataDeal();
        console.log(1);
    } catch (error) {
        console.error(error.message);
    }
}
