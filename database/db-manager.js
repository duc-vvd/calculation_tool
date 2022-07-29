import * as db from './db/index.js';
import { TABLE_NAME, ENTITY_ACTION, OPERATOR } from '../common/enum.js'

export function createListReports(data) {
    return new Promise((resolve, reject) => {
        db.exec({
            action: ENTITY_ACTION.INSERT,
            table: TABLE_NAME.REPORT,
            data
        }, (data, err) => {
            if (err) {
                const errMess = `createListReports - error: ${err}`;
                console.error(errMess)
                return reject(new Error(errMess))
            }
            resolve(data);
        })
    })
}

export function isFileExisted(fileName) {
    return new Promise((resolve) => {
        db.exec({
            action: ENTITY_ACTION.SELECT,
            table: TABLE_NAME.FILE,
            condition: {
                descriptors: [
                    {
                        field: "file_name",
                        opt: enumValue.OPERATOR.EQUAL,
                        val: fileName
                    }
                ]
            }
        }, (data, err) => {
            if (err) {
                const errMess = `isFileExisted - error: ${err}`;
                console.error(errMess)
                return resolve(true);
            }
            resolve(data?.length > 0);
        })
    })
}

export function createFile(data) {
    return new Promise((resolve) => {
        db.exec({
            action: ENTITY_ACTION.INSERT,
            table: TABLE_NAME.FILE,
            data
        }, (data, err) => {
            if (err) {
                const errMess = `createFile - error: ${err}`;
                console.error(errMess)
                return reject(new Error(errMess))
            }
            resolve(data);
        })
    })
}

export function createActionLogs(data) {
    return new Promise((resolve) => {
        db.exec({
            action: ENTITY_ACTION.INSERT,
            table: TABLE_NAME.ACTION_LOGS,
            data
        }, (data, err) => {
            if (err) {
                const errMess = `createActionLogs - error: ${err}`;
                console.error(errMess)
                return reject(new Error(errMess))
            }
            resolve(data);
        })
    })
}