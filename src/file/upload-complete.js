import fs from 'fs';
import errorCode from '../../common/error-code.js';
import { readFileXlsx, exportSAMR, exportEAD, exportCVA, exportSAMOR } from '../../helper/file-utils.js';
import { calSaMr, calEAD, calCVA, calSMAOR } from '../../calculate/index.js';

function move(oldPath, newPath, callback) {
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

function moveAsync(oldPath, newPath) {
    return new Promise((resolve, reject) => {
        move(oldPath, newPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

export default async function (req, res) {
    try {
        const { originFileName, fileGuid, reportName } = req.query;
        var oldPath = `${process.cwd()}/data/temp/${fileGuid}`;
        var newPath = `${process.cwd()}/data/input/${originFileName}`;

        moveAsync(oldPath, newPath);
        await readFileXlsx(newPath);

        const SAMRData = calSaMr();
        const EADData = calEAD();
        const CVAData = calCVA();
        const SMAORData = calSMAOR();
        console.log({ SAMRData, EAD: EADData, CVA: CVAData, SMA_OR: SMAORData });

        const reportDetailSAMR = await exportSAMR(SAMRData, reportName, `${reportName}_DETAIL_SA_MR.xlsx`);

        const reportEAD = await exportEAD(EADData, reportName, `${reportName}_DETAIL_EAD.xlsx`);

        const reportCVA = await exportCVA(CVAData, reportName, `${reportName}_DETAIL_CVA.xlsx`);

        const reportSAMOR = await exportSAMOR(SMAORData, reportName, `${reportName}_DETAIL_SAM_OR.xlsx`);

        res.send({
            Data: {
                Result: 0.0,
                C: 0.0,
                RWA: { RWA_CCR: 0.0, RWA_CR: 0.0, RWA_Total: 0.0 },
                K_OR: 0.0,
                K_MR: {
                    K_IRR: { K_SRW: 0.0, K_GRW: 0.0 },
                    K_FX: 0.0,
                    K_OPT: { K_L_OPT: 0.0, K_LC_OPT: 0.0, K_S_OPT: 0.0, Total: 0.0 },
                    K_Equity: 0.0,
                    K_CMR: 0.0,
                },
                SA_MR: SAMRData,
                EAD: EADData,
                CVA: CVAData,
                SMA_OR: SMAORData,
            },
            Success: true,
            ErrorCode: errorCode.SUCCESS,
        });
    } catch (error) {
        const msg = `upload-complete - catch error: ${error?.message || JSON.stringify({ error })}`;
        console.error(msg);
        res.send({ ErrorCode: errorCode.UNKNOWN_ERROR, Data: msg, Success: false });
    }
}
