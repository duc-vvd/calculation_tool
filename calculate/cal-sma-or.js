import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

const exchangeRate = 28482;

function calFinancialDataGlActualBalanceAverage(row) {
    // Year n-2
    const yearN2 = calculate(
        calculate(
            calculate(
                calculate(
                    calculate(
                        formatStringNumber(row.actual_balance_in_quarter_n_8),
                        formatStringNumber(row.actual_balance_in_quarter_n_9),
                        '+',
                    ),
                    formatStringNumber(row.actual_balance_in_quarter_n_10),
                    '+',
                ),
                formatStringNumber(row.actual_balance_in_quarter_n_11),
                '+',
            ),
            exchangeRate,
            '/',
        ),
        Math.pow(10, 6),
        '/',
    );
    // Year n-1
    const yearN1 = calculate(
        calculate(
            calculate(
                calculate(
                    calculate(
                        formatStringNumber(row.actual_balance_in_quarter_n_4),
                        formatStringNumber(row.actual_balance_in_quarter_n_5),
                        '+',
                    ),
                    formatStringNumber(row.actual_balance_in_quarter_n_6),
                    '+',
                ),
                formatStringNumber(row.actual_balance_in_quarter_n_7),
                '+',
            ),
            exchangeRate,
            '/',
        ),
        Math.pow(10, 6),
        '/',
    );
    // Year n
    const yearN = calculate(
        calculate(
            calculate(
                calculate(
                    calculate(
                        formatStringNumber(row.actual_balance_in_quarter_n),
                        formatStringNumber(row.actual_balance_in_quarter_n_1),
                        '+',
                    ),
                    formatStringNumber(row.actual_balance_in_quarter_n_2),
                    '+',
                ),
                formatStringNumber(row.actual_balance_in_quarter_n_3),
                '+',
            ),
            exchangeRate,
            '/',
        ),
        Math.pow(10, 6),
        '/',
    );

    const average = calculate(calculate(calculate(yearN2, yearN1, '+'), yearN, '+'), 3, '/');

    return average;
}

function calOperationalRiskLossDataAverage(row) {
    // Year n-4
    const yearN4 = calculate(
        calculate(
            calculate(
                calculate(
                    calculate(formatStringNumber(row.quarter_n_16), formatStringNumber(row.quarter_n_17), '+'),
                    formatStringNumber(row.quarter_n_18),
                    '+',
                ),
                formatStringNumber(row.quarter_n_19),
                '+',
            ),
            exchangeRate,
            '/',
        ),
        Math.pow(10, 6),
        '/',
    );
    // Year n-3
    const yearN3 = calculate(
        calculate(
            calculate(
                calculate(
                    calculate(formatStringNumber(row.quarter_n_12), formatStringNumber(row.quarter_n_13), '+'),
                    formatStringNumber(row.quarter_n_14),
                    '+',
                ),
                formatStringNumber(row.quarter_n_15),
                '+',
            ),
            exchangeRate,
            '/',
        ),
        Math.pow(10, 6),
        '/',
    );
    // Year n-2
    const yearN2 = calculate(
        calculate(
            calculate(
                calculate(
                    calculate(formatStringNumber(row.quarter_n_8), formatStringNumber(row.quarter_n_9), '+'),
                    formatStringNumber(row.quarter_n_10),
                    '+',
                ),
                formatStringNumber(row.quarter_n_11),
                '+',
            ),
            exchangeRate,
            '/',
        ),
        Math.pow(10, 6),
        '/',
    );
    // Year n-1
    const yearN1 = calculate(
        calculate(
            calculate(
                calculate(
                    calculate(formatStringNumber(row.quarter_n_4), formatStringNumber(row.quarter_n_5), '+'),
                    formatStringNumber(row.quarter_n_6),
                    '+',
                ),
                formatStringNumber(row.quarter_n_7),
                '+',
            ),
            exchangeRate,
            '/',
        ),
        Math.pow(10, 6),
        '/',
    );
    // Year n
    const yearN = calculate(
        calculate(
            calculate(
                calculate(
                    calculate(formatStringNumber(row.quarter_n), formatStringNumber(row.quarter_n_1), '+'),
                    formatStringNumber(row.quarter_n_2),
                    '+',
                ),
                formatStringNumber(row.quarter_n_3),
                '+',
            ),
            exchangeRate,
            '/',
        ),
        Math.pow(10, 6),
        '/',
    );

    const average = calculate(
        calculate(calculate(calculate(calculate(yearN4, yearN3, '+'), yearN2, '+'), yearN1, '+'), yearN, '+'),
        5,
        '/',
    );

    return average;
}
export default function calSMAOR() {
    try {
        const { FINANCIAL_DATA_GL_ACTUAL_BALANCE, OPERATIONAL_RISK_LOSS_DATA } = db.data;

        let IIAverage;
        let IEAverage;
        let IEAAverage;
        let DIAverage;
        let OOEAverage;
        let OOIAverage;
        let FIAverage;
        let FEAverage;
        let NetPLTradingBookAverage;
        let NetPLBankingBookAverage;
        let LCAverage;

        for (let i = 0; i < FINANCIAL_DATA_GL_ACTUAL_BALANCE.length; i++) {
            const element = FINANCIAL_DATA_GL_ACTUAL_BALANCE[i];
            switch (i) {
                case 0:
                    IIAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 1:
                    IEAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 2:
                    IEAAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 3:
                    DIAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 4:
                    OOEAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 5:
                    OOIAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 6:
                    FIAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 7:
                    FEAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 8:
                    NetPLTradingBookAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 9:
                    NetPLBankingBookAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                default:
                    break;
            }
        }

        for (let i = 0; i < OPERATIONAL_RISK_LOSS_DATA.length; i++) {
            const element = OPERATIONAL_RISK_LOSS_DATA[i];

            switch (i) {
                case 0:
                    LCAverage = calOperationalRiskLossDataAverage(element);
                    break;
                default:
                    break;
            }
        }

        const IDLC = calculate(Math.min(Math.abs(calculate(IIAverage,IEAverage,'-')),calculate(0.025,IEAAverage,'*')),DIAverage,'+')

        const SC = calculate(Math.max(OOEAverage,OOIAverage),Math.max(FIAverage,FEAverage),'+')

        const FC = calculate(Math.abs(NetPLTradingBookAverage),Math.abs(NetPLBankingBookAverage),'+')

        const BI = calculate(calculate(IDLC, SC, '+'), FC, '+');

        let BIComponent;
        if (BI <= 1000) {
            BIComponent = calculate(0.12, BI, '*');
        }  else if (BI <= 30000) {
            BIComponent = calculate(120, calculate(0.15, calculate(BI, 1000, '-'), '*'), '+');
        } else {
            BIComponent = calculate(120+4350, calculate(0.18, calculate(BI, 30000, '-'), '*'), '+');
        }

        const ILM = Math.log(calculate(Math.exp(1) - 1, Math.pow(calculate(LCAverage, BIComponent, '/'),0.8), '+'));

        let SMA_OR;
        if (BI <= 1000) {
            SMA_OR = BIComponent;
        } else {
            SMA_OR = calculate(BIComponent, ILM, '*');
        }

        const SMA_OR_VND = calculate(calculate(SMA_OR, Math.pow(10, 6), '*'), exchangeRate, '*');

        return {
            IDLC,
            SC,
            FC,
            BI,
            BI_Component: BIComponent,
            ILM,
            SMA_OR,
            SMA_OR_VND,
        };
    } catch (error) {
        console.error(`calculate - calSMAOR - catch error: ${error.message}`);
    }
}
