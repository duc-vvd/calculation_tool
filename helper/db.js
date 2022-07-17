import { LowSync, JSONFileSync } from "lowdb";

const db = new LowSync(new JSONFileSync(`${process.cwd()}/data/db.json`));
db.data = {};
db.write();

export default db;
