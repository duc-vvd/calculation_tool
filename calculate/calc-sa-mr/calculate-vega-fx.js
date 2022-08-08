import db from '../../helper/db.js';
import { calculate } from '../../helper/operator.js';
import { formatStringNumber } from '../../helper/utils.js';

export default function calVegaFx(isLow, isHigh) {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_SENSITIVITIES_FX_HASHMAP } = db.data;
        const sumSensitivityHashmap = {};
        let crossbucketCorrelation = 0.6;
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
            if (!element.v_ccy2_code?.length) return;
            const stgSensitivitiesFxHashmapElement = STG_SENSITIVITIES_FX_HASHMAP[element.v_instrument_code] || {};
            const V_PAIR_CCY = `${element.v_ccy_code}/${element.v_ccy2_code}`;

            if (!sumSensitivityHashmap[V_PAIR_CCY]) {
                sumSensitivityHashmap[V_PAIR_CCY] = {
                    halfAYear: 0,
                    aYear: 0,
                    threeYear: 0,
                    fiveYear: 0,
                    tenYear: 0,
                };
            }

            // N_VEGA_FX_0.5YEAR
            let nVegaFxHalfAYear;
            // N_VEGA_FX_1YEAR
            let nVegaFx1Year;
            // N_VEGA_FX_3YEAR
            let nVegaFx3Year;
            // N_VEGA_FX_5YEAR
            let nVegaFx5Year;
            // N_VEGA_FX_10YEAR
            let nVegaFx10Year;

            if (
                element.v_product_code === 'FRA' ||
                element.v_product_code === 'CapFloor' ||
                element.v_product_code === 'Xccy Swaption' ||
                element.v_product_code === 'PRDC Swap' ||
                element.v_product_code === 'Range Accrual Swap'
            ) {
                nVegaFxHalfAYear = 0;
                nVegaFx1Year = 0;
                nVegaFx3Year = 0;
                nVegaFx5Year = 0;
                nVegaFx10Year = 0;
            } else {
                nVegaFxHalfAYear = stgSensitivitiesFxHashmapElement.n_vega_fx_half_a_year;
                nVegaFx1Year = stgSensitivitiesFxHashmapElement.n_vega_fx_1year;
                nVegaFx3Year = stgSensitivitiesFxHashmapElement.n_vega_fx_3year;
                nVegaFx5Year = stgSensitivitiesFxHashmapElement.n_vega_fx_5year;
                nVegaFx10Year = stgSensitivitiesFxHashmapElement.n_vega_fx_10year;
            }

            if (nVegaFxHalfAYear) {
                sumSensitivityHashmap[V_PAIR_CCY].halfAYear = calculate(
                    formatStringNumber(nVegaFxHalfAYear),
                    sumSensitivityHashmap[V_PAIR_CCY].halfAYear,
                    '+',
                );
            }
            if (nVegaFx1Year) {
                sumSensitivityHashmap[V_PAIR_CCY].aYear = calculate(
                    formatStringNumber(nVegaFx1Year),
                    sumSensitivityHashmap[V_PAIR_CCY].aYear,
                    '+',
                );
            }
            if (nVegaFx3Year) {
                sumSensitivityHashmap[V_PAIR_CCY].threeYear = calculate(
                    formatStringNumber(nVegaFx3Year),
                    sumSensitivityHashmap[V_PAIR_CCY].threeYear,
                    '+',
                );
            }
            if (nVegaFx5Year) {
                sumSensitivityHashmap[V_PAIR_CCY].fiveYear = calculate(
                    formatStringNumber(nVegaFx5Year),
                    sumSensitivityHashmap[V_PAIR_CCY].fiveYear,
                    '+',
                );
            }
            if (nVegaFx10Year) {
                sumSensitivityHashmap[V_PAIR_CCY].tenYear = calculate(
                    formatStringNumber(nVegaFx10Year),
                    sumSensitivityHashmap[V_PAIR_CCY].tenYear,
                    '+',
                );
            }
        });

        // Weighted Sensitivity (WS)
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
        // Sb (AG) =SUMIF($K:$K,$AE4,$O:$O)
        const SbHashmap = {};
        const sumPairCurrencyAndRiskFactorHashmap = {};
        for (const key in weightedSensitivityHashmap) {
            for (const numberOfYear in weightedSensitivityHashmap[key]) {
                if (!SbHashmap[key]) {
                    SbHashmap[key] = 0;
                }
                // Sb (AG) =SUMIF($K:$K,$AE4,$O:$O)
                SbHashmap[key] = calculate(weightedSensitivityHashmap[key][numberOfYear], SbHashmap[key], '+');
                for (const numberOfYear2 in weightedSensitivityHashmap[key]) {
                    if (!sumPairCurrencyAndRiskFactorHashmap[key]) {
                        sumPairCurrencyAndRiskFactorHashmap[key] = 0;
                    }
                    // Time bucket correlation (P) =IF(R$3=$Q4,1,MIN(EXP(-1%*ABS($Q4-R$3)/MIN($Q4,R$3)),1))
                    let timeBucketCorrelation = 1;
                    if (numberOfYear !== numberOfYear2) {
                        timeBucketCorrelation = Math.min(
                            Math.exp(
                                calculate(
                                    calculate(
                                        -0.01,
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
                            // Time bucket correlation =IF(R$3=$Q4,1,MAX(2*MIN(EXP(-1%*ABS($Q4-R$3)/MIN($Q4,R$3)),1)-1,0.75*MIN(EXP(-1%*ABS($Q4-R$3)/MIN($Q4,R$3)),1)))
                            // =IF(R$3=$Q4,1,MAX(2*timeBucketCorrelation-1,0.75*timeBucketCorrelation))
                            timeBucketCorrelation = Math.max(calculate(calculate(2,timeBucketCorrelation, '*'),1,'-'),calculate(0.75,timeBucketCorrelation, '*'));
                        } else if (isHigh) {
                            // Time bucket correlation =MIN(IF(R$3=$Q4,1,MIN(EXP(-1%*ABS($Q4-R$3)/MIN($Q4,R$3)),1))*1.25,1)
                            timeBucketCorrelation = Math.min(calculate(timeBucketCorrelation, 1.25, '*'), 1);
                        }
                    }

                    // Kb (AF) =SQRT(SUM(Y4:AC8))
                    // (Y4) =SUMIFS($O:$O,$K:$K,$X$3,$L:$L,Y$3)*SUMIFS($O:$O,$K:$K,$X$3,$L:$L,$X4)*R4
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

        // Kb (AF) =SQRT(SUM(Y4:AC8))
        // (Y4) =SUMIFS($O:$O,$K:$K,$X$3,$L:$L,Y$3)*SUMIFS($O:$O,$K:$K,$X$3,$L:$L,$X4)*R4
        const KbHashmap = {};
        for (const key in sumPairCurrencyAndRiskFactorHashmap) {
            KbHashmap[key] = Math.sqrt(sumPairCurrencyAndRiskFactorHashmap[key]);
        }

        for (const key in KbHashmap) {
            for (const key2 in KbHashmap) {
                if (key === key2) {
                    // =IF(AK$3=$AJ4,INDEX($AF:$AF,MATCH($AJ4,$AE:$AE,0))^2,INDEX($AG:$AG,MATCH(AK$3,$AE:$AE,0))*INDEX($AG:$AG,MATCH($AJ4,$AE:$AE,0))*$AH$4)
                    total += Math.pow(KbHashmap[key], 2);
                    continue;
                }
                // =IF(AK$3=$AJ4,INDEX($AF:$AF,MATCH($AJ4,$AE:$AE,0))^2,INDEX($AG:$AG,MATCH(AK$3,$AE:$AE,0))*INDEX($AG:$AG,MATCH($AJ4,$AE:$AE,0))*$AH$4)
                total += calculate(calculate(SbHashmap[key], SbHashmap[key2], '*'), crossbucketCorrelation, '*');
            }
        }

        const VEGA_FX = Math.sqrt(total);
        return VEGA_FX;
    } catch (error) {
        console.error(`calculate - calVegaFx - catch error: ${error.message}`);
    }
}
