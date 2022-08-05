import db from '../../helper/db.js';
import { calculate } from '../../helper/operator.js';
import { formatStringNumber } from '../../helper/utils.js';

export default function calRRAO() {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_BANK_POSITIONS_HASHMAP } = db.data;
        return STG_INSTRUMENT_CONTRACT_MASTER.reduce((sum, item) => {
            // N_NOTIONAL_AMT_RCV_LCY
            let nNotionalAmtRcvLcy;
            if (
                item.v_product_code === 'FRA' ||
                item.v_product_code === 'CapFloor' ||
                item.v_product_code === 'Xccy Swaption' ||
                item.v_product_code === 'PRDC Swap' ||
                item.v_product_code === 'Range Accrual Swap'
            ) {
                nNotionalAmtRcvLcy = 0;
            } else {
                const N_NOTIONAL_AMT_RCV_LCY =
                    STG_BANK_POSITIONS_HASHMAP[item.v_instrument_code]?.n_notional_amt_rcv_lcy;
                if (!N_NOTIONAL_AMT_RCV_LCY) return sum;
                nNotionalAmtRcvLcy = N_NOTIONAL_AMT_RCV_LCY;
            }
            let riskWeight = 0;
            if (item.f_exotic_underlying === 'Y') {
                riskWeight = 0.01;
            } else if (item.f_optional === 'Y') {
                riskWeight = 0.001;
            }
            const weightedNotional = calculate(formatStringNumber(nNotionalAmtRcvLcy), riskWeight, '*');
            return sum + weightedNotional;
        }, 0);
    } catch (error) {
        console.error(`calculate - calRRAO - catch error: ${error.message}`);
    }
}
