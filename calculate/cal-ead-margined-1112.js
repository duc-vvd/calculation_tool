import calAddOnUnmargined1112IRD from './cal-addon-margined-1112-ird.js';
import calAddOnUnmargined1112CMD from './cal-addon-margined-1112-cmd.js';
import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

export default function calEADMargined1112() {
    try {
        const addOnUnmargined1112IRD = calAddOnUnmargined1112IRD();
        const addOnUnmargined1112CMD = calAddOnUnmargined1112CMD();
        const { dataDeal, STG_NETTING_HASHMAP } = db.data;
        const nettingCode = 1112;
        const stgNetting = STG_NETTING_HASHMAP[nettingCode] || {};

        // alpha
        const alpha = 1.4;

        // V
        let v = 0;
        let nCollateralCcpAmtTotal = 0;
        let nCollateralBankAmtTotal = 0;
        dataDeal.forEach((element) => {
            if (element.f_margin === 'Y') {
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
        const c = stgNetting.n_net ? formatStringNumber(stgNetting.n_net) : stgNetting.n_net;

        // TH
        const th = stgNetting.n_threshold ? formatStringNumber(stgNetting.n_threshold) : stgNetting.n_threshold;

        // MTA
        const mta = stgNetting.n_mta ? formatStringNumber(stgNetting.n_mta) : stgNetting.n_mta;

        // NICA
        const nica = stgNetting.n_nica ? formatStringNumber(stgNetting.n_nica) : stgNetting.n_nica;

        // RC
        const rc = Math.max(calculate(v, c, '-'), calculate(calculate(th, mta, '+'), nica, '-'), 0);

        // AddOn (aggregate)
        const addonAggregate = calculate(addOnUnmargined1112IRD, addOnUnmargined1112CMD, '+');

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
        console.error(`calculate - calEADMargined1112 - catch error: ${error.message}`);
    }
}
