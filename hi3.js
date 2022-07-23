import moment from 'moment';

// console.log(moment('9/30/2020', 'MMDDYYYY').isBefore(moment('11/15/2021', 'MMDDYYYY')));

// console.log(moment('9/30/2022', 'MMDDYYYY').diff(moment('11/15/2021', 'MMDDYYYY'), 'days', true));

// function yearfrac3(time1, time2) {
//     return moment(time2, 'MMDDYYYY').diff(moment(time1, 'MMDDYYYY'), 'days', true) / 365;
// }

function yearfrac(time1, time2) {
    return moment(time2, 'MMDDYYYY').diff(moment(time1, 'MMDDYYYY'), 'days', true) / 360;
}

// console.log(yearfrac3('11/15/2021', '11/15/2031'));
// console.log(yearfrac('11/15/2021', '11/15/2031'));
console.log(yearfrac('11/15/2021', '11/15/2029'));

// function hi() {
//     const N = 10;
//     const CY = 4;
//     const y = 0.04;

//     const result = N * (1 - CY / y) + (CY / y) * (1 - 1 / Math.pow(1 + y, N)) * ((1 + y) / y);
//     // console.log(result);
// }
// hi();
// function hi1() {
//     const n = 1;
//     const FA = 10000000;
//     const y = 0.127;
//     const T = 5;
//     const I = 0;

//     const result =
//         (1 + y / n) / (y / n) -
//         (1 + y / n + n * T * (1 / FA - y / n)) / ((1 / FA) * (Math.pow(1 + y / n, n * T) - 1) + y / n);
//     console.log(result);
// }
// hi1();
// import pkg from 'normal-distribution';
// const { NormalDistribution } = pkg;
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

// sibling-module.js is a CommonJS module.
// const siblingModule = require('./sibling-module');

// const NormalDistribution = require('normal-distribution');

// const normDist = new NormalDistribution(0, 1);

// console.log(normDist.pdf(-0, 4106953163));

// import distributions from 'distributions';

// var normal = distributions.Normal(0, 1);

// console.log(normal.pdf(-0.4106953163));
// console.log(normal.cdf(-0.4106953163));

// console.log(moment('11/15/2031', 'MMDDYYYY').diff(moment('11/15/2021', 'MMDDYYYY'), 'days', true));

// const result = [
//     'Aaa',
//     'Aa1',
//     'Aa2',
//     'Aa3',
//     'A1',
//     'A2',
//     'A3',
//     'Baa1',
//     'Baa2',
//     'Baa3',
//     'AAA',
//     'AA+',
//     'AA',
//     'AA-',
//     'A+',
//     'A',
//     'A-',
//     'BBB+',
//     'BBB',
//     'BBB-',
//     'AAA',
//     'AA+',
//     'AA',
//     'AA-',
//     'A+',
//     'A',
//     'A-',
//     'BBB+',
//     'BBB',
//     'BBB-',
// ].reduce((obj, cur) => {
//     if (obj[cur]) {
//         obj[cur]++;
//     } else {
//         obj[cur] = 1;
//     }
//     return obj;
// }, {});

// console.log(JSON.stringify(result));
