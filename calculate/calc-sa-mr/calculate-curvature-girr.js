import db from '../../helper/db.js';
import { calculate } from '../../helper/operator.js';
import { formatStringNumber } from '../../helper/utils.js';

export default function calCurvatureGirr(isLow, isHigh) {
    try {
        const {
            STG_INSTRUMENT_CONTRACT_MASTER,
            STG_SENSITIVITIES_GIRR_HASHMAP,
            V_CURVATURE_GIRR_NORMAL_HASHMAP,
            V_CURVATURE_GIRR_UP_HASHMAP,
            V_CURVATURE_GIRR_DOWN_HASHMAP,
        } = db.data;
        const sumSensitivityHashmap = {};
        let crossbucketCorrelation = 0.25;
        if (isLow) {
            crossbucketCorrelation = Math.pow(0.375, 2);
        } else if (isHigh) {
            crossbucketCorrelation = Math.pow(0.625, 2);
        }
        const riskWeight = 0.024;
        let total = 0;

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
            if (element.f_optional !== 'Y') {
                return;
            }

            if (element.v_ccy_code) {
                if (!sumSensitivityHashmap[element.v_ccy_code]) {
                    sumSensitivityHashmap[element.v_ccy_code] = 0;
                }
                // N_CURVATURE_GIRR_1ST_CCY
                const nCurvatureGirr1stCcy = calculate(
                    calculate(
                        calculate(
                            calculate(
                                calculate(
                                    calculate(
                                        calculate(
                                            calculate(
                                                calculate(
                                                    stgSensitivitiesGirrHashmapElement.n_delta_girr_1st_ccy_a_quarter_of_year,
                                                    stgSensitivitiesGirrHashmapElement.n_delta_girr_1st_ccy_half_a_year,
                                                    '+',
                                                ),
                                                stgSensitivitiesGirrHashmapElement.n_delta_girr_1st_ccy_1year,
                                                '+',
                                            ),
                                            stgSensitivitiesGirrHashmapElement.n_delta_girr_1st_ccy_2year,
                                            '+',
                                        ),
                                        stgSensitivitiesGirrHashmapElement.n_delta_girr_1st_ccy_3year,
                                        '+',
                                    ),
                                    stgSensitivitiesGirrHashmapElement.n_delta_girr_1st_ccy_5year,
                                    '+',
                                ),
                                stgSensitivitiesGirrHashmapElement.n_delta_girr_1st_ccy_10year,
                                '+',
                            ),
                            stgSensitivitiesGirrHashmapElement.n_delta_girr_1st_ccy_15year,
                            '+',
                        ),
                        stgSensitivitiesGirrHashmapElement.n_delta_girr_1st_ccy_20year,
                        '+',
                    ),
                    stgSensitivitiesGirrHashmapElement.n_delta_girr_1st_ccy_30year,
                    '+',
                );
                // SUM(SENSITIVITY)
                sumSensitivityHashmap[element.v_ccy_code] = calculate(
                    nCurvatureGirr1stCcy,
                    sumSensitivityHashmap[element.v_ccy_code],
                    '+',
                );
            }

            if (element.v_ccy2_code) {
                if (!sumSensitivityHashmap[element.v_ccy2_code]) {
                    sumSensitivityHashmap[element.v_ccy2_code] = 0;
                }
                // N_CURVATURE_GIRR_2ND_CCY
                const nCurvatureGirr2ndCcy = calculate(
                    calculate(
                        calculate(
                            calculate(
                                calculate(
                                    calculate(
                                        calculate(
                                            calculate(
                                                calculate(
                                                    stgSensitivitiesGirrHashmapElement.n_delta_girr_2nd_ccy_a_quarter_of_year,
                                                    stgSensitivitiesGirrHashmapElement.n_delta_girr_2nd_ccy_half_a_year,
                                                    '+',
                                                ),
                                                stgSensitivitiesGirrHashmapElement.n_delta_girr_2nd_ccy_1year,
                                                '+',
                                            ),
                                            stgSensitivitiesGirrHashmapElement.n_delta_girr_2nd_ccy_2year,
                                            '+',
                                        ),
                                        stgSensitivitiesGirrHashmapElement.n_delta_girr_2nd_ccy_3year,
                                        '+',
                                    ),
                                    stgSensitivitiesGirrHashmapElement.n_delta_girr_2nd_ccy_5year,
                                    '+',
                                ),
                                stgSensitivitiesGirrHashmapElement.n_delta_girr_2nd_ccy_10year,
                                '+',
                            ),
                            stgSensitivitiesGirrHashmapElement.n_delta_girr_2nd_ccy_15year,
                            '+',
                        ),
                        stgSensitivitiesGirrHashmapElement.n_delta_girr_2nd_ccy_20year,
                        '+',
                    ),
                    stgSensitivitiesGirrHashmapElement.n_delta_girr_2nd_ccy_30year,
                    '+',
                );
                // SUM(SENSITIVITY)
                sumSensitivityHashmap[element.v_ccy2_code] = calculate(
                    nCurvatureGirr2ndCcy,
                    sumSensitivityHashmap[element.v_ccy2_code],
                    '+',
                );
            }
        });

        // Weighted Sensitivity (WS) (S)
        const weightedSensitivityHashmap = {};
        for (const key in sumSensitivityHashmap) {
            weightedSensitivityHashmap[key] = calculate(sumSensitivityHashmap[key], riskWeight, '*');
        }

        // CVR
        const crvHashmap = {};
        // Kb
        const kbHashmap = {};

        // V_CURVATURE_GIRR_NORMAL_HASHMAP L
        // V_CURVATURE_GIRR_UP_HASHMAP M
        // V_CURVATURE_GIRR_DOWN_HASHMAP N
        for (const key in weightedSensitivityHashmap) {
            // CVR (W) =-MIN(U4-T4-S4,V4-T4+S4)
            // -MIN(M-L-S,N-L+S)
            const crv = -Math.min(
                calculate(
                    calculate(V_CURVATURE_GIRR_UP_HASHMAP[key], V_CURVATURE_GIRR_NORMAL_HASHMAP[key], '-'),
                    weightedSensitivityHashmap[key],
                    '-',
                ),
                calculate(
                    calculate(V_CURVATURE_GIRR_DOWN_HASHMAP[key], V_CURVATURE_GIRR_NORMAL_HASHMAP[key], '-'),
                    weightedSensitivityHashmap[key],
                    '+',
                ),
            );

            crvHashmap[key] = crv;
            // Kb (X) =SQRT(MAX(0,MAX(0,W4)^2))
            kbHashmap[key] = Math.sqrt(Math.max(0, Math.pow(Math.max(0, crv), 2)));
        }

        for (const key in weightedSensitivityHashmap) {
            if (!crvHashmap[key]) continue;
            for (const key2 in weightedSensitivityHashmap) {
                if (!crvHashmap[key2]) continue;
                let crossbucketCorrelationTmp = crossbucketCorrelation;
                let tmp = 1;
                if (crvHashmap[key] < 0 && crvHashmap[key2] < 0) {
                    tmp = 0;
                }
                if (key === key2) {
                    crossbucketCorrelationTmp = 1;

                    // // =IF(AB$3=$AA4,INDEX($X:$X,MATCH($AA4,$P:$P,0))^2,INDEX($W:$W,MATCH($AA4,$P:$P,0))*INDEX($W:$W,MATCH(AB$3,$P:$P,0))*IF(AND(INDEX($W:$W,MATCH($AA4,$P:$P,0))<0,INDEX($W:$W,MATCH(AB$3,$P:$P,0))<0),0,1)*IF(AB$3=$AA4,1,$Y$4))
                    total = calculate(Math.pow(kbHashmap[key], 2), total, '+');
                    continue;
                }

                // =IF(AB$3=$AA4,INDEX($X:$X,MATCH($AA4,$P:$P,0))^2,INDEX($W:$W,MATCH($AA4,$P:$P,0))*INDEX($W:$W,MATCH(AB$3,$P:$P,0))*IF(AND(INDEX($W:$W,MATCH($AA4,$P:$P,0))<0,INDEX($W:$W,MATCH(AB$3,$P:$P,0))<0),0,1)*IF(AB$3=$AA4,1,$Y$4))
                total = calculate(
                    calculate(
                        calculate(calculate(crvHashmap[key], crvHashmap[key2], '*'), tmp, '*'),
                        crossbucketCorrelationTmp,
                        '*',
                    ),
                    total,
                    '+',
                );
            }
        }

        const CURVATURE_GIRR = Math.sqrt(total);
        return CURVATURE_GIRR;
    } catch (error) {
        console.error(`calculate - calCurvatureGirr - catch error: ${error.message}`);
    }
}
