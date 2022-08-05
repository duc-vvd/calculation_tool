import moment from 'moment';
import distributions from 'distributions';
import { calculate } from './operator.js';
import { dbManager } from '../database/index.js';
import { ROLE_NAME_ROLE_ID, FORMAT_TIME_IN_FILE } from '../common/enum.js';

// 71.403,09 => 71403.09
function formatStringNumber(strNum) {
    if (!strNum || typeof strNum === 'number') return strNum;
    // neu co ky tu () thi la so am, vi du: (71.403,09) => -71403,09
    if (strNum.match(/[()]/g)) {
        return `-${strNum.toString().replace(/[.()]/g, '').replace(/[,]/g, '.')}`;
    }
    return strNum.toString().replace(/[.]/g, '').replace(/[,]/g, '.');
}

// ("11/15/2021","11/14/2032") => 10
function yearfrac(time1, time2) {
    const months = Math.floor(
        moment(time2, FORMAT_TIME_IN_FILE).diff(moment(time1, FORMAT_TIME_IN_FILE), 'months', true),
    );
    const timeTmp = moment(time1, FORMAT_TIME_IN_FILE).subtract(-months, 'months').format(FORMAT_TIME_IN_FILE);
    const days = Math.floor(
        moment(time2, FORMAT_TIME_IN_FILE).diff(moment(timeTmp, FORMAT_TIME_IN_FILE), 'days', true),
    );
    const result = (months + days / 30) / 12;
    return result;
}

// ("11/15/2021","11/14/2032") => 10.01
function yearfrac3(time1, time2) {
    return calculate(
        moment(time2, FORMAT_TIME_IN_FILE).diff(moment(time1, FORMAT_TIME_IN_FILE), 'days', true),
        365,
        '/',
    );
}

// =IF(9/30/2020<11/15/2021;0;YEARFRAC(9/30/2020;11/15/2021))
function getStartDate(time1, time2) {
    if (moment(time1, FORMAT_TIME_IN_FILE).isBefore(moment(time2, FORMAT_TIME_IN_FILE))) {
        return 0;
    }

    return yearfrac(time1, time2);
}

export { formatStringNumber, yearfrac, yearfrac3, getStartDate };

export const actionLogsTemplate = {
    LOGIN: () => `Login`,
    UPLOAD_FILE: (inputData) => `Push the file ${inputData} to the system`,
    UPLOAD_FILE_ERROR: (fileName, error) => `The file ${fileName} - Error: ${error}`,
    DELETE_FILE: (inputData) => `Delete the file ${inputData} from the system`,
    CREATE_USER: (inputData) => `Create new user: ${inputData}`,
    CREATE_ROLE: (inputData) => `Create new role: ${inputData}`,
    CREATE_RW: () => `Create new Risk Weights`,
    CREATE_MB: () => `Create new Master Tables`,
    UPDATE_USER: (inputData) => `Update user: ${inputData}`,
    UPDATE_ROLE: (inputData) => `Update role: ${inputData}`,
    UPDATE_RW: () => `Update Risk Weights`,
    UPDATE_MB: () => `Update Master Tables`,
    UPDATE_RW_K_OPTIONS: () => `Update Risk Weights of K_Option module`,
    DELETE_USER: (inputData) => `Delete the user ${inputData} from the system`,
    VIEW_FILE: (inputData) => `View the report ${inputData} in the system`,
    VIEW_LIST_FILE: (inputData) => `View the list of reports generated from file '${inputData}' in the system`,
    VIEW_LIST_USERS: () => `View the list of users in the system`,
    DOWNLOAD_REPORT: (inputData) => `Download the report ${inputData} from the system`,
};

export function getCurrentTimeSql() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

export async function isHasRole(userName, roleName) {
    const userInfo = await dbManager.getUserInfoByUserName(userName);

    if (!userInfo) return;

    const roleGroup = await dbManager.getRoleGroupByRoleGroupId(userInfo.role_group_id);

    if (!roleGroup) return;

    const roleId = ROLE_NAME_ROLE_ID[roleName];
    const roleList = JSON.parse(roleGroup.role_list);

    for (let i = 0; i < roleList.length; i++) {
        const element = roleList[i];

        if (element.roleId == roleId) {
            return element.select == 1;
        }
    }
}

// SCVA H5 =DURATION(D5;E5;F5%;0;1;3)
export function durationExcel(extractionDate, maturityDateOfContract, interestRate, notionalAmountInLcy) {
    if (moment(extractionDate, FORMAT_TIME_IN_FILE).isAfter(moment(maturityDateOfContract, FORMAT_TIME_IN_FILE))) {
        throw new Error('durationExcel - input data invalid');
    }

    let period = yearfrac3(extractionDate, maturityDateOfContract);
    if (period > 3) {
        period = Math.round(period);
    }
    let cashflow = calculate(
        calculate(calculate(interestRate, 100, '/'), notionalAmountInLcy, '*'),
        notionalAmountInLcy,
        '+',
    );
    let numerator = calculate(period, cashflow, '*');
    let totalCashflow = cashflow;
    let totalNumerator = numerator;

    let timeAYearAgo = moment(maturityDateOfContract, FORMAT_TIME_IN_FILE)
        .subtract(1, 'years')
        .format(FORMAT_TIME_IN_FILE);

    while (moment(extractionDate, FORMAT_TIME_IN_FILE).isBefore(moment(timeAYearAgo, FORMAT_TIME_IN_FILE))) {
        period = yearfrac3(extractionDate, timeAYearAgo);
        if (period > 3) {
            period = Math.round(period);
        }
        cashflow = cashflow = calculate(calculate(interestRate, 100, '/'), notionalAmountInLcy, '*');
        numerator = calculate(period, cashflow, '*');
        totalCashflow = calculate(cashflow, totalCashflow, '+');
        totalNumerator = calculate(numerator, totalNumerator, '+');
        timeAYearAgo = moment(timeAYearAgo, FORMAT_TIME_IN_FILE).subtract(1, 'years').format(FORMAT_TIME_IN_FILE);
    }

    const result = calculate(totalNumerator, totalCashflow, '/');
    return result;
}

export function normdistExcel(x, mean, standard_deviation, cumulative) {
    const normal = distributions.Normal(mean, standard_deviation);
    if (cumulative) {
        return normal.cdf(x);
    }
    return normal.pdf(x);
}
