import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

export default function calVegaFx() {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_SENSITIVITIES_FX_HASHMAP } = db.data;
        const sumSensitivityHashmap = {};
        const crossbucketCorrelation = 0.6;
        const riskWeight = 1;
        let total = 0;
        const time = {
            halfAYear: 0.5,
            aYear: 1,
            threeYear: 3,
            fiveYear: 5,
            tenYear: 10,
        }

        STG_INSTRUMENT_CONTRACT_MASTER.forEach((element) => {
            if (element.V_CCY2_CODE?.length < 3) return;
            const stgSensitivitiesFxHashmapElement = STG_SENSITIVITIES_FX_HASHMAP[element.V_INSTRUMENT_CODE] || {};
            if (!stgSensitivitiesFxHashmapElement.N_DELTA_FX?.length) return;
            const V_PAIR_CCY = `${element.V_CCY_CODE}/${element.V_CCY2_CODE}`;


            if (!sumSensitivityHashmap[V_PAIR_CCY]) {
                sumSensitivityHashmap[V_PAIR_CCY] = {
                    halfAYear: 0,
                    aYear: 0,
                    threeYear: 0,
                    fiveYear: 0,
                    tenYear: 0,
                }
            }
            if (stgSensitivitiesFxHashmapElement['N_VEGA_FX_0.5YEAR']) {
                sumSensitivityHashmap[V_PAIR_CCY].halfAYear = calculate(
                    formatStringNumber(stgSensitivitiesFxHashmapElement['N_VEGA_FX_0.5YEAR']),
                    sumSensitivityHashmap[V_PAIR_CCY].halfAYear,
                    '+',
                );
            }
            if (stgSensitivitiesFxHashmapElement.N_VEGA_FX_1YEAR) {
                sumSensitivityHashmap[V_PAIR_CCY].aYear = calculate(
                    formatStringNumber(stgSensitivitiesFxHashmapElement.N_VEGA_FX_1YEAR),
                    sumSensitivityHashmap[V_PAIR_CCY].aYear,
                    '+',
                );
            }
            if (stgSensitivitiesFxHashmapElement.N_VEGA_FX_3YEAR) {
                sumSensitivityHashmap[V_PAIR_CCY].threeYear = calculate(
                    formatStringNumber(stgSensitivitiesFxHashmapElement.N_VEGA_FX_3YEAR),
                    sumSensitivityHashmap[V_PAIR_CCY].threeYear,
                    '+',
                );
            }
            if (stgSensitivitiesFxHashmapElement.N_VEGA_FX_5YEAR) {
                sumSensitivityHashmap[V_PAIR_CCY].fiveYear = calculate(
                    formatStringNumber(stgSensitivitiesFxHashmapElement.N_VEGA_FX_5YEAR),
                    sumSensitivityHashmap[V_PAIR_CCY].fiveYear,
                    '+',
                );
            }
            if (stgSensitivitiesFxHashmapElement.N_VEGA_FX_10YEAR) {
                sumSensitivityHashmap[V_PAIR_CCY].tenYear = calculate(
                    formatStringNumber(stgSensitivitiesFxHashmapElement.N_VEGA_FX_10YEAR),
                    sumSensitivityHashmap[V_PAIR_CCY].tenYear,
                    '+',
                );
            }

        });

        const weightedSensitivityHashmap = {};
        for (const key in sumSensitivityHashmap) {
            weightedSensitivityHashmap[key] = {};
            for (const numberOfYear in sumSensitivityHashmap[key]) {
                weightedSensitivityHashmap[key][numberOfYear] = calculate(sumSensitivityHashmap[key][numberOfYear], riskWeight, '*');
            }
        }

        const sumPairCurrencyAndRiskFactorHashmap = {};
        for (const key in weightedSensitivityHashmap) {
            for (const numberOfYear in weightedSensitivityHashmap[key]) {
                for (const numberOfYear2 in weightedSensitivityHashmap[key]) {
                    if (!sumPairCurrencyAndRiskFactorHashmap[key]) {
                        sumPairCurrencyAndRiskFactorHashmap[key] = 0
                    }
                    let timeBucketCorrelation = 1
                    if (numberOfYear !== numberOfYear2) {
                        timeBucketCorrelation = Math.min(Math.exp(calculate(calculate(-0.01, Math.abs(calculate(time[numberOfYear2], time[numberOfYear], '-')), '*'), Math.min(time[numberOfYear2], time[numberOfYear]), '/')), 1);
                    }


                    sumPairCurrencyAndRiskFactorHashmap[key] = calculate(
                        calculate(calculate(weightedSensitivityHashmap[key][numberOfYear], weightedSensitivityHashmap[key][numberOfYear2], '*'), timeBucketCorrelation, '*')
                        , sumPairCurrencyAndRiskFactorHashmap[key], '+')
                }
            }

        }

        const sqrtPairCurrencyAndRiskFactorHashmap = {};
        for (const key in sumPairCurrencyAndRiskFactorHashmap) {
            sqrtPairCurrencyAndRiskFactorHashmap[key] = Math.sqrt(sumPairCurrencyAndRiskFactorHashmap[key]);
        }

        for (const key in sqrtPairCurrencyAndRiskFactorHashmap) {
            for (const key2 in sqrtPairCurrencyAndRiskFactorHashmap) {
                let crossbucketCorrelationTmp = crossbucketCorrelation;
                if (key === key2) {
                    crossbucketCorrelationTmp = 1;
                }
                total += calculate(
                    calculate(sqrtPairCurrencyAndRiskFactorHashmap[key], sqrtPairCurrencyAndRiskFactorHashmap[key2], '*'),
                    crossbucketCorrelationTmp,
                    '*',
                );
            }
        }

        const VEGA_FX = Math.sqrt(total);
        return VEGA_FX;
    } catch (error) {
        console.error(`calculate - calVegaFx - catch error: ${error.message}`);
    }
}
