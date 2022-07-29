import mysql from 'mysql';
import * as enumValue from './enum.js';

import config from '../../config/config-dbsql.json';

let timeOutDeadlock = 0;
const intervalDeadlock = config.db.interval_deadlock || 2;
const maxTimeDeadlock = config.db.max_time_deadlock || 60000;
let pool = null;
let db_cluster_config = null;
let db_config = null;

// khong thi dung pool basic
db_config = {
    host: process.env.DB_HOST || config.db ? config.db.host : '',
    port: process.env.DB_PORT || config.db ? config.db.port : 3306,
    user: process.env.DB_USER || config.db ? config.db.username : '',
    password: process.env.DB_PASSWORD || config.db ? config.db.password : '',
    database: process.env.DB_NAME || config.db ? config.db.db_name : '',
    charset: process.env.DB_NAME || config.db ? config.db.charset : '',
    multipleStatements: true,
    acquireTimeout: 60000,
    connectionLimit: 50,
};

const getPoolConnection = (cb) => {
    if (!pool) {
        if (db_config) {
            pool = mysql.createPool(db_config);
        } else if (db_cluster_config) {
            // RR: Select one alternately. (Round - Robin)
            // RANDOM: Select the node by random function.
            // ORDER: Select the first node available unconditionally.
            const poolConfig = {
                removeNodeErrorCount: 1, // Remove the node immediately when connection fails.
                defaultSelector: 'ORDER',
            };
            pool = mysql.createPoolCluster(poolConfig);
            for (let i = 0; i < db_cluster_config.length; i++) {
                const clusterConfig = db_cluster_config[i];
                pool.add(clusterConfig);
            }
        }
    }
    pool.getConnection((err, conn) => {
        if (err) {
            console.error(`get connection pool err: ${err}`);
            if (conn) {
                conn.release();
            }
            setTimeout(() => {
                console.error(`Reconect pool!!`);
                return getPoolConnection(cb);
            }, 1000);
        } else {
            if (conn) {
                return cb(conn);
            }
            setTimeout(() => {
                console.error(`Reconect pool!!`);
                return getPoolConnection(cb);
            }, 1000);
        }
    });
};

const isMysqlDeadlockError = (err) => {
    return err && (err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_LOCK_WAIT_TIMEOUT');
};

export const executeTransaction = function executeTransaction(query, cb, removeLog) {
    // eslint-disable-next-line no-unused-expressions
    removeLog ? null : console.info(query);
    getPoolConnection((conn) => {
        conn.beginTransaction((err1) => {
            if (err1) {
                if (conn) {
                    conn.release();
                }
                // check dealock
                if (isMysqlDeadlockError(err1)) {
                    console.info(`BEGIN RETRY EXEC, ${query}`);
                    timeOutDeadlock += intervalDeadlock;
                    if (timeOutDeadlock > maxTimeDeadlock) {
                        timeOutDeadlock = 0;
                        console.error(`MAX RETRY ${err1}`, enumValue.HEALTH_CHECK_TYPE.INTERNAL);
                        throw err1;
                    }
                    return setTimeout(() => {
                        this.executeTransaction(query, cb, removeLog);
                    }, timeOutDeadlock);
                }
                console.error(err1, enumValue.HEALTH_CHECK_TYPE.INTERNAL);
                throw err1;
            }

            conn.query(query, (error, results, fields) => {
                if (error) {
                    if (conn) {
                        conn.release();
                    }
                    // check dealock
                    if (isMysqlDeadlockError(error)) {
                        console.info(`BEGIN RETRY EXEC, ${query}`);
                        timeOutDeadlock += intervalDeadlock;
                        if (timeOutDeadlock > maxTimeDeadlock) {
                            timeOutDeadlock = 0;
                            console.error(`MAX RETRY ${error}`, enumValue.HEALTH_CHECK_TYPE.INTERNAL);
                            return conn.rollback(() => cb(null, error));
                        }
                        return conn.rollback(() => {
                            setTimeout(() => {
                                this.executeTransaction(query, cb, removeLog);
                            }, timeOutDeadlock);
                        });
                    }
                    console.error(error, enumValue.HEALTH_CHECK_TYPE.INTERNAL);
                    return conn.rollback(() => cb(null, error));
                }
                conn.commit((err2) => {
                    if (err2) {
                        if (conn) {
                            conn.release();
                        }
                        // check dealock
                        if (isMysqlDeadlockError(err2)) {
                            console.info(`BEGIN RETRY EXEC, ${query}`);
                            timeOutDeadlock += intervalDeadlock;
                            if (timeOutDeadlock > maxTimeDeadlock) {
                                timeOutDeadlock = 0;
                                console.error(`MAX RETRY ${err2}`, enumValue.HEALTH_CHECK_TYPE.INTERNAL);
                                return conn.rollback(() => cb(null, err2));
                            }
                            return conn.rollback(() => {
                                // eslint-disable-next-line max-nested-callbacks
                                setTimeout(() => {
                                    this.executeTransaction(query, cb, removeLog);
                                }, timeOutDeadlock);
                            });
                        }
                        timeOutDeadlock = 0;
                        console.error(err2, enumValue.HEALTH_CHECK_TYPE.INTERNAL);
                        return conn.rollback(() => cb(null, err2));
                    }
                    if (conn) {
                        conn.release();
                    }
                    return cb(results, null, fields);
                });
            });
        });
    });
};

const endPool = function () {
    return new Promise((resolve, reject) => {
        pool.end((err) => {
            if (err) {
                return reject();
            }
            return resolve();
        });
    });
};

process.on('SIGINT', () => {
    endPool()
        .then(() => {
            const exit = process.exit;
            exit(0);
        })
        .catch(() => {
            console.info(`process.on - SIGINT catch error`);
        });
});
