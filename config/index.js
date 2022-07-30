import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const configApp = require('./config-app.json');
const configDbSql = require('./config-dbsql.json');

export { configApp, configDbSql };
