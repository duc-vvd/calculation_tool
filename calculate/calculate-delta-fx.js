import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

export default function calDeltaFx() {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_SENSITIVITIES_FX_HASHMAP } = db.data;
        const sumSensitivityHashmap = {};
        const crossbucketCorrelation = 0.6;
        const riskWeight = 0.3;
        let total = 0;

        STG_INSTRUMENT_CONTRACT_MASTER.forEach((element) => {
            if (element.V_CCY2_CODE?.length < 3) return;
            const stgSensitivitiesFxHashmapElement = STG_SENSITIVITIES_FX_HASHMAP[element.V_INSTRUMENT_CODE] || {};
            if (!stgSensitivitiesFxHashmapElement.N_DELTA_FX?.length) return;
            const V_PAIR_CCY = `${element.V_CCY_CODE}/${element.V_CCY2_CODE}`;
            if (sumSensitivityHashmap[V_PAIR_CCY]) {
                sumSensitivityHashmap[V_PAIR_CCY] = calculate(
                    formatStringNumber(stgSensitivitiesFxHashmapElement.N_DELTA_FX),
                    sumSensitivityHashmap[V_PAIR_CCY],
                    '+',
                );
            } else {
                sumSensitivityHashmap[V_PAIR_CCY] = calculate(
                    formatStringNumber(stgSensitivitiesFxHashmapElement.N_DELTA_FX),
                    0,
                    '+',
                );
            }
        });

        const weightedSensitivityHashmap = {};
        for (const key in sumSensitivityHashmap) {
            weightedSensitivityHashmap[key] = calculate(sumSensitivityHashmap[key], riskWeight, '*');
        }

        for (const key in weightedSensitivityHashmap) {
            for (const key2 in weightedSensitivityHashmap) {
                let crossbucketCorrelationTmp = crossbucketCorrelation;
                if (key === key2) {
                    crossbucketCorrelationTmp = 1;
                }
                total += calculate(
                    calculate(weightedSensitivityHashmap[key], weightedSensitivityHashmap[key2], '*'),
                    crossbucketCorrelationTmp,
                    '*',
                );
            }
        }

        const DELTA_FX = Math.sqrt(total);
        return DELTA_FX;
    } catch (error) {
        console.error(`calculate - calDeltaFx - catch error: ${error.message}`);
    }
}
