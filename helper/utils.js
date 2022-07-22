import moment from 'moment';
import { calculate } from './operator.js';

// 71.403,09 => 71403.09
function formatStringNumber(strNum) {
    if (!strNum) return strNum;
    // neu co ky tu () thi la so am, vi du: (71.403,09) => -71403,09
    if (strNum.match(/[()]/g)) {
        return `-${strNum.toString().replace(/[.()]/g, '').replace(/[,]/g, '.')}`;
    }
    return strNum.toString().replace(/[.]/g, '').replace(/[,]/g, '.');
}

// ("11/15/2021","11/14/2032") => 10
function yearfrac(time1, time2) {
    return Math.round(calculate(moment(time2, 'MMDDYYYY').diff(moment(time1, 'MMDDYYYY'), 'days', true), 360, '/'));
}

// ("11/15/2021","11/14/2032") => 10.01
function yearfrac3(time1, time2) {
    return calculate(moment(time2, 'MMDDYYYY').diff(moment(time1, 'MMDDYYYY'), 'days', true), 365, '/');
}

// =IF(9/30/2020<11/15/2021;0;YEARFRAC(9/30/2020;11/15/2021))
function getStartDate(time1, time2) {
    if (moment(time1, 'MMDDYYYY').isBefore(moment(time2, 'MMDDYYYY'))) {
        return 0;
    }

    return yearfrac(time1, time2);
}

export { formatStringNumber, yearfrac, yearfrac3, getStartDate };
