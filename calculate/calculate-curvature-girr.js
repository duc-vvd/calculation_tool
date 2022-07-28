import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

export default function calCurvatureGirr() {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_SENSITIVITIES_GIRR_HASHMAP, STG_CURVATURES_SHOCK_HASHMAP } =
            db.data;
        const sumSensitivityHashmap = {};
        const crossbucketCorrelation = 0.25;
        const riskWeight = 0.024;
        let total = 0;

        STG_INSTRUMENT_CONTRACT_MASTER.forEach((element) => {
            const stgSensitivitiesGirrHashmapElement = STG_SENSITIVITIES_GIRR_HASHMAP[element.v_instrument_code] || {};

            if (element.v_ccy_code) {
                if (!sumSensitivityHashmap[element.v_ccy_code]) {
                    sumSensitivityHashmap[element.v_ccy_code] = 0;
                }
                if (stgSensitivitiesGirrHashmapElement.n_curvature_girr_1st_ccy) {
                    sumSensitivityHashmap[element.v_ccy_code] = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_curvature_girr_1st_ccy),
                        sumSensitivityHashmap[element.v_ccy_code],
                        '+',
                    );
                }
            }

            if (element.v_ccy2_code) {
                if (!sumSensitivityHashmap[element.v_ccy2_code]) {
                    sumSensitivityHashmap[element.v_ccy2_code] = 0;
                }
                if (stgSensitivitiesGirrHashmapElement.n_curvature_girr_2nd_ccy) {
                    sumSensitivityHashmap[element.v_ccy2_code] = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.n_curvature_girr_2nd_ccy),
                        sumSensitivityHashmap[element.v_ccy2_code],
                        '+',
                    );
                }
            }
        });

        const weightedSensitivityHashmap = {};
        for (const key in sumSensitivityHashmap) {
            weightedSensitivityHashmap[key] = calculate(sumSensitivityHashmap[key], riskWeight, '*');
        }

        const crvHashmap = {};
        const kbHashmap = {};
        for (const key in weightedSensitivityHashmap) {
            if (!STG_CURVATURES_SHOCK_HASHMAP[key]) continue;
            const { v_curvature_girr_pnl, v_curvature_girr_up, v_curvature_girr_down } =
                STG_CURVATURES_SHOCK_HASHMAP[key];

            const crv = -Math.min(
                calculate(
                    calculate(formatStringNumber(v_curvature_girr_up), formatStringNumber(v_curvature_girr_pnl), '-'),
                    weightedSensitivityHashmap[key],
                    '-',
                ),
                calculate(
                    calculate(formatStringNumber(v_curvature_girr_down), formatStringNumber(v_curvature_girr_pnl), '-'),
                    weightedSensitivityHashmap[key],
                    '+',
                ),
            );

            crvHashmap[key] = crv;
            kbHashmap[key] = Math.sqrt(Math.max(0, Math.pow(Math.max(0, crv), 2)));
        }

        for (const key in weightedSensitivityHashmap) {
            if (!crvHashmap[key]) continue;
            for (const key2 in weightedSensitivityHashmap) {
                if (!crvHashmap[key2]) continue;
                let crossbucketCorrelationTmp = crossbucketCorrelation;
                let tmp = 1;
                if (key === key2) {
                    crossbucketCorrelationTmp = 1;
                }
                if (crvHashmap[key] < 0 && crvHashmap[key2] < 0) {
                    tmp = 0;
                }

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
