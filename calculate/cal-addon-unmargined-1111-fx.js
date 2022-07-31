import distributions from 'distributions';

import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber, yearfrac3 } from '../helper/utils.js';

export default function calAddOnUnmargined1111FX() {
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
            if (element.v_asset_class !== 'Foreign exchange') return;

            const maturity = yearfrac3(element.fic_mis_date, element.d_maturity_date);
            const supervisoryOptionVolatility = supervisoryOptionVolatilityHashmap[element.v_underlying_type_code];

            // supervisoryDelta
            let supervisoryDelta;
            if (element.v_option_type === 'Long Put') {
                const x = -calculate(
                    calculate(
                        Math.log(
                            calculate(
                                formatStringNumber(element.n_underlying_price),
                                formatStringNumber(element.n_strike_price),
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
            } else if (element.v_option_type === 'Long Call') {
                const x = calculate(
                    calculate(
                        Math.log(
                            calculate(
                                formatStringNumber(element.n_underlying_price),
                                formatStringNumber(element.n_strike_price),
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
                supervisoryDelta = normal.cdf(x);
            } else if (element.v_option_type === 'Short Call') {
                const x = calculate(
                    calculate(
                        Math.log(
                            calculate(
                                formatStringNumber(element.n_underlying_price),
                                formatStringNumber(element.n_strike_price),
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
            } else if (element.v_option_type === 'Short Put') {
                const x = -calculate(
                    calculate(
                        Math.log(
                            calculate(
                                formatStringNumber(element.n_underlying_price),
                                formatStringNumber(element.n_strike_price),
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
                supervisoryDelta = normal.cdf(x);
            } else {
                if (element.v_instrument_position === 'Long') {
                    supervisoryDelta = 1;
                } else if (element.v_instrument_position === 'Short') {
                    supervisoryDelta = -1;
                }
            }

            // Maturity factor
            const maturityFactor = Math.sqrt(calculate(Math.min(maturity, 1), 1, '/'));

            // Effective notional
            const effectiveNotional = calculate(
                calculate(supervisoryDelta, formatStringNumber(element.n_notional_amt), '*'),
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
        console.error(`calculate - calAddOnUnmargined1111FX - catch error: ${error.message}`);
    }
}
