import formidable from 'formidable';
import { v4 as uuid } from 'uuid';

import errorCode from '../../common/error-code.js';
import uploadChunks from './upload-chunks.js';
import uploadComplete from './upload-complete.js';
import uploadFile from './upload-file.js';

function parseRequest(req, res, next) {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: './data/input',
            keepExtensions: true,
            multiples: true,
            filename: (name, ext) => `${name}${ext}`,
        });
        if (!req.headers['content-type'].startsWith('multipart/form-data;')) {
            const msg = `Error upload file, invalid content-type ${JSON.stringify({
                'content-type': req.headers['content-type'],
            })}`;
            console.error(msg);
            return res.send({ ErrorCode: errorCode.DATA_INVALID, Data: msg, Success: false });
        }
        form.parse(req, (err, fields, files) => {
            if (err) {
                const msg = `There was an error parsing the files: ${JSON.stringify(err.message)}`;
                console.error(msg);
                return res.send({ ErrorCode: errorCode.DATA_INVALID, Data: msg, Success: false });
            }
            req.body = { ...fields };
            req.body.images = [];
            for (const key in files) {
                const element = files[key];
                if (element?.filepath) {
                    req.body.images.push({
                        fileName: element.originalFilename,
                        filepath: element.filepath,
                    });
                }
            }
            return next();
        });
    } catch (error) {
        console.error(`file - parseRequest - catch error: ${error.message}`);
        res.send({ ErrorCode: errorCode.DATA_INVALID, Data: error.message, Success: false });
    }
}
// http://localhost:5000/api/file/upload-complete?originFileName=data+(1).xlsx&fileGuid=376870dc-0b7a-4a6b-812d-68d2ce40245c.xlsx&reportName=423
export default function (app, domain) {
    app.post(`${domain}/upload-chunks`, uploadChunks);
    app.post(`${domain}/upload-complete`, uploadComplete);
    app.post(`${domain}`, parseRequest, uploadFile);
}
