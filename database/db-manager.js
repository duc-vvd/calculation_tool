import * as db from './db/index.js';
import { TABLE_NAME, ENTITY_ACTION, OPERATOR } from '../common/enum.js';

export function createListReports(data) {
    return new Promise((resolve, reject) => {
        db.exec(
            {
                action: ENTITY_ACTION.INSERT_BATCH,
                table: TABLE_NAME.REPORT,
                data,
            },
            (data, err) => {
                if (err) {
                    const errMess = `createListReports - error: ${err}`;
                    console.error(errMess);
                    return reject(new Error(errMess));
                }
                resolve(data);
            },
        );
    });
}

export function isFileExisted(fileName) {
    return new Promise((resolve) => {
        db.exec(
            {
                action: ENTITY_ACTION.SELECT,
                table: TABLE_NAME.FILE,
                condition: {
                    descriptors: [
                        {
                            field: 'file_name',
                            opt: OPERATOR.EQUAL,
                            val: fileName,
                        },
                    ],
                },
            },
            (data, err) => {
                if (err) {
                    const errMess = `isFileExisted - error: ${err}`;
                    console.error(errMess);
                    return resolve(true);
                }
                resolve(data?.length > 0);
            },
        );
    });
}

export function createFile(data) {
    return new Promise((resolve) => {
        db.exec(
            {
                action: ENTITY_ACTION.INSERT,
                table: TABLE_NAME.FILE,
                data,
            },
            (data, err) => {
                if (err) {
                    const errMess = `createFile - error: ${err}`;
                    console.error(errMess);
                    return reject(new Error(errMess));
                }
                resolve(data);
            },
        );
    });
}

export function createActionLogs(data) {
    return new Promise((resolve) => {
        db.exec(
            {
                action: ENTITY_ACTION.INSERT,
                table: TABLE_NAME.ACTION_LOGS,
                data,
            },
            (data, err) => {
                if (err) {
                    const errMess = `createActionLogs - error: ${err}`;
                    console.error(errMess);
                    return reject(new Error(errMess));
                }
                resolve(data);
            },
        );
    });
}

export function getUserInfoByUserName(userName) {
    return new Promise((resolve) => {
        db.exec(
            {
                action: ENTITY_ACTION.SELECT,
                table: TABLE_NAME.USER_INFO,
                condition: {
                    descriptors: [
                        {
                            field: 'username',
                            opt: OPERATOR.EQUAL,
                            val: userName,
                        },
                    ],
                },
            },
            (data, err) => {
                if (err) {
                    const errMess = `getUserInfoByUserName - error: ${err}`;
                    console.error(errMess);
                    return resolve();
                }
                resolve(data?.[0]);
            },
        );
    });
}

export function getRoleGroupByRoleGroupId(roleGroupId) {
    return new Promise((resolve) => {
        db.exec(
            {
                action: ENTITY_ACTION.SELECT,
                table: TABLE_NAME.ROLE_GROUP,
                condition: {
                    descriptors: [
                        {
                            field: 'role_group_id',
                            opt: OPERATOR.EQUAL,
                            val: roleGroupId,
                        },
                    ],
                },
            },
            (data, err) => {
                if (err) {
                    const errMess = `getRoleGroupByRoleGroupId - error: ${err}`;
                    console.error(errMess);
                    return resolve();
                }
                resolve(data?.[0]);
            },
        );
    });
}
