import distributions from 'distributions';

import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber, yearfrac3 } from '../helper/utils.js';

export default function calAddOnUnmargined1113FX() {
    try {
        const { dataDeal } = db.data;
        const supervisoryOptionVolatilityHashmap = {
            'Interest rate': 0.5,
            'Foreign exchange': 0.15,
            'Credit, Single Name': 1,
            'Credit, Index': 0.8,
            'Equity, Single Name': 1.2,
            'Equity, Index': 0.75,
            Commodity: 1.5,
            IRS: 0.5,
            CCS: 0.5,
            FRA: 0.5,
            FXSWP: 0.5,
            'FW forward': 0.15,
            'FX option': 0.15,
            AAA: 1,
            AA: 1,
            A: 1,
            BBB: 1,
            BB: 1,
            B: 1,
            CCC: 1,
            IG: 0.8,
            SG: 0.8,
            Electricity: 1.5,
            'Oil/Gas': 0.7,
            Metals: 0.7,
            Agricultural: 0.7,
            Other: 0.7,
        };
        const supervisoryFactor = 0.04;
        const effectiveNotionalBucket = {};

        dataDeal.forEach((element) => {
            if (element.V_ASSET_CLASS !== 'Foreign exchange') return;

            // bat dau - can phai xoa
            if (!["FXFWD_6",
                "FXFWD_7"].includes(element.V_INSTRUMENT_CODE)) return;
            // ket thuc - can phai xoa

            // Maturity 
            const maturity = yearfrac3(element.FIC_MIS_DATE, element.D_MATURITY_DATE);
            // Supervisory Option volatility
            const supervisoryOptionVolatility = supervisoryOptionVolatilityHashmap[element.V_UNDERLYING_TYPE_CODE];

            // Supervisory delta
            let supervisoryDelta;
            if (element.V_PRODUCT_TYPE === 'Non-Linear') {
                const x = -calculate(
                    calculate(
                        Math.log(
                            calculate(
                                formatStringNumber(element.N_UNDERLYING_PRICE),
                                formatStringNumber(element.N_STRIKE_PRICE),
                                '/',
                            ),
                        ),
                        calculate(calculate(0.5, Math.pow(supervisoryOptionVolatility, 2), '*'), maturity, '*'),
                        '+',
                    ),
                    calculate(supervisoryOptionVolatility, Math.sqrt(maturity), '*'),
                    '/',
                );
                var normal = distributions.Normal(0, 1);
                supervisoryDelta = -normal.cdf(x);
            } else if (element.V_INSTRUMENT_POSITION === 'Long') {
                supervisoryDelta = 1;
            } else {
                supervisoryDelta = -1;
            }

            // Maturity factor
            const maturityFactor = Math.sqrt(calculate(Math.min(maturity, 1), 1, '/'));

            // Effective notional for each transaction
            const effectiveNotional = calculate(
                calculate(supervisoryDelta, formatStringNumber(element.N_NOTIONAL_AMT), '*'),
                maturityFactor,
                '*',
            );

            // Effective notional for each bucket
            if (element.pair_ccy) {
                if (!effectiveNotionalBucket[element.pair_ccy]) {
                    effectiveNotionalBucket[element.pair_ccy] = 0;
                }

                effectiveNotionalBucket[element.pair_ccy] += effectiveNotional;
            }
        });

        // AddOn
        let total = 0;
        for (const key in effectiveNotionalBucket) {
            // AddOn of each hedging set
            const addOnOfEachHedgingSet = calculate(Math.abs(effectiveNotionalBucket[key]), supervisoryFactor, '*');
            total = calculate(total, addOnOfEachHedgingSet, '+');
        }

        return total;
    } catch (error) {
        console.error(`calculate - calAddOnUnmargined1113FX - catch error: ${error.message}`);
    }
}
