import distributions from 'distributions';

import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber, yearfrac3, yearfrac, getStartDate } from '../helper/utils.js';

export default function calAddOnUnmargined1111IRD() {
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
            if (element.V_ASSET_CLASS !== 'Interest rate') return;
            if (!element.V_CCY_CODE) return;

            // bat dau - can phai xoa
            if (!["IRS_10001",
                "IRS_10002",
                "CCS_1.2",
                "CCS_2.2",
                "FXSWP_1.2",
                "FXSWP_2.2",
                "CCS_1.1",
                "CCS_2.1",
                "FXSWP_1.1",
                "FXSWP_2.1"].includes(element.V_INSTRUMENT_CODE)) return;
            // ket thuc - can phai xoa

            // Maturity
            let maturity = yearfrac(element.FIC_MIS_DATE, element.D_MATURITY_DATE);
            // Start date
            const startDate = getStartDate(element.D_EFFECTIVE_DATE, element.D_MATURITY_DATE);
            // End date
            let endDate = yearfrac(element.FIC_MIS_DATE, element.D_MATURITY_DATE_UNDERLYING);

            if (element.V_CCY_CODE === 'USD') {
                maturity = yearfrac3(element.FIC_MIS_DATE, element.D_MATURITY_DATE);
                endDate = yearfrac3(element.FIC_MIS_DATE, element.D_MATURITY_DATE_UNDERLYING);
            }
            // Supervisory Duration
            const supervisoryDuration = calculate(
                calculate(Math.exp(calculate(-0.05, startDate, '*')), Math.exp(calculate(-0.05, endDate, '*')), '-'),
                0.05,
                '/',
            );
            // Adjusted notional
            const adjustedNotional = calculate(formatStringNumber(element.N_NOTIONAL_AMT), supervisoryDuration, '*');
            const supervisoryOptionVolatility = supervisoryOptionVolatilityHashmap[element.V_UNDERLYING_TYPE_CODE];

            // Supervisory delta
            let supervisoryDelta;
            if (element.V_OPTION_TYPE === 'Long Put') {
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
            } else if (element.V_OPTION_TYPE === 'Long Call') {
                const x = calculate(
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
                supervisoryDelta = normal.cdf(x);
            } else if (element.V_OPTION_TYPE === 'Short Call') {
                const x = calculate(
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
            } else if (element.V_OPTION_TYPE === 'Short Put') {
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
                supervisoryDelta = normal.cdf(x);
            } else {
                if (element.V_INSTRUMENT_POSITION === 'Long') {
                    supervisoryDelta = 1;
                } else if (element.V_INSTRUMENT_POSITION === 'Short') {
                    supervisoryDelta = -1;
                }
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
            if (!effectiveNotionalForEachBucket[element.V_CCY_CODE]) {
                effectiveNotionalForEachBucket[element.V_CCY_CODE] = {
                    '1-5 years': 0,
                    'Less than 1 year': 0,
                    'More than 5 years': 0,
                }
            }
            effectiveNotionalForEachBucket[element.V_CCY_CODE][timeBucket] = calculate(
                effectiveNotional,
                effectiveNotionalForEachBucket[element.V_CCY_CODE][timeBucket],
                '+',
            );
        });

        let total = 0
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
            total += result
        }

        return total;
    } catch (error) {
        console.error(`calculate - calAddOnUnmargined1111IRD - catch error: ${error.message}`);
    }
}
