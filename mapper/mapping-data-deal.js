import moment from 'moment';
import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';

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
            if (element.V_SUB_CLASS) {
                element.pair_ccy = `${element.V_CCY_CODE}/${element.V_SUB_CLASS}`;
            }

            element.remaining_maturity = calculate(
                moment('11/14/2032', 'MMDDYYYY').diff(moment('11/15/2021', 'MMDDYYYY'), 'days', true),
                365,
                '/',
            );

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
