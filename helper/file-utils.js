import { default as readXlsxFile, readSheetNames } from 'read-excel-file/node';
import writeXlsxFile from 'write-excel-file/node';

import db from './db.js';
import { getCurrentTimeSql } from './utils.js';
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

export async function readFileXlsx(pathFile) {
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

function createReportDetail(fileName, reportName) {
    return {
        file_name: fileName,
        report_name: reportName,
        path: '/output/' + reportName,
        created: getCurrentTimeSql(),
    };
}

export async function exportSAMR(inputData, fileName, reportName) {
    const data = [
        [
            {
                value: 'Level',
                fontWeight: 'bold',
            },
            {
                value: 'Value',
                fontWeight: 'bold',
            },
        ],
        [
            {
                type: String,
                value: 'DRC',
            },
            {
                type: Number,
                value: inputData.DRC,
            },
        ],
        [
            {
                type: String,
                value: 'RRAO',
            },
            {
                type: Number,
                value: inputData.RRAO,
            },
        ],
        [
            {
                type: String,
                value: 'Delta',
            },
            {
                type: Number,
                value: inputData.Delta,
            },
        ],
        [
            {
                type: String,
                value: 'Vega',
            },
            {
                type: Number,
                value: inputData.Vega,
            },
        ],
        [
            {
                type: String,
                value: 'Curvature',
            },
            {
                type: Number,
                value: inputData.Curvature,
            },
        ],
        [
            {
                value: 'Total',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.Total,
            },
        ],
    ];

    await writeXlsxFile(data, {
        filePath: `${process.cwd()}/data/output/${reportName}`,
    });

    return createReportDetail(fileName, reportName);
}

export async function exportEAD(inputData, fileName, reportName) {
    const data = [
        [
            {
                value: 'EAD',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.EAD,
                fontWeight: 'bold',
            },
        ],
        [
            {
                type: String,
                value: 'EAD of unmargined transactions',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.EAD_of_unmargined_transactions,
                fontWeight: 'bold',
            },
        ],
        [
            {
                type: String,
                value: 'EAD_unmargined_1111',
            },
            {
                type: Number,
                value: inputData.EAD_unmargined_1111,
            },
        ],
        [
            {
                type: String,
                value: 'EAD_unmargined_1113',
            },
            {
                type: Number,
                value: inputData.EAD_unmargined_1113,
            },
        ],
        [
            {
                type: String,
                value: 'EAD_unmargined_1114',
            },
            {
                type: Number,
                value: inputData.EAD_unmargined_1114,
            },
        ],
        [
            {
                type: String,
                value: 'EAD_unmargined_1115',
            },
            {
                type: Number,
                value: inputData.EAD_unmargined_1115,
            },
        ],
        [
            {
                value: 'EAD of margined transactions',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.EAD_of_margined_transactions,
                fontWeight: 'bold',
            },
        ],
        [
            {
                type: String,
                value: 'EAD_margined_1112',
            },
            {
                type: Number,
                value: inputData.EAD_margined_1112,
            },
        ],
    ];

    await writeXlsxFile(data, {
        filePath: `${process.cwd()}/data/output/${reportName}`,
    });

    return createReportDetail(fileName, reportName);
}

export async function exportCVA(inputData, fileName, reportName) {
    const data = [
        [
            {
                value: 'Сomponent',
                fontWeight: 'bold',
            },
            {
                value: 'Value',
                fontWeight: 'bold',
            },
        ],
        [
            {
                type: String,
                value: 'Capital requirements (reduced)',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.capital_requirements,
                fontWeight: 'bold',
            },
        ],
        [
            {
                type: String,
                value: 'Discount scalar',
            },
            {
                type: Number,
                value: inputData.discount_scalar,
            },
        ],
        [
            {
                type: String,
                value: 'K Reduced',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.k_reduced,
                fontWeight: 'bold',
            },
        ],
        [
            {
                type: String,
                value: 'Systematic components of CVA risk',
            },
            {
                type: Number,
                value: inputData.systematic_components_of_cva_risk,
            },
        ],
        [
            {
                type: String,
                value: 'Idiosyncratic components of CVA risk',
            },
            {
                type: Number,
                value: inputData.idiosyncratic_components_of_cva_risk,
            },
        ],
        [
            {
                type: String,
                value: 'Sum of SCVA over counterparties',
            },
            {
                type: Number,
                value: inputData.sum_of_scva_over_counterparties,
            },
        ],
        [
            {
                type: String,
                value: 'Sum of SCVA-squared over counterparties',
            },
            {
                type: Number,
                value: inputData.sum_of_scva_squared_over_counterparties,
            },
        ],
        [
            {
                type: String,
                value: 'Supervisory correlation',
            },
            {
                type: Number,
                value: inputData.supervisory_correlation,
            },
        ],
    ];

    await writeXlsxFile(data, {
        filePath: `${process.cwd()}/data/output/${reportName}`,
    });

    return createReportDetail(fileName, reportName);
}

export async function exportSAMOR(inputData, fileName, reportName) {
    const data = [
        [
            {
                type: String,
                value: 'Unadjusted Business Indicator',
            },
            {
                type: String,
                value: 'uBI',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.uBI,
            },
        ],
        [
            {
                type: String,
                value: 'Interest, Lease and dividend component',
            },
            {
                type: String,
                value: 'IDLC',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.IDLC,
            },
        ],
        [
            {
                type: String,
                value: 'Service component',
            },
            {
                type: String,
                value: 'SC',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.SC,
            },
        ],
        [
            {
                type: String,
                value: 'Financial Component',
            },
            {
                type: String,
                value: 'FC',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.FC,
            },
        ],
        [
            {
                type: String,
                value: 'Business Indicator',
            },
            {
                type: String,
                value: 'BI',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.BI,
            },
        ],
        [
            {
                type: String,
                value: 'BI Component',
            },
            {
                type: String,
                value: 'BI_Component',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.BI_Component,
            },
        ],
        [
            {
                type: String,
                value: 'Loss component',
            },
            {
                type: String,
                value: 'Loss_Component',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.Loss_Component,
            },
        ],
        [
            {
                type: String,
                value: 'ILM',
            },
            {
                type: String,
                value: 'ILM',
                fontWeight: 'bold',
            },
            {
                type: Number,
                value: inputData.ILM,
            },
        ],
        [
            {
                type: String,
                value: 'Capital required for OR under SMA (Mil.€)',
                fontWeight: 'bold',
            },
            {},
            {
                type: Number,
                value: inputData.SMA_OR,
                fontWeight: 'bold',
            },
        ],
        [
            {
                type: String,
                value: 'Capital required for OR under SMA (VND)',
                fontWeight: 'bold',
            },
            {},
            {
                type: Number,
                value: inputData.SMA_OR_VND,
                fontWeight: 'bold',
            },
        ],
    ];

    await writeXlsxFile(data, {
        filePath: `${process.cwd()}/data/output/${reportName}`,
    });

    return createReportDetail(fileName, reportName);
}
