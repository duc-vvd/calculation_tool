import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

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
            const stgBankPositionsHashmapElement = STG_BANK_POSITIONS_HASHMAP[element.V_INSTRUMENT_CODE] || {};

            const N_NOTIONAL_AMT_RCV_LCY = formatStringNumber(stgBankPositionsHashmapElement.N_NOTIONAL_AMT_RCV_LCY);
            const N_PNL = formatStringNumber(stgBankPositionsHashmapElement.N_PNL);
            let V_COUNTERPARTY = element.V_CUST_REF_CODE;

            if (element.V_PRODUCT_CODE === 'GOVBOND' || element.V_PRODUCT_CODE === 'CORPBOND') {
                V_COUNTERPARTY = element.V_ISSUER_CODE;
            }
            const V_COUNTERPARTY_RATING = STG_PARTY_RATING_DETAILS_HASHMAP[V_COUNTERPARTY].V_RATING_CODE;

            const JTD = calculate(
                calculate(
                    formatStringNumber(element.N_LGD),
                    formatStringNumber(stgBankPositionsHashmapElement.N_NOTIONAL_AMT_RCV_LCY),
                    '*',
                ),
                formatStringNumber(stgBankPositionsHashmapElement.N_PNL),
                '+',
            );
            const JTDlong = Math.max(JTD, 0);
            const JTDshort = Math.min(JTD, 0);
            const JTDshortAbs = Math.abs(JTDshort);
            const riskWeight = counterpartyRatingRiskWeight[V_COUNTERPARTY_RATING];
            const weightedJTDLong = calculate(JTDlong, riskWeight, '*');
            const weightedJTDshortAbs = calculate(JTDshortAbs, riskWeight, '*');

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
