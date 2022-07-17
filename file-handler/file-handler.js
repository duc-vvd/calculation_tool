import * as csv from 'fast-csv';
import db from '../helper/db.js';
import { FILE_HASHMAP, FILE_NAME, HASHMAP_KEY, MAPPING_CSV } from '../common/enum.js';

export default class FileHandler {
    constructor(file) {
        this.file = file;
        this.fileHashmap = FILE_HASHMAP[file];
        this.hashmapKey = HASHMAP_KEY[file];
        this.csvHeader = Object.keys(MAPPING_CSV[file]);
    }

    checkHeaderFormat(row) {
        return row.join(',') === this.csvHeader.join(',');
    }

    readFile() {
        return new Promise((resolve, reject) => {
            let line = 0;
            let isInvalidFileFormat = false;
            db.data[this.file] = [];
            db.data[this.fileHashmap] = {};
            try {
                csv.parseFile(`${process.cwd()}/data/${FILE_NAME[this.file]}`)
                    .on('error', (error) => {
                        console.log(`File Handler - ${this.file} - error: ${error.message}`);
                        reject(error);
                    })
                    .on('data', (row) => {
                        if (row?.length > 0) {
                            if (row.length !== this.csvHeader.length) {
                                console.error(`File Handler - ${this.file} - invalid number of elements per line`);
                                return;
                            }
                            line++;
                            if (line === 1) {
                                if (!this.checkHeaderFormat(row)) {
                                    console.error(`File Handler - ${this.file} - invalid header`);
                                    isInvalidFileFormat = true;
                                }
                                return;
                            }
                            const obj = row.reduce((prev, cur, i) => {
                                prev[this.csvHeader[i].trim()] = cur.trim();
                                return prev;
                            }, {});
                            if (!db.data[this.fileHashmap][obj[this.hashmapKey]]) {
                                db.data[this.fileHashmap][obj[this.hashmapKey]] = obj;
                            } else {
                                console.log(`File Handler - ${this.file} - ${obj[this.hashmapKey]} already exists`);
                            }

                            db.data[this.file].push(obj);
                        }
                    })
                    .on('end', () => {
                        db.write();
                        resolve();
                    });
            } catch (error) {
                console.error(`File Handler - ${this.file} - catch error: ${error.message}`);
                reject(error);
            }
        });
    }
}
