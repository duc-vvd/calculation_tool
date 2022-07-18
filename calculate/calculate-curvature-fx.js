import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

export default function calCurvatureFx() {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_SENSITIVITIES_FX_HASHMAP, STG_CURVATURES_SHOCK_HASHMAP } = db.data;
        const sumSensitivityHashmap = {};
        const crossbucketCorrelation = 0.36;
        const riskWeight = 0.3;
        let total = 0;

        STG_INSTRUMENT_CONTRACT_MASTER.forEach((element) => {
            if (!element.V_CCY2_CODE) return;

            const stgSensitivitiesFxHashmapElement = STG_SENSITIVITIES_FX_HASHMAP[element.V_INSTRUMENT_CODE] || {};
            const V_PAIR_CCY = `${element.V_CCY_CODE}/${element.V_CCY2_CODE}`;
            const stgCurvaturesShockHashmapElement = STG_CURVATURES_SHOCK_HASHMAP[V_PAIR_CCY] || {};

            if (stgSensitivitiesFxHashmapElement.N_CURVATURE_FX) {
                if (V_PAIR_CCY === 'EUR/USD') {
                    console.log(
                        `=== ${formatStringNumber(stgSensitivitiesFxHashmapElement.N_CURVATURE_FX)} - ${
                            element.V_INSTRUMENT_CODE
                        }`,
                    );
                }
                if (sumSensitivityHashmap[V_PAIR_CCY]) {
                    sumSensitivityHashmap[V_PAIR_CCY] = calculate(
                        formatStringNumber(stgSensitivitiesFxHashmapElement.N_CURVATURE_FX),
                        sumSensitivityHashmap[V_PAIR_CCY],
                        '+',
                    );
                } else {
                    sumSensitivityHashmap[V_PAIR_CCY] = calculate(
                        formatStringNumber(stgSensitivitiesFxHashmapElement.N_CURVATURE_FX),
                        0,
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
            const { V_CURVATURE_FX_PNL, V_CURVATURE_FX_UP, V_CURVATURE_FX_DOWN } = STG_CURVATURES_SHOCK_HASHMAP[key];

            const crv = -Math.min(
                calculate(
                    calculate(formatStringNumber(V_CURVATURE_FX_UP), formatStringNumber(V_CURVATURE_FX_PNL), '-'),
                    weightedSensitivityHashmap[key],
                    '-',
                ),
                calculate(
                    calculate(formatStringNumber(V_CURVATURE_FX_DOWN), formatStringNumber(V_CURVATURE_FX_PNL), '-'),
                    weightedSensitivityHashmap[key],
                    '+',
                ),
            );

            crvHashmap[key] = crv;
            kbHashmap[key] = Math.sqrt(Math.max(0, Math.pow(Math.max(0, crv), 2)));
        }

        for (const key in weightedSensitivityHashmap) {
            for (const key2 in weightedSensitivityHashmap) {
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

        const CURVATURE_FX = Math.sqrt(total);
        return CURVATURE_FX;
    } catch (error) {
        console.error(`calculate - calCurvatureFx - catch error: ${error.message}`);
    }
}
