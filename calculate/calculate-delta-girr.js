import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

export default function calDeltaGirr() {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_SENSITIVITIES_GIRR_HASHMAP } = db.data;
        const sumSensitivityHashmap = {};
        const crossbucketCorrelation = 0.6;
        const riskWeight = {
            aQuarterOfYear: 0.024,
            halfAYear: 0.024,
            aYear: 0.0225,
            twoYear: 0.0188,
            threeYear: 0.0173,
            fiveYear: 0.015,
            tenYear: 0.015,
            fifteenYear: 0.015,
            twentyYear: 0.015,
            thirtyYear: 0.015,
        };
        let total = 0;
        const time = {
            aQuarterOfYear: 0.25,
            halfAYear: 0.5,
            aYear: 1,
            twoYear: 2,
            threeYear: 3,
            fiveYear: 5,
            tenYear: 10,
            fifteenYear: 15,
            twentyYear: 20,
            thirtyYear: 30,
        };

        STG_INSTRUMENT_CONTRACT_MASTER.forEach((element) => {
            const stgSensitivitiesGirrHashmapElement = STG_SENSITIVITIES_GIRR_HASHMAP[element.V_INSTRUMENT_CODE] || {};

            if (element.V_CCY_CODE) {
                if (!sumSensitivityHashmap[element.V_CCY_CODE]) {
                    sumSensitivityHashmap[element.V_CCY_CODE] = {
                        aQuarterOfYear: 0,
                        halfAYear: 0,
                        aYear: 0,
                        twoYear: 0,
                        threeYear: 0,
                        fiveYear: 0,
                        tenYear: 0,
                        fifteenYear: 0,
                        twentyYear: 0,
                        thirtyYear: 0,
                    };
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_0.25YEAR']) {
                    sumSensitivityHashmap[element.V_CCY_CODE].aQuarterOfYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_0.25YEAR']),
                        sumSensitivityHashmap[element.V_CCY_CODE].aQuarterOfYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_0.5YEAR']) {
                    sumSensitivityHashmap[element.V_CCY_CODE].halfAYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_0.5YEAR']),
                        sumSensitivityHashmap[element.V_CCY_CODE].halfAYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_1YEAR']) {
                    sumSensitivityHashmap[element.V_CCY_CODE].aYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_1YEAR']),
                        sumSensitivityHashmap[element.V_CCY_CODE].aYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_2YEAR']) {
                    sumSensitivityHashmap[element.V_CCY_CODE].twoYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_2YEAR']),
                        sumSensitivityHashmap[element.V_CCY_CODE].twoYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_3YEAR']) {
                    sumSensitivityHashmap[element.V_CCY_CODE].threeYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_3YEAR']),
                        sumSensitivityHashmap[element.V_CCY_CODE].threeYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_5YEAR']) {
                    sumSensitivityHashmap[element.V_CCY_CODE].fiveYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_5YEAR']),
                        sumSensitivityHashmap[element.V_CCY_CODE].fiveYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_10YEAR']) {
                    sumSensitivityHashmap[element.V_CCY_CODE].tenYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_10YEAR']),
                        sumSensitivityHashmap[element.V_CCY_CODE].tenYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_15YEAR']) {
                    sumSensitivityHashmap[element.V_CCY_CODE].fifteenYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_15YEAR']),
                        sumSensitivityHashmap[element.V_CCY_CODE].fifteenYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_20YEAR']) {
                    sumSensitivityHashmap[element.V_CCY_CODE].twentyYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_20YEAR']),
                        sumSensitivityHashmap[element.V_CCY_CODE].twentyYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_30YEAR']) {
                    sumSensitivityHashmap[element.V_CCY_CODE].thirtyYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_1ST_CCY_30YEAR']),
                        sumSensitivityHashmap[element.V_CCY_CODE].thirtyYear,
                        '+',
                    );
                }
            }

            if (element.V_CCY2_CODE) {
                if (!sumSensitivityHashmap[element.V_CCY2_CODE]) {
                    sumSensitivityHashmap[element.V_CCY2_CODE] = {
                        aQuarterOfYear: 0,
                        halfAYear: 0,
                        aYear: 0,
                        twoYear: 0,
                        threeYear: 0,
                        fiveYear: 0,
                        tenYear: 0,
                        fifteenYear: 0,
                        twentyYear: 0,
                        thirtyYear: 0,
                    };
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_0.25YEAR']) {
                    sumSensitivityHashmap[element.V_CCY2_CODE].aQuarterOfYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_0.25YEAR']),
                        sumSensitivityHashmap[element.V_CCY2_CODE].aQuarterOfYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_0.5YEAR']) {
                    sumSensitivityHashmap[element.V_CCY2_CODE].halfAYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_0.5YEAR']),
                        sumSensitivityHashmap[element.V_CCY2_CODE].halfAYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_1YEAR']) {
                    sumSensitivityHashmap[element.V_CCY2_CODE].aYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_1YEAR']),
                        sumSensitivityHashmap[element.V_CCY2_CODE].aYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_2YEAR']) {
                    sumSensitivityHashmap[element.V_CCY2_CODE].twoYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_2YEAR']),
                        sumSensitivityHashmap[element.V_CCY2_CODE].twoYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_3YEAR']) {
                    sumSensitivityHashmap[element.V_CCY2_CODE].threeYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_3YEAR']),
                        sumSensitivityHashmap[element.V_CCY2_CODE].threeYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_5YEAR']) {
                    sumSensitivityHashmap[element.V_CCY2_CODE].fiveYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_5YEAR']),
                        sumSensitivityHashmap[element.V_CCY2_CODE].fiveYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_10YEAR']) {
                    sumSensitivityHashmap[element.V_CCY2_CODE].tenYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_10YEAR']),
                        sumSensitivityHashmap[element.V_CCY2_CODE].tenYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_15YEAR']) {
                    sumSensitivityHashmap[element.V_CCY2_CODE].fifteenYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_15YEAR']),
                        sumSensitivityHashmap[element.V_CCY2_CODE].fifteenYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_20YEAR']) {
                    sumSensitivityHashmap[element.V_CCY2_CODE].twentyYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_20YEAR']),
                        sumSensitivityHashmap[element.V_CCY2_CODE].twentyYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_30YEAR']) {
                    sumSensitivityHashmap[element.V_CCY2_CODE].thirtyYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement['N_DELTA_GIRR_2ND_CCY_30YEAR']),
                        sumSensitivityHashmap[element.V_CCY2_CODE].thirtyYear,
                        '+',
                    );
                }
            }
        });

        const weightedSensitivityHashmap = {};
        for (const key in sumSensitivityHashmap) {
            weightedSensitivityHashmap[key] = {};
            for (const numberOfYear in sumSensitivityHashmap[key]) {
                weightedSensitivityHashmap[key][numberOfYear] = calculate(
                    sumSensitivityHashmap[key][numberOfYear],
                    riskWeight[numberOfYear],
                    '*',
                );
            }
        }

        const sumPairCurrencyAndRiskFactorHashmap = {};
        for (const key in weightedSensitivityHashmap) {
            for (const numberOfYear in weightedSensitivityHashmap[key]) {
                for (const numberOfYear2 in weightedSensitivityHashmap[key]) {
                    if (!sumPairCurrencyAndRiskFactorHashmap[key]) {
                        sumPairCurrencyAndRiskFactorHashmap[key] = 0;
                    }
                    let timeBucketCorrelation = 1;
                    if (numberOfYear !== numberOfYear2) {
                        timeBucketCorrelation = Math.min(
                            Math.exp(
                                calculate(
                                    calculate(
                                        -0.03,
                                        Math.abs(calculate(time[numberOfYear2], time[numberOfYear], '-')),
                                        '*',
                                    ),
                                    Math.min(time[numberOfYear2], time[numberOfYear]),
                                    '/',
                                ),
                            ),
                            1,
                        );
                    }

                    sumPairCurrencyAndRiskFactorHashmap[key] = calculate(
                        calculate(
                            calculate(
                                weightedSensitivityHashmap[key][numberOfYear],
                                weightedSensitivityHashmap[key][numberOfYear2],
                                '*',
                            ),
                            timeBucketCorrelation,
                            '*',
                        ),
                        sumPairCurrencyAndRiskFactorHashmap[key],
                        '+',
                    );
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
                    calculate(
                        sqrtPairCurrencyAndRiskFactorHashmap[key],
                        sqrtPairCurrencyAndRiskFactorHashmap[key2],
                        '*',
                    ),
                    crossbucketCorrelationTmp,
                    '*',
                );
            }
        }

        const DELTA_GIRR = Math.sqrt(total);
        return DELTA_GIRR;
    } catch (error) {
        console.error(`calculate - calDeltaGirr - catch error: ${error.message}`);
    }
}
