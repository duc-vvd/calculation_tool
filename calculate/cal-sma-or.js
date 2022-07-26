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
                        formatStringNumber(row['Actual balance in quarter n-8']),
                        formatStringNumber(row['Actual balance in quarter n-9']),
                        '+',
                    ),
                    formatStringNumber(row['Actual balance in quarter n-10']),
                    '+',
                ),
                formatStringNumber(row['Actual balance in quarter n-11']),
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
                        formatStringNumber(row['Actual balance in quarter n-4']),
                        formatStringNumber(row['Actual balance in quarter n-5']),
                        '+',
                    ),
                    formatStringNumber(row['Actual balance in quarter n-6']),
                    '+',
                ),
                formatStringNumber(row['Actual balance in quarter n-7']),
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
                        formatStringNumber(row['Actual balance in quarter n']),
                        formatStringNumber(row['Actual balance in quarter n-1']),
                        '+',
                    ),
                    formatStringNumber(row['Actual balance in quarter n-2']),
                    '+',
                ),
                formatStringNumber(row['Actual balance in quarter n-3']),
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
                    calculate(formatStringNumber(row['Quarter n-16']), formatStringNumber(row['Quarter n-17']), '+'),
                    formatStringNumber(row['Quarter n-18']),
                    '+',
                ),
                formatStringNumber(row['Quarter n-19']),
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
                    calculate(formatStringNumber(row['Quarter n-12']), formatStringNumber(row['Quarter n-13']), '+'),
                    formatStringNumber(row['Quarter n-14']),
                    '+',
                ),
                formatStringNumber(row['Quarter n-15']),
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
                    calculate(formatStringNumber(row['Quarter n-8']), formatStringNumber(row['Quarter n-9']), '+'),
                    formatStringNumber(row['Quarter n-10']),
                    '+',
                ),
                formatStringNumber(row['Quarter n-11']),
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
                    calculate(formatStringNumber(row['Quarter n-4']), formatStringNumber(row['Quarter n-5']), '+'),
                    formatStringNumber(row['Quarter n-6']),
                    '+',
                ),
                formatStringNumber(row['Quarter n-7']),
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
                    calculate(formatStringNumber(row['Quarter n']), formatStringNumber(row['Quarter n-1']), '+'),
                    formatStringNumber(row['Quarter n-2']),
                    '+',
                ),
                formatStringNumber(row['Quarter n-3']),
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
        let LEAverage;
        let LIAverage;
        let OOEAverage;
        let OOIAverage;
        let FIAverage;
        let FEAverage;
        let NetPLTradingBookAverage;
        let NetPLBankingBookAverage;
        let TALverage;
        let TAL10verage;
        let TAL100verage;

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
                    LEAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 5:
                    LIAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 6:
                    OOEAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 7:
                    OOIAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 8:
                    FIAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 9:
                    FEAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 10:
                    NetPLTradingBookAverage = calFinancialDataGlActualBalanceAverage(element);
                    break;
                case 11:
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
                    TALverage = calOperationalRiskLossDataAverage(element);
                    break;
                case 1:
                    TAL10verage = calOperationalRiskLossDataAverage(element);
                    break;
                case 2:
                    TAL100verage = calOperationalRiskLossDataAverage(element);
                    break;

                default:
                    break;
            }
        }

        const IDLC = calculate(
            calculate(
                Math.min(Math.abs(calculate(IIAverage, IEAverage, '-')), calculate(0.035, IEAAverage, '*')),
                Math.abs(calculate(LIAverage, LEAverage, '-')),
                '+',
            ),
            DIAverage,
            '+',
        );

        const FC = calculate(Math.abs(NetPLTradingBookAverage), Math.abs(NetPLBankingBookAverage), '+');

        const uBI = calculate(
            calculate(calculate(IDLC, Math.max(OOIAverage, OOEAverage), '+'), Math.max(FIAverage, FEAverage), '+'),
            FC,
            '+',
        );

        const SC = calculate(
            Math.max(OOIAverage, OOEAverage),
            Math.max(
                Math.abs(calculate(FIAverage, FEAverage, '-')),
                Math.min(
                    calculate(
                        calculate(Math.max(FIAverage, FEAverage), calculate(0.5, uBI, '*'), '+'),
                        calculate(0.1, calculate(Math.max(FIAverage, FEAverage), calculate(0.5, uBI, '*'), '-'), '*'),
                        '+',
                    )
                ),
            ),
            '+',
        );

        const BI = calculate(calculate(IDLC, SC, '+'), FC, '+');

        let BIComponent;
        if (BI < 1000) {
            BIComponent = calculate(0.11, BI, '*');
        } else if (BI <= 3000) {
            BIComponent = calculate(110, calculate(0.15, calculate(BI, 1000, '-'), '*'), '+');
        } else if (BI <= 10000) {
            BIComponent = calculate(410, calculate(0.19, calculate(BI, 3000, '-'), '*'), '+');
        } else if (BI <= 30000) {
            BIComponent = calculate(1740, calculate(0.23, calculate(BI, 10000, '-'), '*'), '+');
        } else {
            BIComponent = calculate(6340, calculate(0.29, calculate(BI, 30000, '-'), '*'), '+');
        }

        const lossComponent = calculate(
            calculate(calculate(7, TALverage, '*'), calculate(7, TAL10verage, '*'), '+'),
            calculate(7, TAL100verage, '*'),
            '+',
        );

        const ILM = Math.log(calculate(Math.exp(-1) - 1, calculate(lossComponent, BIComponent, '/'), '+'));

        let SMAOR;
        if (BI <= 1000) {
            SMAOR = BIComponent;
        } else {
            SMAOR = calculate(110, calculate(calculate(BIComponent, 110, '-'), ILM, '*'), '+');
        }

        const SMAORVND = calculate(calculate(SMAOR, Math.pow(10, 6), '*'), exchangeRate, '*');

        return {
            sma_or: SMAOR,
            sma_or_vnd: SMAORVND,
        };
    } catch (error) {
        console.error(`calculate - calSMAOR - catch error: ${error.message}`);
    }
}
