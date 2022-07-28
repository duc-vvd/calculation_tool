import errorCode from '../../common/error-code.js';

export default function (req, res) {
    res.send({
        Data: {
            Result: 0.0,
            C: 0.0,
            RWA: { RWA_CCR: 0.0, RWA_CR: 0.0, RWA_Total: 0.0 },
            K_OR: 0.0,
            K_MR: {
                K_IRR: { K_SRW: 0.0, K_GRW: 0.0 },
                K_FX: 0.0,
                K_OPT: { K_L_OPT: 0.0, K_LC_OPT: 0.0, K_S_OPT: 0.0, Total: 0.0 },
                K_Equity: 0.0,
                K_CMR: 0.0,
            },
        },
        Success: true,
        ErrorCode: errorCode.SUCCESS,
    });
}
