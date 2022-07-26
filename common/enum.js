export const FILE = {
    STG_INSTRUMENT_CONTRACT_MASTER: 'STG_INSTRUMENT_CONTRACT_MASTER',
    STG_BANK_POSITIONS: 'STG_BANK_POSITIONS',
    STG_SENSITIVITIES_FX: 'STG_SENSITIVITIES_FX',
    STG_SENSITIVITIES_GIRR: 'STG_SENSITIVITIES_GIRR',
    STG_PARTY_RATING_DETAILS: 'STG_PARTY_RATING_DETAILS',
    STG_PARTY_MASTER: 'STG_PARTY_MASTER',
    STG_CURVATURES_SHOCK: 'STG_CURVATURES_SHOCK',
    STG_PARTY_FINANCIALS: 'STG_PARTY_FINANCIALS',
    STG_INSTRUMENT_CONTRACT_MASTER_2: 'STG_INSTRUMENT_CONTRACT_MASTER_2',
    STG_NETTING: 'STG_NETTING',
    FINANCIAL_DATA_GL_ACTUAL_BALANCE: 'FINANCIAL_DATA_GL_ACTUAL_BALANCE',
    OPERATIONAL_RISK_LOSS_DATA: 'OPERATIONAL_RISK_LOSS_DATA',
};

export const FILE_HASHMAP = {
    STG_INSTRUMENT_CONTRACT_MASTER: 'STG_INSTRUMENT_CONTRACT_MASTER_HASHMAP',
    STG_BANK_POSITIONS: 'STG_BANK_POSITIONS_HASHMAP',
    STG_SENSITIVITIES_FX: 'STG_SENSITIVITIES_FX_HASHMAP',
    STG_SENSITIVITIES_GIRR: 'STG_SENSITIVITIES_GIRR_HASHMAP',
    STG_PARTY_RATING_DETAILS: 'STG_PARTY_RATING_DETAILS_HASHMAP',
    STG_PARTY_MASTER: 'STG_PARTY_MASTER_HASHMAP',
    STG_CURVATURES_SHOCK: 'STG_CURVATURES_SHOCK_HASHMAP',
    STG_PARTY_FINANCIALS: 'STG_PARTY_FINANCIALS_HASHMAP',
    STG_INSTRUMENT_CONTRACT_MASTER_2: 'STG_INSTRUMENT_CONTRACT_MASTER_2_HASHMAP',
    STG_NETTING: 'STG_NETTING_HASHMAP',
    FINANCIAL_DATA_GL_ACTUAL_BALANCE: 'FINANCIAL_DATA_GL_ACTUAL_BALANCE_HASHMAP',
    OPERATIONAL_RISK_LOSS_DATA: 'OPERATIONAL_RISK_LOSS_DATA_HASHMAP',
};

export const FILE_NAME = {
    STG_INSTRUMENT_CONTRACT_MASTER: 'STG_INSTRUMENT_CONTRACT_MASTER.csv',
    STG_BANK_POSITIONS: 'STG_BANK_POSITIONS.csv',
    STG_SENSITIVITIES_FX: 'STG_SENSITIVITIES_FX.csv',
    STG_SENSITIVITIES_GIRR: 'STG_SENSITIVITIES_GIRR.csv',
    STG_PARTY_RATING_DETAILS: 'STG_PARTY_RATING_DETAILS.csv',
    STG_PARTY_MASTER: 'STG_PARTY_MASTER.csv',
    STG_CURVATURES_SHOCK: 'STG_CURVATURES_SHOCK.csv',
    STG_PARTY_FINANCIALS: 'STG_PARTY_FINANCIALS.csv',
    STG_INSTRUMENT_CONTRACT_MASTER_2: 'STG_INSTRUMENT_CONTRACT_MASTER_2.csv',
    STG_NETTING: 'STG_NETTING.csv',
    FINANCIAL_DATA_GL_ACTUAL_BALANCE: 'FINANCIAL_DATA_GL_ACTUAL_BALANCE.csv',
    OPERATIONAL_RISK_LOSS_DATA: 'OPERATIONAL_RISK_LOSS_DATA.csv',
};

export const HASHMAP_KEY = {
    STG_INSTRUMENT_CONTRACT_MASTER: 'V_INSTRUMENT_CODE',
    STG_BANK_POSITIONS: 'V_INSTRUMENT_CODE',
    STG_SENSITIVITIES_FX: 'V_INSTRUMENT_CODE',
    STG_SENSITIVITIES_GIRR: 'V_INSTRUMENT_CODE',
    STG_PARTY_RATING_DETAILS: 'V_PARTY_NAME',
    STG_PARTY_MASTER: 'V_CUST_REF_CODE',
    STG_CURVATURES_SHOCK: 'V_CCY_CODE',
    STG_PARTY_FINANCIALS: 'V_CUST_REF_CODE',
    STG_INSTRUMENT_CONTRACT_MASTER_2: 'V_INSTRUMENT_CODE',
    STG_NETTING: 'V_NETTING_CODE',
    FINANCIAL_DATA_GL_ACTUAL_BALANCE: 'Item',
    OPERATIONAL_RISK_LOSS_DATA: 'Item',
};

export const MAPPING_CSV = {
    STG_INSTRUMENT_CONTRACT_MASTER: {
        FIC_MIS_DATE: 0,
        V_INSTRUMENT_CODE: 1,
        V_PRODUCT_CODE: 2,
        V_ISSUER_CODE: 3,
        V_ISSUER_TYPE: 4,
        V_CUST_REF_CODE: 5,
        N_LGD: 6,
        V_CCY_CODE: 7,
        V_CCY2_CODE: 8,
        F_OTC_IND: 9,
        D_EFFECTIVE_DATE: 10,
        D_MATURITY_DATE: 11,
        V_COUPON_TYPE: 12,
        N_COUPON_RATE: 13,
        D_ISSUE_DATE: 14,
        V_INT_TYPE_PAY: 15,
        N_INT_RATE_PAY: 16,
        D_REPRICING_DATE_PAY: 17,
        V_INT_TYPE_REC: 18,
        N_INT_RATE_REC: 19,
        D_REPRICING_DATE_REC: 20,
        F_APP_GUAR_CENTRAL_GOVT: 21,
        V_ISIN_ID: 22,
        D_MATURITY_DATE_FAR_LEG: 23,
        V_PARTY_ID: 24,
        XX_V_SRC_INSTRUMENT_CODE: 25,
        V_INSTRUMENT_DESC: 26,
        F_OPTIONAL: 27,
        V_OPTION_TYPE: 28,
        F_EXOTIC_UNDERLYING: 29,
        V_HEDGED_UNDERLYING_ASSET: 30,
        V_UNDERLYING_CD: 31,
        V_UNDERLYING_TYPE_CODE: 32,
        N_UNDERLYING_PRICE: 33,
        N_STRIKE_PRICE: 34,
        V_PRODUCT_TYPE: 35,
        D_MATURITY_DATE_UNDERLYING: 36,
    },
    STG_BANK_POSITIONS: {
        ' FIC_MIS_DATE ': 0,
        ' V_INSTRUMENT_CODE ': 1,
        ' V_INSTRUMENT_POSITION ': 2,
        ' N_MTM_VALUE ': 3,
        ' N_MTM_VALUE_LCY ': 4,
        ' N_NOTIONAL_AMT_PAY ': 5,
        ' N_NOTIONAL_AMT_RCV ': 6,
        ' N_NOTIONAL_AMT_PAY_LCY ': 7,
        ' N_NOTIONAL_AMT_RCV_LCY ': 8,
        ' N_PNL ': 9,
    },
    STG_SENSITIVITIES_FX: {
        FIC_MIS_DATE: 0,
        V_INSTRUMENT_CODE: 1,
        V_INSTRUMENT_POSITION: 2,
        N_DELTA_FX: 3,
        'N_VEGA_FX_0.5YEAR': 4,
        N_VEGA_FX_1YEAR: 5,
        N_VEGA_FX_3YEAR: 6,
        N_VEGA_FX_5YEAR: 7,
        N_VEGA_FX_10YEAR: 8,
        N_CURVATURE_FX: 9,
    },
    STG_SENSITIVITIES_GIRR: {
        FIC_MIS_DATE: 0,
        V_INSTRUMENT_CODE: 1,
        V_INSTRUMENT_POSITION: 2,
        V_CCY_CODE: 3,
        V_CCY2_CODE: 4,
        'N_DELTA_GIRR_1ST_CCY_0.25YEAR': 5,
        'N_DELTA_GIRR_1ST_CCY_0.5YEAR': 6,
        N_DELTA_GIRR_1ST_CCY_1YEAR: 7,
        N_DELTA_GIRR_1ST_CCY_2YEAR: 8,
        N_DELTA_GIRR_1ST_CCY_3YEAR: 9,
        N_DELTA_GIRR_1ST_CCY_5YEAR: 10,
        N_DELTA_GIRR_1ST_CCY_10YEAR: 11,
        N_DELTA_GIRR_1ST_CCY_15YEAR: 12,
        N_DELTA_GIRR_1ST_CCY_20YEAR: 13,
        N_DELTA_GIRR_1ST_CCY_30YEAR: 14,
        'N_DELTA_GIRR_2ND_CCY_0.25YEAR': 15,
        'N_DELTA_GIRR_2ND_CCY_0.5YEAR': 16,
        N_DELTA_GIRR_2ND_CCY_1YEAR: 17,
        N_DELTA_GIRR_2ND_CCY_2YEAR: 18,
        N_DELTA_GIRR_2ND_CCY_3YEAR: 19,
        N_DELTA_GIRR_2ND_CCY_5YEAR: 20,
        N_DELTA_GIRR_2ND_CCY_10YEAR: 21,
        N_DELTA_GIRR_2ND_CCY_15YEAR: 22,
        N_DELTA_GIRR_2ND_CCY_20YEAR: 23,
        N_DELTA_GIRR_2ND_CCY_30YEAR: 24,
        'N_VEGA_GIRR_1ST_CCY_0.5YEAR': 25,
        N_VEGA_GIRR_1ST_CCY_1YEAR: 26,
        N_VEGA_GIRR_1ST_CCY_3YEAR: 27,
        N_VEGA_GIRR_1ST_CCY_5YEAR: 28,
        N_VEGA_GIRR_1ST_CCY_10YEAR: 29,
        'N_VEGA_GIRR_2ND_CCY_0.5YEAR': 30,
        N_VEGA_GIRR_2ND_CCY_1YEAR: 31,
        N_VEGA_GIRR_2ND_CCY_3YEAR: 32,
        N_VEGA_GIRR_2ND_CCY_5YEAR: 33,
        N_VEGA_GIRR_2ND_CCY_10YEAR: 34,
        N_CURVATURE_GIRR_1ST_CCY: 35,
        N_CURVATURE_GIRR_2ND_CCY: 36,
    },
    STG_PARTY_RATING_DETAILS: {
        FIC_MIS_DATE: 0,
        V_RATING_SRC_CODE: 1,
        V_PARTY_NAME: 2,
        V_RATING_CODE: 3,
        F_RATING_ELIGIBILITY: 4,
        V_CUST_REF_CODE: 5,
    },
    STG_PARTY_MASTER: {
        FIC_MIS_DATE: 0,
        V_CUST_REF_CODE: 1,
        V_PARTY_NAME: 2,
        V_LOCATION_CODE: 3,
        D_DATE_OF_BIRTH: 4,
        V_INDUSTRY_CODE: 5,
        V_PARTY_TYPE_CODE: 6,
        N_NO_OF_EMPOLYEES: 7,
        LOAN_CLASSIFICATION: 8,
    },
    STG_CURVATURES_SHOCK: {
        FIC_MIS_DATE: 0,
        V_CCY_CODE: 1,
        V_CURVATURE_GIRR_PNL: 2,
        V_CURVATURE_GIRR_UP: 3,
        V_CURVATURE_GIRR_DOWN: 4,
        V_CURVATURE_FX_PNL: 5,
        V_CURVATURE_FX_UP: 6,
        V_CURVATURE_FX_DOWN: 7,
    },
    STG_PARTY_FINANCIALS: {
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
    },
    STG_INSTRUMENT_CONTRACT_MASTER_2: {
        FIC_MIS_DATE: 0,
        V_INSTRUMENT_CODE: 1,
        V_ASSET_CLASS: 2,
        V_SUB_CLASS: 3,
        V_ISSUER_CODE: 4,
        V_ISSUER_TYPE: 5,
        V_CCY_CODE: 6,
        V_CTR_CCY_CODE: 7,
        F_OTC_IND: 8,
        D_EFFECTIVE_DATE: 9,
        D_MATURITY_DATE: 10,
        V_PRODUCT_CODE: 11,
        V_INT_TYPE_PAY: 12,
        N_INT_RATE_PAY: 13,
        D_REPRICING_DATE_PAY: 14,
        V_INT_TYPE_REC: 15,
        N_INT_RATE_REC: 16,
        D_REPRICING_DATE_REC: 17,
        F_APP_GUAR_CENTRAL_GOVT: 18,
        V_ISIN_ID: 19,
        V_PARTY_ID: 20,
        XX_V_SRC_INSTRUMENT_CODE: 21,
        V_INSTRUMENT_DESC: 22,
        V_OPTION_TYPE: 23,
        V_HEDGED_UNDERLYING_ASSET: 24,
        V_UNDERLYING_CD: 25,
        V_UNDERLYING_TYPE_CODE: 26,
        N_UNDERLYING_PRICE: 27,
        N_STRIKE_PRICE: 28,
        V_PRODUCT_TYPE: 29,
        V_PAIR_CCY: 30,
        V_INSTRUMENT_POSITION: 31,
        N_NOTIONAL_AMT: 32,
        N_MARKET_VALUE: 33,
        D_MATURITY_DATE_UNDERLYING: 34,
        V_COLLATERAL_ID: 35,
        N_COLLATERAL_CCP_AMT: 36,
        N_COLLATERAL_BANK_AMT: 37,
        F_MARGIN: 38,
        F_CENTRALLY_CLEARED: 39,
        N_MARGIN_FREQUENCY: 40,
        V_NETTING_CODE: 41,
        SECTOR_OF_COUNTERPARTY: 42,
        CREDIT_RATING_OF_COUNTERPARTY: 43,
        INTEREST_RATE: 44,
    },
    STG_NETTING: {
        V_NETTING_CODE: 0,
        N_THRESHOLD: 1,
        N_MTA: 2,
        N_NICA: 3,
        N_NET: 4,
        N_EFFECTIVEMATURITY: 5,
    },
    FINANCIAL_DATA_GL_ACTUAL_BALANCE: {
        Item: 0,
        'Actual balance in quarter n-11': 1,
        'Actual balance in quarter n-10': 2,
        'Actual balance in quarter n-9': 3,
        'Actual balance in quarter n-8': 4,
        'Actual balance in quarter n-7': 5,
        'Actual balance in quarter n-6': 6,
        'Actual balance in quarter n-5': 7,
        'Actual balance in quarter n-4': 8,
        'Actual balance in quarter n-3': 9,
        'Actual balance in quarter n-2': 10,
        'Actual balance in quarter n-1': 11,
        'Actual balance in quarter n': 12,
    },
    OPERATIONAL_RISK_LOSS_DATA: {
        Item: 0,
        'Quarter n-19': 1,
        'Quarter n-18': 2,
        'Quarter n-17': 3,
        'Quarter n-16': 4,
        'Quarter n-15': 5,
        'Quarter n-14': 6,
        'Quarter n-13': 7,
        'Quarter n-12': 8,
        'Quarter n-11': 9,
        'Quarter n-10': 10,
        'Quarter n-9': 11,
        'Quarter n-8': 12,
        'Quarter n-7': 13,
        'Quarter n-6': 14,
        'Quarter n-5': 15,
        'Quarter n-4': 16,
        'Quarter n-3': 17,
        'Quarter n-2': 18,
        'Quarter n-1': 19,
        'Quarter n': 20,
    },
};
