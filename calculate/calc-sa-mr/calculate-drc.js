import db from '../../helper/db.js';
import { calculate } from '../../helper/operator.js';
import { formatStringNumber } from '../../helper/utils.js';

export default function calDRC() {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER, STG_BANK_POSITIONS_HASHMAP, STG_PARTY_RATING_DETAILS_HASHMAP } =
            db.data;
        const counterpartyRatingRiskWeight = {
            AAA: 0.005,
            AA: 0.02,
            A: 0.03,
            BBB: 0.06,
            Unrated: 0.15,
            BB: 0.15,
            B: 0.3,
            CCC: 0.5,
            CC: 0.5,
            C: 0.5,
            D: 1,
        };
        let sumJTDlong = 0;
        let sumJTDshortAbs = 0;
        let sumWeightedJTDLong = 0;
        let sumWeightedJTDshortAbs = 0;

        STG_INSTRUMENT_CONTRACT_MASTER.forEach((element) => {
            const stgBankPositionsHashmapElement = STG_BANK_POSITIONS_HASHMAP[element.v_instrument_code] || {};

            // N_NOTIONAL_AMT_RCV_LCY (D)
            let nNotionalAmtRcvLcy;
            // N_MTM_VALUE_LCY (E)
            let nMtmValueLcy;
            // N_LGD (F)
            let nLgd;
            if (
                element.v_product_code === 'FRA' ||
                element.v_product_code === 'CapFloor' ||
                element.v_product_code === 'Xccy Swaption' ||
                element.v_product_code === 'PRDC Swap' ||
                element.v_product_code === 'Range Accrual Swap'
            ) {
                nNotionalAmtRcvLcy = 0;
                nMtmValueLcy = 0;
                nLgd = 0;
            } else {
                nNotionalAmtRcvLcy = formatStringNumber(stgBankPositionsHashmapElement.n_notional_amt_rcv_lcy);
                nMtmValueLcy = formatStringNumber(stgBankPositionsHashmapElement.n_mtm_value_lcy);
                nLgd = formatStringNumber(element.n_lgd);
            }

            let V_COUNTERPARTY = element.v_cust_ref_code;

            if (element.v_product_code === 'GOVBOND' || element.v_product_code === 'CORPBOND') {
                V_COUNTERPARTY = element.v_issuer_code;
            }
            const V_COUNTERPARTY_RATING = STG_PARTY_RATING_DETAILS_HASHMAP[V_COUNTERPARTY].v_rating_code;

            // PnL (N)
            let pnl = calculate(nMtmValueLcy, nNotionalAmtRcvLcy, '-');

            // =F4*D4+N4
            const JTD = calculate(calculate(nLgd, nNotionalAmtRcvLcy, '*'), pnl, '+');
            const JTDlong = Math.max(JTD, 0);
            const JTDshort = Math.min(JTD, 0);
            const JTDshortAbs = Math.abs(JTDshort);
            const riskWeight = counterpartyRatingRiskWeight[V_COUNTERPARTY_RATING];
            const weightedJTDLong = calculate(JTDlong, riskWeight, '*');
            const weightedJTDshortAbs = calculate(JTDshortAbs, riskWeight, '*');

            // console.log(
            //     `=== ${element.v_instrument_code} - ${JTDlong} - ${JTDshort} - ${JTDshortAbs} - ${riskWeight} - ${weightedJTDLong} - ${weightedJTDshortAbs}`,
            // );
            sumJTDlong += JTDlong;
            sumJTDshortAbs += JTDshortAbs;
            sumWeightedJTDLong += weightedJTDLong;
            sumWeightedJTDshortAbs += weightedJTDshortAbs;
        });
        const DRC = calculate(
            sumWeightedJTDLong,
            calculate(
                calculate(sumJTDlong, calculate(sumJTDlong, sumJTDshortAbs, '+'), '/'),
                sumWeightedJTDshortAbs,
                '*',
            ),
            '-',
        );

        return DRC;
    } catch (error) {
        console.error(`calculate - calDRC - catch error: ${error.message}`);
    }
}
