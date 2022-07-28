import fs from 'fs';
import errorCode from '../../common/error-code.js';

export default function (req, res) {
    try {
        const { fileName } = req.query;
        if (!fileName) {
            const msg = `missing fileName query`;
            console.error(msg);
            return res.send({ ErrorCode: errorCode.DATA_INVALID, Data: msg, Success: false });
        }
        const path = `${process.cwd()}/data/temp/${req.query.fileName}`;
        var writeStream = fs.createWriteStream(path, { flags: 'a' });
        req.pipe(writeStream, { end: false });
        req.on('end', function () {
            res.send({ Data: null, Success: true });
        });
    } catch (error) {
        console.error(`file - upload-chunks - catch error: ${error.message}`);
        res.send({ ErrorCode: errorCode.DATA_INVALID, Data: error.message, Success: false });
    }
}
