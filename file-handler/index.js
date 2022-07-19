import FileHandler from './file-handler.js';
import { FILE } from '../common/enum.js';
import { mappingDataDeal } from '../mapper/index.js';

function readStgInstrumentContractMasterFile() {
    const fileHandler = new FileHandler(FILE.STG_INSTRUMENT_CONTRACT_MASTER);
    return fileHandler.readFile();
}

function readStgBankPositionsFile() {
    const fileHandler = new FileHandler(FILE.STG_BANK_POSITIONS);
    return fileHandler.readFile();
}

function readStgSensitivitiesFxFile() {
    const fileHandler = new FileHandler(FILE.STG_SENSITIVITIES_FX);
    return fileHandler.readFile();
}

function readStgSensitivitiesGirrFile() {
    const fileHandler = new FileHandler(FILE.STG_SENSITIVITIES_GIRR);
    return fileHandler.readFile();
}

function readStgPartyRatingDetailsFile() {
    const fileHandler = new FileHandler(FILE.STG_PARTY_RATING_DETAILS);
    return fileHandler.readFile();
}

function readStgPartyMasterFile() {
    const fileHandler = new FileHandler(FILE.STG_PARTY_MASTER);
    return fileHandler.readFile();
}

function readStgCurvaturesShockFile() {
    const fileHandler = new FileHandler(FILE.STG_CURVATURES_SHOCK);
    return fileHandler.readFile();
}

function readStgPartyFinancialsFile() {
    const fileHandler = new FileHandler(FILE.STG_PARTY_FINANCIALS);
    return fileHandler.readFile();
}

function readStgInstrumentContractMaster2File() {
    const fileHandler = new FileHandler(FILE.STG_INSTRUMENT_CONTRACT_MASTER_2);
    return fileHandler.readFile();
}

async function readAllFile() {
    try {
        await Promise.all([
            readStgInstrumentContractMasterFile(),
            readStgBankPositionsFile(),
            readStgSensitivitiesFxFile(),
            readStgSensitivitiesGirrFile(),
            readStgPartyRatingDetailsFile(),
            readStgPartyMasterFile(),
            readStgCurvaturesShockFile(),
            readStgPartyFinancialsFile(),
            readStgInstrumentContractMaster2File(),
        ]);

        mappingDataDeal();
        console.log(`file-handler - readAllFile - done`);
    } catch (error) {
        console.error(`readAllFile - catch error: ${error.message}`);
    }
}
export {
    readStgInstrumentContractMasterFile,
    readStgBankPositionsFile,
    readStgSensitivitiesFxFile,
    readStgSensitivitiesGirrFile,
    readStgPartyRatingDetailsFile,
    readStgPartyMasterFile,
    readStgCurvaturesShockFile,
    readStgPartyFinancialsFile,
    readAllFile,
    readStgInstrumentContractMaster2File,
};
