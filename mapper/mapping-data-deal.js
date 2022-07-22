import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { yearfrac3 } from '../helper/utils.js';

export default function mappingDataDeal() {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER_2 } = db.data;
        const dataDeal = JSON.parse(JSON.stringify(STG_INSTRUMENT_CONTRACT_MASTER_2));
        const creditRatingHashmap = {
            Aaa: 1,
            Aa1: 1,
            Aa2: 1,
            Aa3: 1,
            A1: 1,
            A2: 1,
            A3: 1,
            Baa1: 1,
            Baa2: 1,
            Baa3: 1,
            AAA: 2,
            'AA+': 2,
            AA: 2,
            'AA-': 2,
            'A+': 2,
            A: 2,
            'A-': 2,
            'BBB+': 2,
            BBB: 2,
            'BBB-': 2,
        };
        const dataDealHashmap = {};
        dataDeal.forEach((element) => {
            if (
                element.V_CTR_CCY_CODE &&
                element.V_CTR_CCY_CODE !== 'N/A' &&
                element.V_CCY_CODE &&
                element.V_CCY_CODE !== 'N/A'
            ) {
                element.pair_ccy = `${element.V_CCY_CODE}/${element.V_CTR_CCY_CODE}`;
            }

            element.remaining_maturity = yearfrac3(element.FIC_MIS_DATE, element.D_MATURITY_DATE);

            // if (element.CREDIT_RATING_OF_COUNTERPARTY && element.CREDIT_RATING_OF_COUNTERPARTY !== 'N/A') {
            if (creditRatingHashmap[element.CREDIT_RATING_OF_COUNTERPARTY] === 1) {
                element.credit_rating = 'IG';
            } else {
                element.credit_rating = 'HY and NR';
            }
            // }

            dataDealHashmap[element.V_INSTRUMENT_CODE] = element;
        });

        db.data.dataDeal = dataDeal;
        db.data.dataDealHashmap = dataDealHashmap;
        db.write();
    } catch (error) {
        console.error(`mapper - mappingDataDeal - catch error: ${error.message}`);
    }
}
