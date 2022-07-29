
import * as enumValue from './common/enum.js'
import * as db from './mysql/db.js'
import * as db_sql from './mysql/db_sql.js'

let is_db_processing = false;
let lstQueryPending = null;
let lstStorePending = null;

const interValCheckDbProcess = setInterval(function res() {
    console.info(`timer_get_db: ${is_db_processing}`);
    if (is_db_processing) {
        if (lstQueryPending) {
            console.info('co list query pending');
            for (const key in lstQueryPending) {
                if (Reflect.has(lstQueryPending, key)) {
                    const element = lstQueryPending[key];
                    db.exec(element.query, (data, err) => {
                        element.cb(data, err);
                    });
                }
            }
            lstQueryPending = null;
        }
        if (lstStorePending) {
            console.info('co list store pending');
            for (const key in lstStorePending) {
                if (Reflect.has(lstStorePending, key)) {
                    const element = lstStorePending[key];
                    db.run(element.store.name, element.store.params, (data, err) => {
                        element.cb(data, err);
                    });
                }
            }
            lstStorePending = null;
        }
        if (!lstQueryPending && !lstStorePending) {
            clearInterval(interValCheckDbProcess);
        }
    }
}, 2 * 1000);

export function execStringQuery(strQuery, callback) {
    try {
        if (!strQuery) return callback();
        db_sql.executeTransaction(strQuery, function res(data, err) {
            if (err) {
                return callback(null, enumValue.ERROR_CODE.ExecuteTransaction);
            }
            return callback(data, null);
        });
    } catch (error) {
        console.error(error, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
};

export function exec(lstQuery, callback, removeLog) {
    try {
        // lstQuery la 1 list, trong do moi item gom cac property sau:
        // action: ENTITY_ACTION: INSERT, UPDATE, DELETE, SELECT
        // table: ten bang (*)
        // fields: danh sach cac fields can lay, = null mac dinh lay *
        // condition: dieu kien, view Readme
        // order_by: {field: "field can sort", type: "asc/desc"}
        // item_count: so ban ghi can lay
        // data: object data for INSERT, UPDATE (only INSERT, UPDATE)

        if (lstQuery.action === enumValue.ENTITY_ACTION.GET_PAGGING) {
            db.execPaging(lstQuery, (data, err) => {
                callback(data, err);
            });
        } else if (lstQuery.action === enumValue.ENTITY_ACTION.GET_PAGGING_UNION) {
            db.execPagingUnion(lstQuery, (data, err) => {
                callback(data, err);
            });
        } else if (lstQuery.action === enumValue.ENTITY_ACTION.INSERT_BATCH) {
            db.execInsertBatch(lstQuery, (data, err) => {
                callback(data, err);
            });
        } else {
            db.exec(lstQuery, (data, err) => {
                callback(data, err);
            }, removeLog);
        }
    } catch (error) {
        console.error(error, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
};

export function run(store_name, params, callback) {
    try {
        // store_name: ten store procedure
        // params: list params
        if (!is_db_processing) {
            console.info('not init db on run');
            // chua init db thi init
            if (!lstStorePending) {
                lstStorePending = [];
            }
            const timeCurrent = Date.now();
            lstStorePending[timeCurrent] = {
                store: {
                    name: store_name,
                    params
                },
                cb: callback
            };
            return;
        }
        db.run(store_name, params, (data, err) => {
            callback(data, err);
        });
    } catch (error) {
        console.error(error, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
};

export function runAsync(store_name, params) {
    return new Promise((resolve, reject) => {
        run(store_name, params, (data, err) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
};

export function buildQuery(query) { return db.buildQuery(query); }