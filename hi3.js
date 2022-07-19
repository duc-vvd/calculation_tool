import moment from 'moment';

// console.log(moment('11/14/2032', 'MMDDYYYY').diff(moment('11/15/2021', 'MMDDYYYY'), 'days', true));

const result = [
    'Aaa',
    'Aa1',
    'Aa2',
    'Aa3',
    'A1',
    'A2',
    'A3',
    'Baa1',
    'Baa2',
    'Baa3',
    'AAA',
    'AA+',
    'AA',
    'AA-',
    'A+',
    'A',
    'A-',
    'BBB+',
    'BBB',
    'BBB-',
    'AAA',
    'AA+',
    'AA',
    'AA-',
    'A+',
    'A',
    'A-',
    'BBB+',
    'BBB',
    'BBB-',
].reduce((obj, cur) => {
    if (obj[cur]) {
        obj[cur]++;
    } else {
        obj[cur] = 1;
    }
    return obj;
}, {});

console.log(JSON.stringify(result));
