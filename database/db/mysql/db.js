import mysql from 'mysql';
import clone from 'clone';
import * as db_sql from './db_sql.js';

import * as enumValue from '../common/enum.js';
import * as utils from './utils.js';

const MAX_ITEMS_BATCH = 30000;

export function run(store_name, params, cb) {
    try {
        if (!store_name) {
            return cb();
        }
        db_sql.executeProcedure(store_name, params, function res(data, err) {
            if (err) {
                return cb(null, enumValue.ERROR_CODE.UNKNOWN_ERROR);
            }
            return cb(data, null);
        });
    } catch (error) {
        console.error(`DB: run: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
        return cb(null, enumValue.ERROR_CODE.UNKNOWN_ERROR);
    }
}

export function exec(queryInput, cb, removeLog) {
    try {
        // cb: data,err
        let lstReturn = '';
        if (!queryInput) {
            return cb(null, enumValue.ERROR_CODE.QueryInput);
        }
        let lstQuery = queryInput;
        if (!Array.isArray(queryInput)) {
            lstQuery = [queryInput];
        }
        if (!lstQuery.length) {
            return cb(null, enumValue.ERROR_CODE.QueryInput_LENGTH);
        }
        const len = lstQuery.length;
        for (let index = 0; index < len; index++) {
            const element = lstQuery[index];

            // format number when validate data
            if (!element.action || !element.table) {
                return cb(null, enumValue.ERROR_CODE.INVALID_SCHEMA);
            }
            const queryBuilder = buildQuery(element);
            if (!queryBuilder) {
                return cb(null, enumValue.ERROR_CODE.QUERY_BUILDER_NULL);
            }
            if (lstReturn !== '') lstReturn += ';';
            lstReturn += queryBuilder;
        }
        if (lstReturn) {
            db_sql.executeTransaction(
                lstReturn,
                function res(data, err) {
                    if (err) {
                        return cb(null, enumValue.ERROR_CODE.ExecuteTransaction);
                    }
                    return cb(data, null);
                },
                removeLog,
            );
        } else {
            return cb(null, enumValue.ERROR_CODE.LSTQUERY_NULL);
        }
    } catch (error) {
        console.error(`EXECUTE_QUERY: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
        return cb(null, enumValue.ERROR_CODE.UNKNOWN_ERROR);
    }
}

export function execPaging(queryInput, cb) {
    const returnObj = {
        total_count: 0,
        total_pages: 0,
        current_page: 0,
        data: [],
    };
    try {
        if (!queryInput) {
            return cb(returnObj, enumValue.ERROR_CODE.QueryInput);
        }
        const query = clone(queryInput);
        const itemPerPage = query.item_count;
        const index = query.current_page;
        query.action = enumValue.ENTITY_ACTION.GET_COUNT;

        // lay ra count truoc
        const queryCount = buildQuery(query);
        if (!queryCount) {
            return cb(returnObj, enumValue.ERROR_CODE.QUERY_BUILDER_NULL);
        }
        db_sql.executeTransaction(queryCount, (data, err) => {
            if (err || !data || data.length < 0) {
                return cb(returnObj, enumValue.ERROR_CODE.ExecuteTransaction);
            }
            const totalCount = data[0].total_count;
            const totalPage = totalCount / itemPerPage;
            let totalPageR = Math.round(totalPage);
            if (totalPageR < totalPage) {
                totalPageR += 1;
            }
            let currentPage = index;
            if (currentPage < 0) {
                currentPage = totalPageR;
            }
            returnObj.total_count = totalCount;
            returnObj.total_pages = totalPageR;
            returnObj.current_page = currentPage;

            if (totalCount <= 0) {
                return cb(returnObj);
            }
            const fromIndex = returnObj.current_page > 0 ? returnObj.current_page - 1 : 0;
            query.action = enumValue.ENTITY_ACTION.GET_PAGGING;
            query.current_page = fromIndex * itemPerPage;
            const querryPaging = buildQuery(query);
            if (!querryPaging) {
                return cb(returnObj, enumValue.ERROR_CODE.QUERY_BUILDER_NULL);
            }
            db_sql.executeTransaction(querryPaging, (data1, err1) => {
                if (err1 || !data1 || data1.length < 0) {
                    return cb(returnObj, enumValue.ERROR_CODE.ExecuteTransaction);
                }
                returnObj.data = data1;
                return cb(returnObj);
            });
        });
    } catch (error) {
        console.error(`EXECUTE_PAGGING: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
        return cb(returnObj, enumValue.ERROR_CODE.UNKNOWN_ERROR);
    }
}

export function execPagingUnion(queryInput, cb) {
    const returnObj = {
        total_count: 0,
        total_pages: 0,
        current_page: 0,
        data: [],
    };
    try {
        if (!queryInput) {
            return cb(returnObj, enumValue.ERROR_CODE.QueryInput);
        }
        const query = clone(queryInput);

        const itemPerPage = query.item_count;
        const index = query.current_page;
        query.action = enumValue.ENTITY_ACTION.GET_COUNT;
        // lay ra count truoc
        const listUnion = [];
        for (let i = 0; i < query.table.length; i++) {
            const table = query.table[i];
            const queryPertable = clone(query);
            queryPertable.table = table;
            const queryBuild = buildQuery(queryPertable);
            listUnion.push(`(${queryBuild})`);
        }
        const unionQuery = listUnion.join(' UNION ALL ');
        const querySumTotal = `SELECT SUM(total_count) total_count FROM (${unionQuery}) AS ALL_ITEMS`;
        db_sql.executeTransaction(querySumTotal, (data, err) => {
            if (err || !data || data.length < 0) {
                return cb(returnObj, enumValue.ERROR_CODE.ExecuteTransaction);
            }
            const totalCount = data[0].total_count;
            const totalPage = totalCount / itemPerPage;
            let totalPageR = Math.round(totalPage);
            if (totalPageR < totalPage) {
                totalPageR += 1;
            }
            let currentPage = index;
            if (currentPage < 0) {
                currentPage = totalPageR;
            }
            returnObj.total_count = totalCount;
            returnObj.total_pages = totalPageR;
            returnObj.current_page = currentPage;

            if (totalCount <= 0) {
                return cb(returnObj);
            }
            const fromIndex = returnObj.current_page > 0 ? returnObj.current_page - 1 : 0;
            query.action = enumValue.ENTITY_ACTION.GET_PAGGING;
            query.current_page = fromIndex * itemPerPage;

            const listUnionPaging = [];
            for (let i = 0; i < query.table.length; i++) {
                const table = query.table[i];
                const queryPertable = clone(query);
                queryPertable.table = table;
                queryPertable.is_union = true;
                const queryBuild = buildQuery(queryPertable);
                listUnionPaging.push(`(${queryBuild})`);
            }
            const unionQueryPaging = listUnionPaging.join(' UNION ALL ');
            const order_by = query.order_by;
            const current_page = query.current_page;
            const item_count = query.item_count;
            let queryPaging = `SELECT * FROM (${unionQueryPaging}) AS ALL_ITEMS`;
            if (order_by && order_by.field) {
                queryPaging += ` ORDER BY ${order_by.field}`;
                if (order_by.type) {
                    queryPaging += ` ${order_by.type}`;
                }
            } else if (query.field_count) {
                queryPaging += ` ORDER BY ${query.field_count}`;
            }
            queryPaging += ` LIMIT ${current_page}, ${item_count}`;
            db_sql.executeTransaction(queryPaging, (data1, err1) => {
                if (err1 || !data1 || data1.length < 0) {
                    return cb(returnObj, enumValue.ERROR_CODE.ExecuteTransaction);
                }
                returnObj.data = data1;
                return cb(returnObj);
            });
        });
    } catch (error) {
        console.error(`EXECUTE_PAGGING_UNION: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
        return cb(returnObj, enumValue.ERROR_CODE.UNKNOWN_ERROR);
    }
}

export function execInsertBatch(queryInput, cb) {
    try {
        if (!queryInput) {
            return cb(null, enumValue.ERROR_CODE.QueryInput);
        }
        if (!queryInput.table) {
            return cb(null, enumValue.ERROR_CODE.QueryInput);
        }

        const firstValue = queryInput.data[0];
        const fields = getFields(firstValue, true).strProp;
        const tableName = queryInput.table;
        const listValue = [];
        const len = queryInput.data.length;
        for (let index = 0; index < len; index++) {
            const data = queryInput.data[index];
            // format number when validate data
            if (!data) continue;

            const queryBuilder = getFields(data, false).strVal;
            if (!queryBuilder) {
                return cb(null, enumValue.ERROR_CODE.QUERY_BUILDER_NULL);
            }
            listValue.push(queryBuilder);
        }

        if (listValue) {
            const valueInsert = queryInput.max_item_batch || MAX_ITEMS_BATCH;
            const listBatch = utils.splitArray(listValue, valueInsert);
            const listPromise = [];
            for (let i = 0; i < listBatch.length; i++) {
                const listArr = listBatch[i];
                const listData = listArr.join(',');
                const query = `INSERT INTO ${tableName} (${fields}) VALUES ${listData}`;
                listPromise.push(
                    new Promise((resolve) => {
                        db_sql.executeTransaction(query, function res(data, err) {
                            if (err) {
                                return resolve(null, enumValue.ERROR_CODE.ExecuteTransaction);
                            }
                            return resolve(data, null);
                        });
                    }),
                );
            }
            Promise.all(listPromise).then((lstValue) => {
                return cb(lstValue);
            });
        } else {
            return cb(null, enumValue.ERROR_CODE.LSTQUERY_NULL);
        }
    } catch (error) {
        console.error(`INSERT_BATCH: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
        return cb(null, enumValue.ERROR_CODE.UNKNOWN_ERROR);
    }
}

function getFields(data, isGetProp) {
    try {
        let strProp = '';
        let strVal = '';
        for (const key in data) {
            if (!Reflect.has(data, key)) continue;
            const val = data[key];
            if (isGetProp) {
                if (strProp !== '') strProp += ',';
                strProp += key;
            }
            if (strVal !== '') strVal += ',';
            if (val === null || val === undefined) {
                strVal += `null`;
                continue;
            }
            if (typeof val === 'string') {
                strVal += replaceString(val);
            } else {
                strVal += val;
            }
        }
        return {
            strProp,
            strVal: `(${strVal})`,
        };
    } catch (error) {
        console.error(`DB: getInsertSql: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
    return null;
}

export function buildQuery(option) {
    // gen ra build query theo tung type db
    if (!option.action) {
        return false;
    }
    if (option.action === enumValue.ENTITY_ACTION.SELECT) {
        return getSelectSQl(option);
    }
    if (option.action === enumValue.ENTITY_ACTION.GET_PAGGING) {
        return getPaggingSQl(option);
    }
    if (option.action === enumValue.ENTITY_ACTION.GET_COUNT) {
        return getCountSQl(option);
    }
    if (option.action === enumValue.ENTITY_ACTION.INSERT) {
        return getInsertSql(option);
    }
    if (option.action === enumValue.ENTITY_ACTION.INSERT_OR_UPDATE) {
        return getInsertOrUpdateSql(option);
    }
    if (option.action === enumValue.ENTITY_ACTION.UPDATE) {
        return getUpdateSql(option);
    }
    if (option.action === enumValue.ENTITY_ACTION.DELETE) {
        return getDelSql(option);
    }
    return null;
}

function getSelectSQl(option) {
    try {
        const { table, fields, condition, order_by, item_count } = option;
        if (!table) return null;
        let query = 'SELECT ';
        if (!fields || !fields.length || fields.length <= 0) {
            query += ' *';
        } else {
            const lstFields = fields.join(',');
            query += lstFields;
        }
        query += ` FROM ${table}`;
        if (condition) {
            const whereString = getCondition(condition);
            if (whereString) {
                query += ` WHERE ${whereString}`;
            }
        }
        if (order_by && order_by.field) {
            query += ` ORDER BY ${order_by.field}`;
            if (order_by.type) {
                query += ` ${order_by.type}`;
            }
        }
        if (item_count) {
            query += ` LIMIT ${item_count}`;
        }
        return query;
    } catch (error) {
        console.error(`DB: getSelectSQl: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
    return null;
}

function getPaggingSQl(option) {
    try {
        const { table, fields, condition, order_by, current_page, item_count, is_union, field_count } = option;
        if (!table) return null;
        let query = 'SELECT ';
        if (!fields || !fields.length || fields.length <= 0) {
            query += ' *';
        } else {
            const lstFields = fields.join(',');
            query += lstFields;
        }
        query += ` FROM ${table}`;
        if (condition) {
            const whereString = getCondition(condition, table);
            if (whereString) {
                query += ` WHERE ${whereString}`;
            }
        }
        if (order_by && order_by.field) {
            query += ` ORDER BY ${order_by.field}`;
            if (order_by.type) {
                query += ` ${order_by.type}`;
            }
        } else if (field_count) {
            query += ` ORDER BY ${field_count}`;
        }
        if (!is_union) query += ` LIMIT ${current_page}, ${item_count}`;
        return query;
    } catch (error) {
        console.error(`DB: getPaggingSQl: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
    return null;
}

function getCountSQl(option) {
    try {
        const { table, condition, field_count } = option;
        if (!table) return null;
        let query = `SELECT COUNT(*) total_count FROM ${table}`;
        if (field_count) {
            query = `SELECT COUNT(${field_count}) total_count FROM ${table}`;
        }
        if (condition) {
            const whereString = getCondition(condition, table);
            if (whereString) {
                query += ` WHERE ${whereString}`;
            }
        }
        return query;
    } catch (error) {
        console.error(`DB: getCountSQl: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
    return null;
}

function getInsertOrUpdateSql(option) {
    try {
        const { table, data } = option;
        if (!table || !data) return '';
        const props = [];
        const vals = [];
        for (const key in data) {
            // if (data[key] != null) {
            const val = data[key];
            // if (val != null) {
            props.push(key);
            vals.push(val);
            // }
            // }
        }
        if (props.length > 0 && vals.length > 0) {
            let strProp = '';
            let strVal = '';
            let strUpdate = '';
            for (let i = 0; i < props.length; i++) {
                if (strProp !== '') strProp += ',';
                if (strUpdate !== '') strUpdate += ',';
                strUpdate += `${props[i]}=`;
                strProp += props[i];
                if (strVal !== '') strVal += ',';
                if (vals[i] === null || vals[i] === undefined) {
                    strVal += 'null';
                    strUpdate += 'null';
                    continue;
                }
                if (typeof vals[i] === 'string') {
                    const replaceStr = replaceString(vals[i]);
                    strVal += replaceStr;
                    strUpdate += replaceStr;
                } else {
                    strVal += vals[i];
                    strUpdate += vals[i];
                }
            }
            return `INSERT INTO ${table}(${strProp}) VALUES(${strVal}) ON DUPLICATE KEY UPDATE ${strUpdate}`;
        }
    } catch (error) {
        console.error(`DB: getInsertSql: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
    return null;
}

function replaceString(strInput) {
    return mysql.escape(strInput);
}

function getInsertSql(option) {
    try {
        const { table, data } = option;
        if (!table || !data) return '';
        const props = [];
        const vals = [];
        // eslint-disable-next-line guard-for-in
        for (const key in data) {
            const val = data[key];
            props.push(key);
            vals.push(val);
        }
        if (props.length > 0 && vals.length > 0) {
            let strProp = '';
            let strVal = '';
            for (let i = 0; i < props.length; i++) {
                if (strProp !== '') strProp += ',';
                strProp += props[i];
                if (strVal !== '') strVal += ',';

                if (vals[i] === null || vals[i] === undefined) {
                    strVal += 'null';
                    continue;
                }
                if (typeof vals[i] === 'string') {
                    const replaceStr = replaceString(vals[i]);
                    strVal += replaceStr;
                } else {
                    strVal += vals[i];
                }
            }
            return `INSERT INTO ${table}(${strProp}) VALUES(${strVal})`;
        }
    } catch (error) {
        console.error(`DB: getInsertSql: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
    return null;
}

function getUpdateSql(option) {
    try {
        const { table, data, condition } = option;
        if (!table || !data) return '';
        const props = [];
        const vals = [];
        // eslint-disable-next-line guard-for-in
        for (const key in data) {
            const val = data[key];
            props.push(key);
            vals.push(val);
        }
        if (props.length > 0 && vals.length > 0) {
            let strUpdate = '';
            for (let i = 0; i < props.length; i++) {
                if (strUpdate !== '') strUpdate += ',';
                strUpdate += `${props[i]}=`;
                if (vals[i] === null || vals[i] === undefined) {
                    strUpdate += 'null';
                    continue;
                }
                if (typeof vals[i] === 'string') {
                    strUpdate += replaceString(vals[i]);
                } else {
                    strUpdate += vals[i];
                }
            }
            const whereString = getCondition(condition);
            if (whereString) {
                return `UPDATE ${table} SET ${strUpdate} WHERE ${whereString}`;
            }
            return `UPDATE ${table} SET ${strUpdate}`;
        }
    } catch (error) {
        console.error(`DB: getUpdateSql: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
    return null;
}

function getDelSql(option) {
    try {
        const { table, condition } = option;
        if (!table) return '';
        const whereString = getCondition(condition);
        if (whereString) {
            return `DELETE FROM ${table} WHERE ${whereString}`;
        }
        return `DELETE FROM ${table}`;
    } catch (error) {
        console.error(`DB: getDelSql: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
    return null;
}

export function getCondition(condition_Input, table) {
    // view readme for example condition
    try {
        const condition = condition_Input;
        if (!condition.descriptors) {
            return null;
        }
        if (!condition.logical) {
            condition.logical = enumValue.LOGICAL.AND;
        }

        const logical = condition.logical;
        const listDescriptor = condition.descriptors;
        const listCondition = [];
        for (let i = 0; i < listDescriptor.length; i++) {
            const descriptor = listDescriptor[i];
            const lstByPass = descriptor.by_pass_tbl;
            if (lstByPass && table && lstByPass.includes(table)) {
                continue;
            }
            if (!descriptor) continue;
            const oriOpt = enumValue.OPERATOR[descriptor.opt] || descriptor.opt;
            let conditionString = '';
            if (descriptor.logical) {
                conditionString = getCondition(descriptor, table);
            } else if (oriOpt === enumValue.OPERATOR.MATCH) {
                conditionString = `MATCH(${descriptor.field}) AGAINST (${getValueData(
                    descriptor.val,
                    descriptor.opt,
                    descriptor.sub_query,
                )} IN BOOLEAN MODE)`;
            } else if (Reflect.has(descriptor, 'val')) {
                conditionString = `${descriptor.field} ${oriOpt} ${getValueData(
                    descriptor.val,
                    descriptor.opt,
                    descriptor.sub_query,
                )}`;
            } else {
                conditionString = `${descriptor.field} ${oriOpt}`;
            }
            if (conditionString) {
                listCondition.push(conditionString);
            }
        }
        if (listCondition.length > 0) {
            return `(${listCondition.join(` ${logical} `)})`;
        }
    } catch (error) {
        console.error(`DB: getCondition: ${error}`, enumValue.HEALTH_CHECK_TYPE.BUSINESS);
    }
    return null;
}

function getValueData(valueInput, opt, is_sub) {
    if (valueInput === undefined) {
        return '';
    }
    if (is_sub) {
        return `(${getSelectSQl(valueInput)})`;
    }
    if (Array.isArray(valueInput) && valueInput.length > 0) {
        const lstTmp = getListVal(valueInput);
        return `(${lstTmp.join(',')})`;
    }
    if (typeof valueInput === 'string') {
        // neu gia tri la string thi escape string, check them dieu kien LIKE
        switch (opt) {
            case 'LIKE':
                return replaceString(`%${valueInput}%`);
            case 'NOT LIKE':
                return replaceString(`%${valueInput}%`);
            case 'START_WITH':
                return replaceString(`${valueInput}%`);
            case 'END_WITH':
                return replaceString(`%${valueInput}`);
            case 'NOT_END_WITH':
                return replaceString(`%${valueInput}`);
            case 'NOT_START_WITH':
                return replaceString(`${valueInput}%`);
            case 'MATCH':
                return replaceString(utils.formatStringFullTextSearch(valueInput));
            default:
                return replaceString(valueInput);
        }
    }
    if (typeof valueInput === 'boolean') {
        // neu boolean thi tra ve 0,1
        return valueInput ? 1 : 0;
    }
    if (
        valueInput &&
        typeof valueInput === 'object' &&
        Reflect.has(valueInput, 'getTime') &&
        typeof valueInput.getTime === 'function'
    ) {
        // neu datetime thi lay getTime
        return valueInput.getTime();
    }
    return valueInput;
}

function getListVal(arr) {
    const lst = [];
    for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        if (val === null || val === undefined) {
            lst.push('NULL');
        } else if (typeof val === 'string') {
            lst.push(replaceString(val));
        } else if (
            typeof val === 'boolean' ||
            (val && typeof val === 'object' && Reflect.has(val, 'getTime') && typeof val.getTime === 'function')
        ) {
            // neu boolean thi set gia tri 0/1
            // neu time thi set gia tri number
            if (typeof val === 'boolean') {
                lst.push(val ? 1 : 0);
            } else {
                lst.push(val.getTime());
            }
        } else {
            lst.push(val);
        }
    }
    return lst;
}
