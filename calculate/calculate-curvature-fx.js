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
            if (!element.v_ccy2_code) return;

            const stgSensitivitiesFxHashmapElement = STG_SENSITIVITIES_FX_HASHMAP[element.v_instrument_code] || {};
            const V_PAIR_CCY = `${element.v_ccy_code}/${element.v_ccy2_code}`;
            const stgCurvaturesShockHashmapElement = STG_CURVATURES_SHOCK_HASHMAP[V_PAIR_CCY] || {};

            if (stgSensitivitiesFxHashmapElement.n_curvature_fx) {
                if (sumSensitivityHashmap[V_PAIR_CCY]) {
                    sumSensitivityHashmap[V_PAIR_CCY] = calculate(
                        formatStringNumber(stgSensitivitiesFxHashmapElement.n_curvature_fx),
                        sumSensitivityHashmap[V_PAIR_CCY],
                        '+',
                    );
                } else {
                    sumSensitivityHashmap[V_PAIR_CCY] = calculate(
                        formatStringNumber(stgSensitivitiesFxHashmapElement.n_curvature_fx),
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
            const { v_curvature_fx_pnl, v_curvature_fx_up, v_curvature_fx_down } = STG_CURVATURES_SHOCK_HASHMAP[key];

            const crv = -Math.min(
                calculate(
                    calculate(formatStringNumber(v_curvature_fx_up), formatStringNumber(v_curvature_fx_pnl), '-'),
                    weightedSensitivityHashmap[key],
                    '-',
                ),
                calculate(
                    calculate(formatStringNumber(v_curvature_fx_down), formatStringNumber(v_curvature_fx_pnl), '-'),
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
