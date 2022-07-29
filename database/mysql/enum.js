export const TABLE_VERSION = 'database_version';
export const KEY_PROCESSING = 'database_is_processing';
export const ENTITY_ACTION = {
    INSERT: 'INSERT',
    INSERT_BATCH: 'INSERT_BATCH',
    INSERT_OR_UPDATE: 'INSERT_OR_UPDATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    GET_PAGGING: 'GET_PAGGING',
    GET_PAGGING_UNION: 'GET_PAGGING_UNION',
    GET_COUNT: 'GET_COUNT',
    SELECT: 'SELECT',
};

export const DB_TYPE = {
    MSSQL: 'mssql',
    MYSQL: 'mysql',
    ORACLE: 'orcl',
};

export const CONFIG = {
    SERVICE_NAME: 'dbsql',
    MSSQL: 'mssql',
};

export const ERROR_CODE = {
    QUERY_BUILDER_NULL: 'QUERY_BUILDER_NULL',
    INVALID_SCHEMA: 'INVALID_SCHEMA',
    SQL_INJECTION: 'SQL_INJECTION',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    GetConnection: 'GetConnection',
    QueryInput: 'QueryInput',
    QueryInput_LENGTH: 'QueryInput_LENGTH_LESS',
    ExecuteTransaction: 'ExecuteTransaction',
    LSTQUERY_NULL: 'LSTQUERY_NULL',
};

export const LOGICAL = {
    AND: 'AND',
    OR: 'OR',
};

export const OPERATOR = {
    EQUAL: '=',
    NOT_EQUAL: '<>',
    IN: 'IN',
    NOT_IN: 'NOT IN',
    GREATER: '>',
    GREATER_OR_EQUAL: '>=',
    LESS: '<',
    LESS_OR_EQUAL: '<=',
    LIKE: 'LIKE',
    NOT_LIKE: 'NOT LIKE',
    IS_NULL: 'IS NULL',
    IS_NOT_NULL: 'IS NOT NULL',
    START_WITH: 'LIKE',
    END_WITH: 'LIKE',
    NOT_START_WITH: 'NOT LIKE',
    NOT_END_WITH: 'NOT LIKE',
    MATCH: 'MATCH',
};

export const HEALTH_CHECK_TYPE = {
    BUSINESS: 'business',
    INTERNAL: 'internal_connection',
    EXTERNAL: 'external_connection',
    KUBERNETES: 'kubernetes',
};
