import calAddOnUnmargined1115CR from './cal-addon-unmargined-1115-cr.js';

import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

export default function calEADUnmargined1115() {
    try {
        const addOnUnmargined1115CR = calAddOnUnmargined1115CR();
        const { dataDeal } = db.data;
        const nettingCode = 1115;

        // alpha
        const alpha = 1.4;

        // V
        let v = 0;
        let nCollateralCcpAmtTotal = 0;
        let nCollateralBankAmtTotal = 0;
        dataDeal.forEach((element) => {
            if (element.f_margin === 'N') {
                nCollateralCcpAmtTotal = calculate(element.n_collateral_ccp_amt, nCollateralCcpAmtTotal, '+');
                if (element.v_netting_code == nettingCode) {
                    v = calculate(formatStringNumber(element.n_market_value), v, '+');
                    nCollateralBankAmtTotal = calculate(
                        formatStringNumber(element.n_collateral_bank_amt),
                        nCollateralBankAmtTotal,
                        '+',
                    );
                }
            }
        });

        // C
        const c = calculate(nCollateralCcpAmtTotal, nCollateralBankAmtTotal, '-');

        // RC
        const rc = Math.max(calculate(v, c, '-'), 0);

        // AddOn (aggregate)
        const addonAggregate = addOnUnmargined1115CR;

        // Mulitplier
        let mulitplier = 0;
        if (v > c) {
            mulitplier = 1;
        } else {
            mulitplier = Math.min(
                1,
                calculate(
                    0.05,
                    calculate(
                        1 - 0.05,
                        Math.exp(
                            calculate(
                                calculate(v, c, '-'),
                                calculate(2, calculate(1 - 0.05, addonAggregate, '*'), '*'),
                                '/',
                            ),
                        ),
                        '*',
                    ),
                    '+',
                ),
            );
        }

        // PFE
        const pfe = calculate(mulitplier, addonAggregate, '*');

        // EAD
        const ead = calculate(alpha, calculate(rc, pfe, '+'), '*');
        return ead;
    } catch (error) {
        console.error(`calculate - calEADUnmargined1115 - catch error: ${error.message}`);
    }
}
