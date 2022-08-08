import db from '../../helper/db.js';
import { calculate } from '../../helper/operator.js';
import { formatStringNumber } from '../../helper/utils.js';

export default function calDeltaFx(isLow, isHigh) {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_SENSITIVITIES_FX_HASHMAP } = db.data;
        const sumSensitivityHashmap = {};
        let crossbucketCorrelation = 0.6;
        if (isLow) {
            crossbucketCorrelation = 0.45; // =MAX(2*0.6-1,0.75*0.6)
        } else if (isHigh) {
            crossbucketCorrelation *= 1.25;
        }
        const riskWeight = 0.15;
        let total = 0;

        STG_INSTRUMENT_CONTRACT_MASTER.forEach((element) => {
            if (!element.v_ccy2_code) return;
            const stgSensitivitiesFxHashmapElement = STG_SENSITIVITIES_FX_HASHMAP[element.v_instrument_code] || {};
            if (!stgSensitivitiesFxHashmapElement.n_delta_fx) return;
            const V_PAIR_CCY = `${element.v_ccy_code}/${element.v_ccy2_code}`;

            // N_DELTA_FX
            let nDeltaFx;
            if (
                element.v_product_code === 'FRA' ||
                element.v_product_code === 'CapFloor' ||
                element.v_product_code === 'Xccy Swaption' ||
                element.v_product_code === 'PRDC Swap' ||
                element.v_product_code === 'Range Accrual Swap'
            ) {
                nDeltaFx = 0;
            } else {
                nDeltaFx = formatStringNumber(stgSensitivitiesFxHashmapElement.n_delta_fx);
            }

            if (sumSensitivityHashmap[V_PAIR_CCY]) {
                sumSensitivityHashmap[V_PAIR_CCY] = calculate(nDeltaFx, sumSensitivityHashmap[V_PAIR_CCY], '+');
            } else {
                sumSensitivityHashmap[V_PAIR_CCY] = calculate(nDeltaFx, 0, '+');
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
