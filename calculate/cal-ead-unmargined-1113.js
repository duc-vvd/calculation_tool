import calAddOnUnmargined1113FX from './cal-addon-unmargined-1113-fx.js';

import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

export default function calEADUnmargined1113() {
    try {
        const addOnUnmargined1113FX = calAddOnUnmargined1113FX();
        const { dataDeal } = db.data;
        const nettingCode = 1113

        // alpha	
        const alpha = 1.4

        // V
        let v = 0
        let nCollateralCcpAmtTotal = 0
        let nCollateralBankAmtTotal = 0
        dataDeal.forEach(element => {
            if (element.F_MARGIN === 'N') {
                nCollateralCcpAmtTotal = calculate(element.N_COLLATERAL_CCP_AMT, nCollateralCcpAmtTotal, '+')
                if (element.V_NETTING_CODE == nettingCode) {
                    v = calculate(formatStringNumber(element.N_MARKET_VALUE), v, '+')
                    nCollateralBankAmtTotal = calculate(formatStringNumber(element.N_COLLATERAL_BANK_AMT), nCollateralBankAmtTotal, '+')
                }
            }
        });

        // C
        const c = calculate(nCollateralCcpAmtTotal, nCollateralBankAmtTotal, '-')

        // RC 
        const rc = Math.max(calculate(v, c, '-'), 0)

        // AddOn (aggregate)	
        const addonAggregate = addOnUnmargined1113FX;

        // Mulitplier	
        let mulitplier = 0;
        if (v > c) {
            mulitplier = 1
        } else {
            mulitplier = Math.min(1, calculate(0.05, calculate((1 - 0.05), Math.exp(calculate(calculate(v, c, '-'), calculate(2, calculate((1 - 0.05), addonAggregate, '*'), '*'), '/')), '*'), '+'))
        }

        // PFE	
        const pfe = calculate(mulitplier, addonAggregate, '*')

        // EAD	
        const ead = calculate(alpha, calculate(rc, pfe, '+'), '*')
        return ead;
    } catch (error) {
        console.error(`calculate - calEADUnmargined1113 - catch error: ${error.message}`);
    }
}
