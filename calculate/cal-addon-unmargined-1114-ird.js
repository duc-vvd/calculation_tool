import distributions from 'distributions';

import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber, yearfrac3, yearfrac, getStartDate } from '../helper/utils.js';

export default function calAddOnUnmargined1114IRD() {
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
        const supervisoryFactor = 0.005;
        const effectiveNotionalForEachBucket = {};

        dataDeal.forEach((element) => {
            if (element.v_asset_class !== 'Interest rate') return;
            if (!element.v_ccy_code) return;

            // Maturity
            let maturity = yearfrac(element.fic_mis_date, element.d_maturity_date);
            // Start date
            const startDate = getStartDate(element.d_effective_date, element.d_maturity_date);
            // End date
            let endDate = yearfrac(element.fic_mis_date, element.d_maturity_date_underlying);

            if (element.v_ccy_code === 'USD') {
                maturity = yearfrac3(element.fic_mis_date, element.d_maturity_date);
                endDate = yearfrac3(element.fic_mis_date, element.d_maturity_date_underlying);
            }
            // Supervisory Duration
            const supervisoryDuration = calculate(
                calculate(Math.exp(calculate(-0.05, startDate, '*')), Math.exp(calculate(-0.05, endDate, '*')), '-'),
                0.05,
                '/',
            );
            // Adjusted notional
            const adjustedNotional = calculate(formatStringNumber(element.n_notional_amt), supervisoryDuration, '*');
            const supervisoryOptionVolatility = supervisoryOptionVolatilityHashmap[element.v_underlying_type_code];

            // Supervisory delta
            let supervisoryDelta;
            if (element.v_product_type === 'Non-Linear') {
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
            } else if (element.v_instrument_position === 'Long') {
                supervisoryDelta = 1;
            } else {
                supervisoryDelta = -1;
            }

            // Time bucket
            let timeBucket = '1-5 years';
            if (endDate < 5) {
                timeBucket = 'Less than 1 year';
            } else if (endDate > 5) {
                timeBucket = 'More than 5 years';
            }

            // Maturity factor
            const maturityFactor = Math.sqrt(calculate(Math.min(maturity, 1), 1, '/'));

            // Effective notional for ech transaction
            const effectiveNotional = calculate(
                calculate(supervisoryDelta, adjustedNotional, '*'),
                maturityFactor,
                '*',
            );

            // Effective notional for each bucket
            if (!effectiveNotionalForEachBucket[element.v_ccy_code]) {
                effectiveNotionalForEachBucket[element.v_ccy_code] = {
                    '1-5 years': 0,
                    'Less than 1 year': 0,
                    'More than 5 years': 0,
                };
            }
            effectiveNotionalForEachBucket[element.v_ccy_code][timeBucket] = calculate(
                effectiveNotional,
                effectiveNotionalForEachBucket[element.v_ccy_code][timeBucket],
                '+',
            );
        });

        let total = 0;
        for (const key in effectiveNotionalForEachBucket) {
            // Effective notional for each hedging set
            const effectiveNotionalForUSDHedgingSet = Math.sqrt(
                calculate(
                    Math.pow(effectiveNotionalForEachBucket[key]['Less than 1 year'], 2),
                    calculate(
                        Math.pow(effectiveNotionalForEachBucket[key]['1-5 years'], 2),
                        calculate(
                            Math.pow(effectiveNotionalForEachBucket[key]['More than 5 years'], 2),
                            calculate(
                                calculate(
                                    1.4,
                                    calculate(
                                        effectiveNotionalForEachBucket[key]['Less than 1 year'],
                                        effectiveNotionalForEachBucket[key]['1-5 years'],
                                        '*',
                                    ),
                                    '*',
                                ),
                                calculate(
                                    calculate(
                                        1.4,
                                        calculate(
                                            effectiveNotionalForEachBucket[key]['1-5 years'],
                                            effectiveNotionalForEachBucket[key]['More than 5 years'],
                                            '*',
                                        ),
                                        '*',
                                    ),
                                    calculate(
                                        calculate(
                                            0.6,
                                            calculate(
                                                effectiveNotionalForEachBucket[key]['Less than 1 year'],
                                                effectiveNotionalForEachBucket[key]['More than 5 years'],
                                                '*',
                                            ),
                                            '*',
                                        ),
                                    ),
                                    '+',
                                ),
                                '+',
                            ),
                            '+',
                        ),
                        '+',
                    ),
                    '+',
                ),
            );

            // AddOn
            const result = calculate(effectiveNotionalForUSDHedgingSet, supervisoryFactor, '*');
            total += result;
        }

        return total;
    } catch (error) {
        console.error(`calculate - calAddOnUnmargined1114IRD - catch error: ${error.message}`);
    }
}
