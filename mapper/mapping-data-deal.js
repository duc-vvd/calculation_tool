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
                element.v_ctr_ccy_code &&
                element.v_ctr_ccy_code !== 'N/A' &&
                element.v_ccy_code &&
                element.v_ccy_code !== 'N/A'
            ) {
                element.pair_ccy = `${element.v_ccy_code}/${element.v_ctr_ccy_code}`;
            }

            element.remaining_maturity = yearfrac3(element.fic_mis_date, element.d_maturity_date);

            // if (element.credit_rating_of_counterparty && element.credit_rating_of_counterparty !== 'N/A') {
            if (creditRatingHashmap[element.credit_rating_of_counterparty] === 1) {
                element.credit_rating = 'IG';
            } else {
                element.credit_rating = 'HY and NR';
            }
            // }

            dataDealHashmap[element.v_instrument_code] = element;
        });

        db.data.dataDeal = dataDeal;
        db.data.dataDealHashmap = dataDealHashmap;
        db.write();
    } catch (error) {
        console.error(`mapper - mappingDataDeal - catch error: ${error.message}`);
    }
}
