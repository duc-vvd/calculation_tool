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
            if (element.F_MARGIN === 'Y') {
                nCollateralCcpAmtTotal = calculate(element.N_COLLATERAL_CCP_AMT, nCollateralCcpAmtTotal, '+');
                if (element.V_NETTING_CODE == nettingCode) {
                    v = calculate(formatStringNumber(element.N_MARKET_VALUE), v, '+');
                    nCollateralBankAmtTotal = calculate(
                        formatStringNumber(element.N_COLLATERAL_BANK_AMT),
                        nCollateralBankAmtTotal,
                        '+',
                    );
                }
            }
        });

        // C
        const c = stgNetting.N_NET ? formatStringNumber(stgNetting.N_NET) : stgNetting.N_NET;

        // TH
        const th = stgNetting.N_THRESHOLD ? formatStringNumber(stgNetting.N_THRESHOLD) : stgNetting.N_THRESHOLD;

        // MTA
        const mta = stgNetting.N_MTA ? formatStringNumber(stgNetting.N_MTA) : stgNetting.N_MTA;

        // NICA
        const nica = stgNetting.N_NICA ? formatStringNumber(stgNetting.N_NICA) : stgNetting.N_NICA;

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
