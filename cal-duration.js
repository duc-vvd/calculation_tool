// import { yearfrac3, yearfrac1 } from './helper/utils.js';
// import { calculate } from './helper/operator.js';
import moment from 'moment';

// // IRS_10003	1112			4

// function durationExcel(extractionDate, maturityDateOfContract, interestRate, notionalAmountInLcy) {
//     const hi = yearfrac1(extractionDate, maturityDateOfContract);
//     // if (hi < 2) {
//     //     return hi;
//     // }
//     const period = Math.round(hi);

//     let totalCashflow = 0;
//     let totalNumerator = 0;
//     for (let i = 1; i <= period; i++) {
//         let cashflow = calculate(calculate(interestRate, 100, '/'), notionalAmountInLcy, '*');
//         if (i === period) {
//             cashflow = calculate(cashflow, notionalAmountInLcy, '+');
//         }
//         const numerator = calculate(i, cashflow, '*');

//         totalCashflow = calculate(cashflow, totalCashflow, '+');
//         totalNumerator = calculate(numerator, totalNumerator, '+');
//     }

//     const result = calculate(totalNumerator, totalCashflow, '/');

//     return result;
// }

// function durationExcel2(extractionDate, maturityDateOfContract, interestRate, notionalAmountInLcy) {
//     if (moment(extractionDate, 'MMDDYYYY').isAfter(moment(maturityDateOfContract, 'MMDDYYYY'))) {
//         throw new Error('durationExcel - input data invalid');
//     }

//     let period = yearfrac3(extractionDate, maturityDateOfContract);
//     if (period > 3) {
//         period = Math.round(period);
//     }
//     let cashflow = calculate(
//         calculate(calculate(interestRate, 100, '/'), notionalAmountInLcy, '*'),
//         notionalAmountInLcy,
//         '+',
//     );
//     let numerator = calculate(period, cashflow, '*');
//     let totalCashflow = cashflow;
//     let totalNumerator = numerator;

//     let timeAYearAgo = moment(maturityDateOfContract, 'MMDDYYYY').subtract(1, 'years').format('MMDDYYYY');

//     while (moment(extractionDate, 'MMDDYYYY').isBefore(moment(timeAYearAgo, 'MMDDYYYY'))) {
//         period = yearfrac3(extractionDate, timeAYearAgo);
//         if (period > 3) {
//             period = Math.round(period);
//         }
//         cashflow = cashflow = calculate(calculate(interestRate, 100, '/'), notionalAmountInLcy, '*');
//         numerator = calculate(period, cashflow, '*');
//         totalCashflow = calculate(cashflow, totalCashflow, '+');
//         totalNumerator = calculate(numerator, totalNumerator, '+');
//         timeAYearAgo = moment(timeAYearAgo, 'MMDDYYYY').subtract(1, 'years').format('MMDDYYYY');
//     }

//     const result = calculate(totalNumerator, totalCashflow, '/');
//     return result;
// }

function yearFrac(time1, time2) {
    const months = Math.floor(moment(time2, 'MMDDYYYY').diff(moment(time1, 'MMDDYYYY'), 'months', true));
    const timeTmp = moment(time1, 'MMDDYYYY').subtract(-months, 'months').format('MMDDYYYY');
    const days = Math.floor(moment(time2, 'MMDDYYYY').diff(moment(timeTmp, 'MMDDYYYY'), 'days', true));
    const result = (months + days / 30) / 12;
    return result;
}

console.log(yearFrac('11/15/2028', '11/19/2031'));
