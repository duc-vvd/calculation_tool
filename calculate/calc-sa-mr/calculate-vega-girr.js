import db from '../../helper/db.js';
import { calculate } from '../../helper/operator.js';
import { formatStringNumber } from '../../helper/utils.js';

export default function calVegaGirr(isLow, isHigh) {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_SENSITIVITIES_GIRR_HASHMAP } = db.data;
        const sumSensitivityHashmap = {};
        // Crossbucket correlation
        let crossbucketCorrelation = 0.5;
        if (isLow) {
            crossbucketCorrelation *= 0.75;
        } else if (isHigh) {
            crossbucketCorrelation *= 1.25;
        }
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

            if (
                element.v_product_code === 'FRA' ||
                element.v_product_code === 'CapFloor' ||
                element.v_product_code === 'Xccy Swaption' ||
                element.v_product_code === 'PRDC Swap' ||
                element.v_product_code === 'Range Accrual Swap'
            ) {
                return;
            }

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

        const SbHashmap = {};
        const sumPairCurrencyAndRiskFactorHashmap = {};
        for (const key in weightedSensitivityHashmap) {
            for (const numberOfYear in weightedSensitivityHashmap[key]) {
                if (!SbHashmap[key]) {
                    SbHashmap[key] = 0;
                }
                SbHashmap[key] = calculate(weightedSensitivityHashmap[key][numberOfYear], SbHashmap[key], '+');
                for (const numberOfYear2 in weightedSensitivityHashmap[key]) {
                    if (!sumPairCurrencyAndRiskFactorHashmap[key]) {
                        sumPairCurrencyAndRiskFactorHashmap[key] = 0;
                    }
                    // Time bucket correlation
                    let timeBucketCorrelation = 1;
                    if (numberOfYear !== numberOfYear2) {
                        // Time bucket correlation =MIN(IF(X$3=$W4,1,MIN(EXP(-3%*ABS($W4-X$3)/MIN($W4,X$3)),1)),1)
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

                        if (isLow) {
                            // Time bucket correlation =MIN(IF(X$3=$W4,1,MIN(EXP(-3%*ABS($W4-X$3)/MIN($W4,X$3)),1)),1)*IF(X$3=$W4,1,0.75)
                            timeBucketCorrelation = calculate(timeBucketCorrelation, 0.75, '*');
                        } else if (isHigh) {
                            // Time bucket correlation =MIN(MIN(IF(X$3=$W4,1,MIN(EXP(-3%*ABS($W4-X$3)/MIN($W4,X$3)),1)),1)*1.25,1)
                            timeBucketCorrelation = Math.min(calculate(timeBucketCorrelation, 1.25, '*'), 1);
                        }
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

        const KbHashmap = {};
        for (const key in sumPairCurrencyAndRiskFactorHashmap) {
            KbHashmap[key] = Math.sqrt(sumPairCurrencyAndRiskFactorHashmap[key]);
        }

        for (const key in KbHashmap) {
            for (const key2 in KbHashmap) {
                if (key === key2) {
                    total += Math.pow(KbHashmap[key], 2);
                    continue;
                }

                total += calculate(calculate(SbHashmap[key], SbHashmap[key2], '*'), crossbucketCorrelation, '*');
            }
        }

        const VEGA_GIRR = Math.sqrt(total);
        return VEGA_GIRR;
    } catch (error) {
        console.error(`calculate - calVegaGirr - catch error: ${error.message}`);
    }
}
