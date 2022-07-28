export default {
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
};
