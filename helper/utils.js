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
// ("11/14/2032", "11/15/2021") => 10.01
function getRemainingMaturity(time1, time2) {
    return calculate(moment(time1, 'MMDDYYYY').diff(moment(time2, 'MMDDYYYY'), 'days', true), 365, '/');
}
export { formatStringNumber, getRemainingMaturity };
