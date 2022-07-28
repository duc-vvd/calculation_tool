import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

export default function calVegaGirr() {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_SENSITIVITIES_GIRR_HASHMAP } = db.data;
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
        };

        STG_INSTRUMENT_CONTRACT_MASTER.forEach((element) => {
            const stgSensitivitiesGirrHashmapElement = STG_SENSITIVITIES_GIRR_HASHMAP[element.v_instrument_code] || {};

            if (element.v_ccy_code) {
                if (!sumSensitivityHashmap[element.v_ccy_code]) {
                    sumSensitivityHashmap[element.v_ccy_code] = {
                        halfAYear: 0,
                        aYear: 0,
                        threeYear: 0,
                        fiveYear: 0,
                        tenYear: 0,
                    };
                }

                if (stgSensitivitiesGirrHashmapElement.n_vega_girr_1st_ccy_half_a_year) {
                    sumSensitivityHashmap[element.v_ccy_code].halfAYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_vega_girr_1st_ccy_half_a_year),
                        sumSensitivityHashmap[element.v_ccy_code].halfAYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement.n_vega_girr_1st_ccy_1year) {
                    sumSensitivityHashmap[element.v_ccy_code].aYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_vega_girr_1st_ccy_1year),
                        sumSensitivityHashmap[element.v_ccy_code].aYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement.n_vega_girr_1st_ccy_3year) {
                    sumSensitivityHashmap[element.v_ccy_code].threeYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_vega_girr_1st_ccy_3year),
                        sumSensitivityHashmap[element.v_ccy_code].threeYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement.n_vega_girr_1st_ccy_5year) {
                    sumSensitivityHashmap[element.v_ccy_code].fiveYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_vega_girr_1st_ccy_5year),
                        sumSensitivityHashmap[element.v_ccy_code].fiveYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement.n_vega_girr_1st_ccy_10year) {
                    sumSensitivityHashmap[element.v_ccy_code].tenYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_vega_girr_1st_ccy_10year),
                        sumSensitivityHashmap[element.v_ccy_code].tenYear,
                        '+',
                    );
                }
            }

            if (element.v_ccy2_code) {
                if (!sumSensitivityHashmap[element.v_ccy2_code]) {
                    sumSensitivityHashmap[element.v_ccy2_code] = {
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

                if (stgSensitivitiesGirrHashmapElement.n_vega_girr_2nd_ccy_half_a_year) {
                    sumSensitivityHashmap[element.v_ccy2_code].halfAYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_vega_girr_2nd_ccy_half_a_year),
                        sumSensitivityHashmap[element.v_ccy2_code].halfAYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement.n_vega_girr_2nd_ccy_1year) {
                    sumSensitivityHashmap[element.v_ccy2_code].aYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_vega_girr_2nd_ccy_1year),
                        sumSensitivityHashmap[element.v_ccy2_code].aYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement.n_vega_girr_2nd_ccy_3year) {
                    sumSensitivityHashmap[element.v_ccy2_code].threeYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_vega_girr_2nd_ccy_3year),
                        sumSensitivityHashmap[element.v_ccy2_code].threeYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement.n_vega_girr_2nd_ccy_5year) {
                    sumSensitivityHashmap[element.v_ccy2_code].fiveYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_vega_girr_2nd_ccy_5year),
                        sumSensitivityHashmap[element.v_ccy2_code].fiveYear,
                        '+',
                    );
                }

                if (stgSensitivitiesGirrHashmapElement.n_vega_girr_2nd_ccy_10year) {
                    sumSensitivityHashmap[element.v_ccy2_code].tenYear = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_vega_girr_2nd_ccy_10year),
                        sumSensitivityHashmap[element.v_ccy2_code].tenYear,
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
                    riskWeight,
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

        const VEGA_GIRR = Math.sqrt(total);
        return VEGA_GIRR;
    } catch (error) {
        console.error(`calculate - calVegaGirr - catch error: ${error.message}`);
    }
}
