import db from '../../helper/db.js';
import { calculate } from '../../helper/operator.js';
import { formatStringNumber } from '../../helper/utils.js';

export default function calCurvatureFx(isLow, isHigh) {
    try {
        const {
            STG_INSTRUMENT_CONTRACT_MASTER,
            STG_SENSITIVITIES_FX_HASHMAP,
            STG_CURVATURES_SHOCK_HASHMAP,
            V_CURVATURE_FX_NORMAL_HASHMAP,
            V_CURVATURE_FX_UP_HASHMAP,
            V_CURVATURE_FX_DOWN_HASHMAP,
        } = db.data;
        const sumSensitivityHashmap = {};
        // Crossbucket correlation
        let crossbucketCorrelation = 0.36;
        if (isLow) {
            crossbucketCorrelation = 0.2025;
        } else if (isHigh) {
            crossbucketCorrelation = 0.5625;
        }
        const riskWeight = 0.15;
        let total = 0;

        STG_INSTRUMENT_CONTRACT_MASTER.forEach((element) => {
            if (!element.v_ccy2_code) return;

            const stgSensitivitiesFxHashmapElement = STG_SENSITIVITIES_FX_HASHMAP[element.v_instrument_code] || {};
            const V_PAIR_CCY = `${element.v_ccy_code}/${element.v_ccy2_code}`;

            if (
                element.v_product_code === 'FRA' ||
                element.v_product_code === 'CapFloor' ||
                element.v_product_code === 'Xccy Swaption' ||
                element.v_product_code === 'PRDC Swap' ||
                element.v_product_code === 'Range Accrual Swap'
            ) {
                return;
            }

            if (stgSensitivitiesFxHashmapElement.n_delta_fx && element.f_optional === 'Y') {
                // SUM(SENSITIVITY)
                if (sumSensitivityHashmap[V_PAIR_CCY]) {
                    sumSensitivityHashmap[V_PAIR_CCY] = calculate(
                        formatStringNumber(stgSensitivitiesFxHashmapElement.n_delta_fx),
                        sumSensitivityHashmap[V_PAIR_CCY],
                        '+',
                    );
                } else {
                    sumSensitivityHashmap[V_PAIR_CCY] = calculate(
                        formatStringNumber(stgSensitivitiesFxHashmapElement.n_delta_fx),
                        0,
                        '+',
                    );
                }
            }
        });

        // Weighted Sensitivity (WS) (Q)
        const weightedSensitivityHashmap = {};
        for (const key in sumSensitivityHashmap) {
            weightedSensitivityHashmap[key] = calculate(sumSensitivityHashmap[key], riskWeight, '*');
        }

        const crvHashmap = {};
        const kbHashmap = {};
        for (const key in weightedSensitivityHashmap) {
            // const { v_curvature_fx_pnl, v_curvature_fx_up, v_curvature_fx_down } = STG_CURVATURES_SHOCK_HASHMAP[key];

            // V_CURVATURE_FX_NORMAL_HASHMAP J
            // V_CURVATURE_FX_UP_HASHMAP K
            // V_CURVATURE_FX_DOWN_HASHMAP L

            // CRV (U) =-MIN(S4-R4-Q4,T4-R4+Q4)
            // =-MIN(K4-J4-Q4,L4-J4+Q4)
            const crv = -Math.min(
                calculate(
                    calculate(V_CURVATURE_FX_UP_HASHMAP[key], V_CURVATURE_FX_NORMAL_HASHMAP[key], '-'),
                    weightedSensitivityHashmap[key],
                    '-',
                ),
                calculate(
                    calculate(V_CURVATURE_FX_DOWN_HASHMAP[key], V_CURVATURE_FX_NORMAL_HASHMAP[key], '-'),
                    weightedSensitivityHashmap[key],
                    '+',
                ),
            );

            crvHashmap[key] = crv;
            // Kb (V) =SQRT(MAX(0,MAX(0,U4)^2))
            kbHashmap[key] = Math.sqrt(Math.max(0, Math.pow(Math.max(0, crv), 2)));
        }

        for (const key in weightedSensitivityHashmap) {
            for (const key2 in weightedSensitivityHashmap) {
                if (key === key2) {
                    // =IF(Z$3=$Y4,INDEX($V:$V,MATCH($Y4,$N:$N,0))^2,INDEX($U:$U,MATCH($Y4,$N:$N,0))*INDEX($U:$U,MATCH(Z$3,$N:$N,0))*IF(AND(INDEX($U:$U,MATCH($Y4,$N:$N,0))<0,INDEX($U:$U,MATCH(Z$3,$N:$N,0))<0),0,1)*IF(Z$3=$Y4,1,$W$4))
                    total = calculate(Math.pow(kbHashmap[key], 2), total, '+');
                    continue;
                }
                if (crvHashmap[key] < 0 && crvHashmap[key2] < 0) {
                    // IF(AND(INDEX($U:$U,MATCH($Y4,$N:$N,0))<0,INDEX($U:$U,MATCH(Z$3,$N:$N,0))<0),0,1)
                    // nho hon 0 thi phep tinh se nhan voi 0 => ket qua = 0 => bo qua, khong tinh
                    continue;
                }
                // =IF(Z$3=$Y4,INDEX($V:$V,MATCH($Y4,$N:$N,0))^2,INDEX($U:$U,MATCH($Y4,$N:$N,0))*INDEX($U:$U,MATCH(Z$3,$N:$N,0))*IF(AND(INDEX($U:$U,MATCH($Y4,$N:$N,0))<0,INDEX($U:$U,MATCH(Z$3,$N:$N,0))<0),0,1)*IF(Z$3=$Y4,1,$W$4))
                total = calculate(
                    calculate(calculate(crvHashmap[key], crvHashmap[key2], '*'), crossbucketCorrelation, '*'),
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
