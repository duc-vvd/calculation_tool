const obj = {
    FIC_MIS_DATE: 0,
    V_CUST_REF_CODE: 1,
    N_TOTAL_ASSETS: 2,
    N_TOTAL_REVENUE: 3,
    D_BS_CREATION_DATE: 4,
    V_CCY_CODE: 5,
    XX_N_ANNUAL_DEBT: 6,
    XX_N_ANNUAL_INCOME: 7,
    N_LEVERAGE_RATIO: 8,
    N_TOTAL_EQUITY: 9,
    XX_F_FIN_STATE_TYPE: 10,
    XX_F_AUDITED_REPORT: 11,
    N_TOTAL_DEBT: 12,
};

const newObj = {};

for (const key in obj) {
    newObj[key] = {
        prop: key.toLowerCase(),
        type: '__String__',
    };
}

// console.log(JSON.stringify(newObj));

console.log(
    JSON.stringify(
        [
            'STG_INSTRUMENT_CONTRACT_MASTER',
            'STG_BANK_POSITIONS',
            'STG_SENSITIVITIES_FX',
            'STG_SENSITIVITIES_GIRR',
            'STG_PARTY_RATING_DETAILS',
            'STG_PARTY_MASTER',
            'STG_CURVATURES_SHOCK',
            'STG_PARTY_FINANCIALS',
            'STG_INSTRUMENT_CONTRACT_MASTER_2',
            'STG_NETTING',
            'FINANCIAL_DATA_GL_ACTUAL_BALANCE',
            'OPERATIONAL_RISK_LOSS_DATA',
        ].reduce((obj, cur) => {
            obj[cur.slice(0, 31)] = cur;
            return obj;
        }, {}),
    ),
);
