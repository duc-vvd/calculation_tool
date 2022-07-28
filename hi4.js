import readXlsxFile from 'read-excel-file/node';
import { readSheetNames } from 'read-excel-file/node';

import db from './helper/db.js';
import { FILE_HASHMAP, FILE, HASHMAP_KEY, MAPPING_CSV, SHEET_NAMES, SHEET_NAMES_HASHMAP } from './common/enum.js';
import { mappingDataDeal } from './mapper/index.js';

const schemaXlsx = {
    STG_INSTRUMENT_CONTRACT_MASTER: {
        FIC_MIS_DATE: { prop: 'fic_mis_date', type: String },
        V_INSTRUMENT_CODE: { prop: 'v_instrument_code', type: String },
        V_PRODUCT_CODE: { prop: 'v_product_code', type: String },
        V_ISSUER_CODE: { prop: 'v_issuer_code', type: String },
        V_ISSUER_TYPE: { prop: 'v_issuer_type', type: String },
        V_CUST_REF_CODE: { prop: 'v_cust_ref_code', type: String },
        N_LGD: { prop: 'n_lgd', type: Number },
        V_CCY_CODE: { prop: 'v_ccy_code', type: String },
        V_CCY2_CODE: { prop: 'v_ccy2_code', type: String },
        F_OTC_IND: { prop: 'f_otc_ind', type: String },
        D_EFFECTIVE_DATE: { prop: 'd_effective_date', type: String },
        D_MATURITY_DATE: { prop: 'd_maturity_date', type: String },
        V_COUPON_TYPE: { prop: 'v_coupon_type', type: String },
        N_COUPON_RATE: { prop: 'n_coupon_rate', type: Number },
        D_ISSUE_DATE: { prop: 'd_issue_date', type: String },
        V_INT_TYPE_PAY: { prop: 'v_int_type_pay', type: String },
        N_INT_RATE_PAY: { prop: 'n_int_rate_pay', type: Number },
        D_REPRICING_DATE_PAY: { prop: 'd_repricing_date_pay', type: String },
        V_INT_TYPE_REC: { prop: 'v_int_type_rec', type: String },
        N_INT_RATE_REC: { prop: 'n_int_rate_rec', type: Number },
        D_REPRICING_DATE_REC: { prop: 'd_repricing_date_rec', type: String },
        F_APP_GUAR_CENTRAL_GOVT: { prop: 'f_app_guar_central_govt', type: String },
        V_ISIN_ID: { prop: 'v_isin_id', type: String },
        D_MATURITY_DATE_FAR_LEG: { prop: 'd_maturity_date_far_leg', type: String },
        V_PARTY_ID: { prop: 'v_party_id', type: String },
        XX_V_SRC_INSTRUMENT_CODE: { prop: 'xx_v_src_instrument_code', type: String },
        V_INSTRUMENT_DESC: { prop: 'v_instrument_desc', type: String },
        F_OPTIONAL: { prop: 'f_optional', type: String },
        V_OPTION_TYPE: { prop: 'v_option_type', type: String },
        F_EXOTIC_UNDERLYING: { prop: 'f_exotic_underlying', type: String },
        V_HEDGED_UNDERLYING_ASSET: { prop: 'v_hedged_underlying_asset', type: String },
        V_UNDERLYING_CD: { prop: 'v_underlying_cd', type: String },
        V_UNDERLYING_TYPE_CODE: { prop: 'v_underlying_type_code', type: String },
        N_UNDERLYING_PRICE: { prop: 'n_underlying_price', type: Number },
        N_STRIKE_PRICE: { prop: 'n_strike_price', type: Number },
        V_PRODUCT_TYPE: { prop: 'v_product_type', type: String },
        D_MATURITY_DATE_UNDERLYING: { prop: 'd_maturity_date_underlying', type: String },
    },
    STG_BANK_POSITIONS: {
        FIC_MIS_DATE: {
            prop: 'fic_mis_date',
            type: String,
        },
        V_INSTRUMENT_CODE: {
            prop: 'v_instrument_code',
            type: String,
            required: true,
        },
        V_INSTRUMENT_POSITION: {
            prop: 'v_instrument_position',
            type: String,
        },
        N_MTM_VALUE: {
            prop: 'n_mtm_value',
            type: Number,
        },
        N_MTM_VALUE_LCY: {
            prop: 'n_mtm_value_lcy',
            type: Number,
        },
        N_NOTIONAL_AMT_PAY: {
            prop: 'n_notional_amt_pay',
            type: Number,
        },
        N_NOTIONAL_AMT_RCV: {
            prop: 'n_notional_amt_rcv',
            type: Number,
        },
        N_NOTIONAL_AMT_PAY_LCY: {
            prop: 'n_notional_amt_pay_lcy',
            type: Number,
        },
        N_NOTIONAL_AMT_RCV_LCY: {
            prop: 'n_notional_amt_rcv_lcy',
            type: Number,
        },
        N_PNL: {
            prop: 'n_pnl',
            type: Number,
        },
    },
    STG_SENSITIVITIES_FX: {
        FIC_MIS_DATE: { prop: 'fic_mis_date', type: String },
        V_INSTRUMENT_CODE: { prop: 'v_instrument_code', type: String },
        V_INSTRUMENT_POSITION: { prop: 'v_instrument_position', type: String },
        N_DELTA_FX: { prop: 'n_delta_fx', type: Number },
        'N_VEGA_FX_0.5YEAR': { prop: 'n_vega_fx_half_a_year', type: Number },
        N_VEGA_FX_1YEAR: { prop: 'n_vega_fx_1year', type: Number },
        N_VEGA_FX_3YEAR: { prop: 'n_vega_fx_3year', type: Number },
        N_VEGA_FX_5YEAR: { prop: 'n_vega_fx_5year', type: Number },
        N_VEGA_FX_10YEAR: { prop: 'n_vega_fx_10year', type: Number },
        N_CURVATURE_FX: { prop: 'n_curvature_fx', type: Number },
    },
    STG_SENSITIVITIES_GIRR: {
        FIC_MIS_DATE: { prop: 'fic_mis_date', type: String },
        V_INSTRUMENT_CODE: { prop: 'v_instrument_code', type: String },
        V_INSTRUMENT_POSITION: { prop: 'v_instrument_position', type: String },
        V_CCY_CODE: { prop: 'v_ccy_code', type: String },
        V_CCY2_CODE: { prop: 'v_ccy2_code', type: String },
        'N_DELTA_GIRR_1ST_CCY_0.25YEAR': { prop: 'n_delta_girr_1st_ccy_a_quarter_of_year', type: Number },
        'N_DELTA_GIRR_1ST_CCY_0.5YEAR': { prop: 'n_delta_girr_1st_ccy_half_a_year', type: Number },
        N_DELTA_GIRR_1ST_CCY_1YEAR: { prop: 'n_delta_girr_1st_ccy_1year', type: Number },
        N_DELTA_GIRR_1ST_CCY_2YEAR: { prop: 'n_delta_girr_1st_ccy_2year', type: Number },
        N_DELTA_GIRR_1ST_CCY_3YEAR: { prop: 'n_delta_girr_1st_ccy_3year', type: Number },
        N_DELTA_GIRR_1ST_CCY_5YEAR: { prop: 'n_delta_girr_1st_ccy_5year', type: Number },
        N_DELTA_GIRR_1ST_CCY_10YEAR: { prop: 'n_delta_girr_1st_ccy_10year', type: Number },
        N_DELTA_GIRR_1ST_CCY_15YEAR: { prop: 'n_delta_girr_1st_ccy_15year', type: Number },
        N_DELTA_GIRR_1ST_CCY_20YEAR: { prop: 'n_delta_girr_1st_ccy_20year', type: Number },
        N_DELTA_GIRR_1ST_CCY_30YEAR: { prop: 'n_delta_girr_1st_ccy_30year', type: Number },
        'N_DELTA_GIRR_2ND_CCY_0.25YEAR': { prop: 'n_delta_girr_2nd_ccy_a_quarter_of_year', type: Number },
        'N_DELTA_GIRR_2ND_CCY_0.5YEAR': { prop: 'n_delta_girr_2nd_ccy_half_a_year', type: Number },
        N_DELTA_GIRR_2ND_CCY_1YEAR: { prop: 'n_delta_girr_2nd_ccy_1year', type: Number },
        N_DELTA_GIRR_2ND_CCY_2YEAR: { prop: 'n_delta_girr_2nd_ccy_2year', type: Number },
        N_DELTA_GIRR_2ND_CCY_3YEAR: { prop: 'n_delta_girr_2nd_ccy_3year', type: Number },
        N_DELTA_GIRR_2ND_CCY_5YEAR: { prop: 'n_delta_girr_2nd_ccy_5year', type: Number },
        N_DELTA_GIRR_2ND_CCY_10YEAR: { prop: 'n_delta_girr_2nd_ccy_10year', type: Number },
        N_DELTA_GIRR_2ND_CCY_15YEAR: { prop: 'n_delta_girr_2nd_ccy_15year', type: Number },
        N_DELTA_GIRR_2ND_CCY_20YEAR: { prop: 'n_delta_girr_2nd_ccy_20year', type: Number },
        N_DELTA_GIRR_2ND_CCY_30YEAR: { prop: 'n_delta_girr_2nd_ccy_30year', type: Number },
        'N_VEGA_GIRR_1ST_CCY_0.5YEAR': { prop: 'n_vega_girr_1st_ccy_half_a_year', type: Number },
        N_VEGA_GIRR_1ST_CCY_1YEAR: { prop: 'n_vega_girr_1st_ccy_1year', type: Number },
        N_VEGA_GIRR_1ST_CCY_3YEAR: { prop: 'n_vega_girr_1st_ccy_3year', type: Number },
        N_VEGA_GIRR_1ST_CCY_5YEAR: { prop: 'n_vega_girr_1st_ccy_5year', type: Number },
        N_VEGA_GIRR_1ST_CCY_10YEAR: { prop: 'n_vega_girr_1st_ccy_10year', type: Number },
        'N_VEGA_GIRR_2ND_CCY_0.5YEAR': { prop: 'n_vega_girr_2nd_ccy_half_a_year', type: Number },
        N_VEGA_GIRR_2ND_CCY_1YEAR: { prop: 'n_vega_girr_2nd_ccy_1year', type: Number },
        N_VEGA_GIRR_2ND_CCY_3YEAR: { prop: 'n_vega_girr_2nd_ccy_3year', type: Number },
        N_VEGA_GIRR_2ND_CCY_5YEAR: { prop: 'n_vega_girr_2nd_ccy_5year', type: Number },
        N_VEGA_GIRR_2ND_CCY_10YEAR: { prop: 'n_vega_girr_2nd_ccy_10year', type: Number },
        N_CURVATURE_GIRR_1ST_CCY: { prop: 'n_curvature_girr_1st_ccy', type: Number },
        N_CURVATURE_GIRR_2ND_CCY: { prop: 'n_curvature_girr_2nd_ccy', type: Number },
    },
    STG_PARTY_RATING_DETAILS: {
        FIC_MIS_DATE: { prop: 'fic_mis_date', type: String },
        V_RATING_SRC_CODE: { prop: 'v_rating_src_code', type: String },
        V_PARTY_NAME: { prop: 'v_party_name', type: String },
        V_RATING_CODE: { prop: 'v_rating_code', type: String },
        F_RATING_ELIGIBILITY: { prop: 'f_rating_eligibility', type: Number },
        V_CUST_REF_CODE: { prop: 'v_cust_ref_code', type: String },
    },
    STG_PARTY_MASTER: {
        FIC_MIS_DATE: { prop: 'fic_mis_date', type: String },
        V_CUST_REF_CODE: { prop: 'v_cust_ref_code', type: String },
        V_PARTY_NAME: { prop: 'v_party_name', type: String },
        V_LOCATION_CODE: { prop: 'v_location_code', type: String },
        D_DATE_OF_BIRTH: { prop: 'd_date_of_birth', type: String },
        V_INDUSTRY_CODE: { prop: 'v_industry_code', type: String },
        V_PARTY_TYPE_CODE: { prop: 'v_party_type_code', type: String },
        N_NO_OF_EMPOLYEES: { prop: 'n_no_of_empolyees', type: String },
        LOAN_CLASSIFICATION: { prop: 'loan_classification', type: String },
    },
    STG_CURVATURES_SHOCK: {
        FIC_MIS_DATE: { prop: 'fic_mis_date', type: String },
        V_CCY_CODE: { prop: 'v_ccy_code', type: String },
        V_CURVATURE_GIRR_PNL: { prop: 'v_curvature_girr_pnl', type: Number },
        V_CURVATURE_GIRR_UP: { prop: 'v_curvature_girr_up', type: Number },
        V_CURVATURE_GIRR_DOWN: { prop: 'v_curvature_girr_down', type: Number },
        V_CURVATURE_FX_PNL: { prop: 'v_curvature_fx_pnl', type: Number },
        V_CURVATURE_FX_UP: { prop: 'v_curvature_fx_up', type: Number },
        V_CURVATURE_FX_DOWN: { prop: 'v_curvature_fx_down', type: Number },
    },
    STG_PARTY_FINANCIALS: {
        FIC_MIS_DATE: { prop: 'fic_mis_date', type: String },
        V_CUST_REF_CODE: { prop: 'v_cust_ref_code', type: String },
        N_TOTAL_ASSETS: { prop: 'n_total_assets', type: String },
        N_TOTAL_REVENUE: { prop: 'n_total_revenue', type: String },
        D_BS_CREATION_DATE: { prop: 'd_bs_creation_date', type: String },
        V_CCY_CODE: { prop: 'v_ccy_code', type: String },
        XX_N_ANNUAL_DEBT: { prop: 'xx_n_annual_debt', type: String },
        XX_N_ANNUAL_INCOME: { prop: 'xx_n_annual_income', type: String },
        N_LEVERAGE_RATIO: { prop: 'n_leverage_ratio', type: String },
        N_TOTAL_EQUITY: { prop: 'n_total_equity', type: String },
        XX_F_FIN_STATE_TYPE: { prop: 'xx_f_fin_state_type', type: String },
        XX_F_AUDITED_REPORT: { prop: 'xx_f_audited_report', type: String },
        N_TOTAL_DEBT: { prop: 'n_total_debt', type: String },
    },
    STG_INSTRUMENT_CONTRACT_MASTER_2: {
        FIC_MIS_DATE: { prop: 'fic_mis_date', type: String },
        V_INSTRUMENT_CODE: { prop: 'v_instrument_code', type: String },
        V_ASSET_CLASS: { prop: 'v_asset_class', type: String },
        V_SUB_CLASS: { prop: 'v_sub_class', type: String },
        V_ISSUER_CODE: { prop: 'v_issuer_code', type: String },
        V_ISSUER_TYPE: { prop: 'v_issuer_type', type: String },
        V_CCY_CODE: { prop: 'v_ccy_code', type: String },
        V_CTR_CCY_CODE: { prop: 'v_ctr_ccy_code', type: String },
        F_OTC_IND: { prop: 'f_otc_ind', type: String },
        D_EFFECTIVE_DATE: { prop: 'd_effective_date', type: String },
        D_MATURITY_DATE: { prop: 'd_maturity_date', type: String },
        V_PRODUCT_CODE: { prop: 'v_product_code', type: String },
        V_INT_TYPE_PAY: { prop: 'v_int_type_pay', type: String },
        N_INT_RATE_PAY: { prop: 'n_int_rate_pay', type: String },
        D_REPRICING_DATE_PAY: { prop: 'd_repricing_date_pay', type: String },
        V_INT_TYPE_REC: { prop: 'v_int_type_rec', type: String },
        N_INT_RATE_REC: { prop: 'n_int_rate_rec', type: String },
        D_REPRICING_DATE_REC: { prop: 'd_repricing_date_rec', type: String },
        F_APP_GUAR_CENTRAL_GOVT: { prop: 'f_app_guar_central_govt', type: String },
        V_ISIN_ID: { prop: 'v_isin_id', type: String },
        V_PARTY_ID: { prop: 'v_party_id', type: String },
        XX_V_SRC_INSTRUMENT_CODE: { prop: 'xx_v_src_instrument_code', type: String },
        V_INSTRUMENT_DESC: { prop: 'v_instrument_desc', type: String },
        V_OPTION_TYPE: { prop: 'v_option_type', type: String },
        V_HEDGED_UNDERLYING_ASSET: { prop: 'v_hedged_underlying_asset', type: String },
        V_UNDERLYING_CD: { prop: 'v_underlying_cd', type: String },
        V_UNDERLYING_TYPE_CODE: { prop: 'v_underlying_type_code', type: String },
        N_UNDERLYING_PRICE: { prop: 'n_underlying_price', type: Number },
        N_STRIKE_PRICE: { prop: 'n_strike_price', type: Number },
        V_PRODUCT_TYPE: { prop: 'v_product_type', type: String },
        V_PAIR_CCY: { prop: 'v_pair_ccy', type: String },
        V_INSTRUMENT_POSITION: { prop: 'v_instrument_position', type: String },
        N_NOTIONAL_AMT: { prop: 'n_notional_amt', type: Number },
        N_MARKET_VALUE: { prop: 'n_market_value', type: Number },
        D_MATURITY_DATE_UNDERLYING: { prop: 'd_maturity_date_underlying', type: String },
        V_COLLATERAL_ID: { prop: 'v_collateral_id', type: String },
        N_COLLATERAL_CCP_AMT: { prop: 'n_collateral_ccp_amt', type: Number },
        N_COLLATERAL_BANK_AMT: { prop: 'n_collateral_bank_amt', type: Number },
        F_MARGIN: { prop: 'f_margin', type: String },
        F_CENTRALLY_CLEARED: { prop: 'f_centrally_cleared', type: String },
        N_MARGIN_FREQUENCY: { prop: 'n_margin_frequency', type: String },
        V_NETTING_CODE: { prop: 'v_netting_code', type: String },
        SECTOR_OF_COUNTERPARTY: { prop: 'sector_of_counterparty', type: String },
        CREDIT_RATING_OF_COUNTERPARTY: { prop: 'credit_rating_of_counterparty', type: String },
        INTEREST_RATE: { prop: 'interest_rate', type: String },
    },
    STG_NETTING: {
        V_NETTING_CODE: { prop: 'v_netting_code', type: String },
        N_THRESHOLD: { prop: 'n_threshold', type: Number },
        N_MTA: { prop: 'n_mta', type: Number },
        N_NICA: { prop: 'n_nica', type: Number },
        N_NET: { prop: 'n_net', type: Number },
        N_EFFECTIVEMATURITY: { prop: 'n_effectivematurity', type: Number },
    },
    FINANCIAL_DATA_GL_ACTUAL_BALANCE: {
        Item: { prop: 'item', type: String },
        'Actual balance in quarter n-11': { prop: 'actual_balance_in_quarter_n_11', type: Number },
        'Actual balance in quarter n-10': { prop: 'actual_balance_in_quarter_n_10', type: Number },
        'Actual balance in quarter n-9': { prop: 'actual_balance_in_quarter_n_9', type: Number },
        'Actual balance in quarter n-8': { prop: 'actual_balance_in_quarter_n_8', type: Number },
        'Actual balance in quarter n-7': { prop: 'actual_balance_in_quarter_n_7', type: Number },
        'Actual balance in quarter n-6': { prop: 'actual_balance_in_quarter_n_6', type: Number },
        'Actual balance in quarter n-5': { prop: 'actual_balance_in_quarter_n_5', type: Number },
        'Actual balance in quarter n-4': { prop: 'actual_balance_in_quarter_n_4', type: Number },
        'Actual balance in quarter n-3': { prop: 'actual_balance_in_quarter_n_3', type: Number },
        'Actual balance in quarter n-2': { prop: 'actual_balance_in_quarter_n_2', type: Number },
        'Actual balance in quarter n-1': { prop: 'actual_balance_in_quarter_n_1', type: Number },
        'Actual balance in quarter n': { prop: 'actual_balance_in_quarter_n', type: Number },
    },
    OPERATIONAL_RISK_LOSS_DATA: {
        Item: { prop: 'item', type: String },
        'Quarter n-19': { prop: 'quarter_n_19', type: Number },
        'Quarter n-18': { prop: 'quarter_n_18', type: Number },
        'Quarter n-17': { prop: 'quarter_n_17', type: Number },
        'Quarter n-16': { prop: 'quarter_n_16', type: Number },
        'Quarter n-15': { prop: 'quarter_n_15', type: Number },
        'Quarter n-14': { prop: 'quarter_n_14', type: Number },
        'Quarter n-13': { prop: 'quarter_n_13', type: Number },
        'Quarter n-12': { prop: 'quarter_n_12', type: Number },
        'Quarter n-11': { prop: 'quarter_n_11', type: Number },
        'Quarter n-10': { prop: 'quarter_n_10', type: Number },
        'Quarter n-9': { prop: 'quarter_n_9', type: Number },
        'Quarter n-8': { prop: 'quarter_n_8', type: Number },
        'Quarter n-7': { prop: 'quarter_n_7', type: Number },
        'Quarter n-6': { prop: 'quarter_n_6', type: Number },
        'Quarter n-5': { prop: 'quarter_n_5', type: Number },
        'Quarter n-4': { prop: 'quarter_n_4', type: Number },
        'Quarter n-3': { prop: 'quarter_n_3', type: Number },
        'Quarter n-2': { prop: 'quarter_n_2', type: Number },
        'Quarter n-1': { prop: 'quarter_n_1', type: Number },
        'Quarter n': { prop: 'quarter_n', type: Number },
    },
};

async function readFileBySheetName(pathFile, sheet) {
    const fullSheetName = SHEET_NAMES_HASHMAP[sheet];
    const schema = schemaXlsx[fullSheetName];
    const { errors, rows } = await readXlsxFile(pathFile, { sheet, schema });

    if (errors.length) {
        throw new Error(JSON.stringify(errors[0]));
    }

    const hashmapKey = HASHMAP_KEY[fullSheetName];
    db.data[fullSheetName] = rows;
    db.data[FILE_HASHMAP[fullSheetName]] = rows.reduce((obj, row) => {
        if (!obj[row[hashmapKey]]) {
            obj[row[hashmapKey]] = row;
        }

        return obj;
    }, {});
}

// (async () => {
//     try {
//         const pathFile = './data/input/Data-b3.xlsx';
//         const sheetNames = await readSheetNames(pathFile);

//         for (const sheetName of SHEET_NAMES) {
//             if (!sheetNames.includes(sheetName)) {
//                 throw new Error(`Missing ${sheetName} sheet in file`);
//             }
//             await readFileBySheetName(pathFile, sheetName);
//         }
//         db.write();
//         mappingDataDeal();
//         console.log(1);
//     } catch (error) {
//         console.error(error.message);
//     }
// })();

export default async function () {
    try {
        const pathFile = './data/input/Data-b3 (5) (4).xlsx';
        const sheetNames = await readSheetNames(pathFile);

        for (const sheetName of SHEET_NAMES) {
            if (!sheetNames.includes(sheetName)) {
                throw new Error(`Missing ${sheetName} sheet in file`);
            }
            await readFileBySheetName(pathFile, sheetName);
        }
        db.write();
        mappingDataDeal();
        console.log(1);
    } catch (error) {
        console.error(error.message);
    }
}

// convert schemaXlsx to MAPPING_FIELD_NAMES

// try {
//     const obj = {};
//     for (const sheetName of SHEET_NAMES) {
//         const fullSheetName = SHEET_NAMES_HASHMAP[sheetName];
//         const schema = schemaXlsx[fullSheetName];
//         obj[fullSheetName] = {};
//         for (const key in schema) {
//             const element = schema[key];
//             obj[fullSheetName][key] = element.prop;
//         }
//     }

//     console.log(JSON.stringify(obj));
// } catch (error) {
//     console.log(error.message);
// }
