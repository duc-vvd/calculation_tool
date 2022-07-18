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
            const stgSensitivitiesGirrHashmapElement = STG_SENSITIVITIES_GIRR_HASHMAP[element.V_INSTRUMENT_CODE] || {};

            if (element.V_CCY_CODE) {
                if (!sumSensitivityHashmap[element.V_CCY_CODE]) {
                    sumSensitivityHashmap[element.V_CCY_CODE] = 0;
                }
                if (stgSensitivitiesGirrHashmapElement.N_CURVATURE_GIRR_1ST_CCY) {
                    sumSensitivityHashmap[element.V_CCY_CODE] = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.N_CURVATURE_GIRR_1ST_CCY),
                        sumSensitivityHashmap[element.V_CCY_CODE],
                        '+',
                    );
                }
            }

            if (element.V_CCY2_CODE) {
                if (!sumSensitivityHashmap[element.V_CCY2_CODE]) {
                    sumSensitivityHashmap[element.V_CCY2_CODE] = 0;
                }
                if (stgSensitivitiesGirrHashmapElement.N_CURVATURE_GIRR_2ND_CCY) {
                    sumSensitivityHashmap[element.V_CCY2_CODE] = calculate(
                        formatStringNumber(stgSensitivitiesGirrHashmapElement.N_CURVATURE_GIRR_2ND_CCY),
                        sumSensitivityHashmap[element.V_CCY2_CODE],
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
            const { V_CURVATURE_GIRR_PNL, V_CURVATURE_GIRR_UP, V_CURVATURE_GIRR_DOWN } =
                STG_CURVATURES_SHOCK_HASHMAP[key];

            const crv = -Math.min(
                calculate(
                    calculate(formatStringNumber(V_CURVATURE_GIRR_UP), formatStringNumber(V_CURVATURE_GIRR_PNL), '-'),
                    weightedSensitivityHashmap[key],
                    '-',
                ),
                calculate(
                    calculate(formatStringNumber(V_CURVATURE_GIRR_DOWN), formatStringNumber(V_CURVATURE_GIRR_PNL), '-'),
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
