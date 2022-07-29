import writeXlsxFile from 'write-excel-file/node';

async function exportSAMR(inputData, reportName) {
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
}
