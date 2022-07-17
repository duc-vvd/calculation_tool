import * as csv from "fast-csv";
import db from "../helper/db.js";
import { FILE_NAME, MAPPING_CSV } from "../common/enum.js";

const CSV_HEADER = Object.keys(MAPPING_CSV.STG_INSTRUMENT_CONTRACT_MASTER);

function checkHeaderFormat(row) {
  return row.join(",") === CSV_HEADER.join(",");
}

export default function readStgInstrumentContractMasterFile() {
  return new Promise((resolve, reject) => {
    let line = 0;
    let isInvalidFileFormat = false;
    db.data.STG_INSTRUMENT_CONTRACT_MASTER = [];
    try {
      csv
        .parseFile(
          `${process.cwd()}/data/${FILE_NAME.STG_INSTRUMENT_CONTRACT_MASTER}`
        )
        .on("error", (error) => {
          console.log(
            `readStgInstrumentContractMasterFile - error: ${error.message}`
          );
          reject(error);
        })
        .on("data", (row) => {
          if (row?.length > 0) {
            if (row.length !== CSV_HEADER.length) {
              logger.error(
                `readStgInstrumentContractMasterFile - invalid number of elements per line`
              );
              return;
            }
            line++;
            if (line === 1) {
              if (!checkHeaderFormat(row)) {
                logger.error(
                  `readStgInstrumentContractMasterFile - invalid header`
                );
                isInvalidFileFormat = true;
              }
              return;
            }
            reject(new Error("hihi"));
            const obj = row.reduce((prev, cur, i) => {
              prev[CSV_HEADER[i]] = cur;
              return prev;
            }, {});
            db.data.STG_INSTRUMENT_CONTRACT_MASTER.push(obj);
          }
        })
        .on("end", () => {
          db.write();
          resolve();
        });
    } catch (error) {
      console.error(
        `readStgInstrumentContractMasterFile - catch error: ${error.message}`
      );
      reject(error);
    }
  });
}
