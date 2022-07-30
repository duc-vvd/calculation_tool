import fs from 'fs';
import errorCode from '../../common/error-code.js';
import { ROLE_NAME } from '../../common/enum.js';
import { isHasRole } from '../../helper/utils.js';
import { getUserNameAndFullNameInToken } from '../../user/index.js';
import { TEMP_FILE_PATH } from '../../common/index.js';

export default async function (req, res) {
    try {
        const { usernameInToken, fullName } = getUserNameAndFullNameInToken(req) || {};
        req.usernameInToken = usernameInToken;
        req.fullName = fullName;

        if (!(await isHasRole(usernameInToken, ROLE_NAME.UPLOAD_FILE))) {
            return res.send({
                ErrorCode: errorCode.PERMISSION_DENIED,
                Success: false,
            });
        }

        const { fileName } = req.query;
        if (!fileName) {
            const msg = `missing fileName query`;
            console.error(msg);
            return res.send({ ErrorCode: errorCode.DATA_INVALID, Data: msg, Success: false });
        }
        const path = `${TEMP_FILE_PATH}/${req.query.fileName}`;
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
