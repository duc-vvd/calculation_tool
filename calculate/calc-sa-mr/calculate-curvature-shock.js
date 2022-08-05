import db from '../../helper/db.js';
import { calculate } from '../../helper/operator.js';
import { formatStringNumber, normdistExcel } from '../../helper/utils.js';
// CurvatureShock
export default function calCurvatureShock() {
    try {
        const { STG_INSTRUMENT_CONTRACT_MASTER } = db.data;

        const V_CURVATURE_GIRR_NORMAL_HASHMAP = {};
        const V_CURVATURE_GIRR_UP_HASHMAP = {};
        const V_CURVATURE_GIRR_DOWN_HASHMAP = {};
        const V_CURVATURE_FX_NORMAL_HASHMAP = {};
        const V_CURVATURE_FX_UP_HASHMAP = {};
        const V_CURVATURE_FX_DOWN_HASHMAP = {};

        STG_INSTRUMENT_CONTRACT_MASTER.forEach((element) => {
            let isZero = true;
            let N_UNDERLYING_PRICE; // J
            let N_EXERCISE_PRICE; // K
            let N_TIME_TO_EXERCISE_OPTION; // L
            let N_DIVIDEND; // M
            let N_RISK_FREE_RATE; // N
            let N_PRICE_VOLATILITY; // O

            if (
                element.v_product_code === 'FRA' ||
                element.v_product_code === 'CapFloor' ||
                element.v_product_code === 'Xccy Swaption' ||
                element.v_product_code === 'PRDC Swap' ||
                element.v_product_code === 'Range Accrual Swap'
            ) {
                N_UNDERLYING_PRICE = 0;
                N_EXERCISE_PRICE = 0;
                N_TIME_TO_EXERCISE_OPTION = 0;
                N_DIVIDEND = 0;
                N_RISK_FREE_RATE = 0;
                N_PRICE_VOLATILITY = 0;
            } else {
                isZero = false;
                N_UNDERLYING_PRICE = element.n_underlying_price;
                N_EXERCISE_PRICE = element.n_exercise_price;
                N_TIME_TO_EXERCISE_OPTION = element.n_time_to_exercise_option;
                N_DIVIDEND = element.n_dividend;
                N_RISK_FREE_RATE = element.n_risk_free_rate;
                N_PRICE_VOLATILITY = element.n_price_volatility;
            }

            // ===== START - PROCESSING AREA (NORMAL) ===

            // PV (Q) =$K4*EXP(-$L4*$N4)
            const PV_NORMAL = calculate(
                N_EXERCISE_PRICE,
                Math.exp(calculate(-N_TIME_TO_EXERCISE_OPTION, N_RISK_FREE_RATE, '*')),
                '*',
            );
            // σ√T (R) =$O4*SQRT($L4)
            const T_NORMAL = calculate(N_PRICE_VOLATILITY, Math.sqrt(N_TIME_TO_EXERCISE_OPTION), '*');
            // d1 (S) =IFERROR((LN($J4/$K4)+($N4-$M4+$O4^2/2)*$L4)/R4,0)
            const d1_NORMAL = calculate(
                calculate(
                    Math.log(calculate(N_UNDERLYING_PRICE, N_EXERCISE_PRICE, '/')),
                    calculate(
                        calculate(
                            calculate(N_RISK_FREE_RATE, N_DIVIDEND, '-'),
                            calculate(Math.pow(N_PRICE_VOLATILITY, 2), 2, '/'),
                            '+',
                        ),
                        N_TIME_TO_EXERCISE_OPTION,
                        '*',
                    ),
                    '+',
                ),
                T_NORMAL,
                '/',
            );
            // d2 (T) =$S4-$R4
            const d2_NORMAL = calculate(d1_NORMAL, T_NORMAL, '-');
            // N(d1) (U) =NORMDIST($S4,0,1,TRUE)
            const N_d1_NORMAL = normdistExcel(d1_NORMAL, 0, 1, true);
            // N(d2) (V) =NORMDIST($T4,0,1,TRUE)
            const N_d2_NORMAL = normdistExcel(d2_NORMAL, 0, 1, true);
            // PV*N(d2) (W) =$Q4*$V4
            const PV_N_d2_NORMAL = calculate(PV_NORMAL, N_d2_NORMAL, '*');
            // Valuation of Call/Put (X) =IF(OR($C4="FRA",$C4="CapFloor",$C4="Xccy Swaption",$C4="PRDC Swap",$C4="Range Accrual Swap"),0,IF(H4="CALL",$U4*$J4*EXP(-$M4*$L4)-$W4,$U4*$J4*EXP(-$M4*$L4)-$W4+Q4-J4))
            let valuation_Of_Call_Put_NORMAL;
            if (isZero) {
                valuation_Of_Call_Put_NORMAL = 0;
            } else {
                if (element.v_option_type === 'CALL') {
                    valuation_Of_Call_Put_NORMAL = calculate(
                        calculate(
                            calculate(N_d1_NORMAL, N_UNDERLYING_PRICE, '*'),
                            Math.exp(calculate(-N_DIVIDEND, N_TIME_TO_EXERCISE_OPTION, '*')),
                            '*',
                        ),
                        PV_N_d2_NORMAL,
                        '-',
                    );
                } else {
                    valuation_Of_Call_Put_NORMAL = calculate(
                        calculate(
                            calculate(
                                calculate(
                                    calculate(N_d1_NORMAL, N_UNDERLYING_PRICE, '*'),
                                    Math.exp(calculate(-N_DIVIDEND, N_TIME_TO_EXERCISE_OPTION, '*')),
                                    '*',
                                ),
                                PV_N_d2_NORMAL,
                                '-',
                            ),
                            PV_NORMAL,
                            '+',
                        ),
                        N_UNDERLYING_PRICE,
                        '-',
                    );
                }
            }

            if (element.v_instrument_code === 'FXO271821100') {
                console.log(1);
            }
            console.log(
                `=== ${element.v_instrument_code} - ${PV_NORMAL} - ${T_NORMAL} - ${d1_NORMAL} - ${d2_NORMAL} - ${N_d1_NORMAL} - ${N_d2_NORMAL} - ${PV_N_d2_NORMAL} - ${valuation_Of_Call_Put_NORMAL}`,
            );
            // ===== END - PROCESSING AREA (NORMAL) ===

            // ===== START - PROCESSING AREA (CURVATURE UP) ===

            // Underlying Price (Z) =$J4*1.01
            const Underlying_Price_CURVATURE_UP = calculate(N_UNDERLYING_PRICE, 1.01, '*');
            // PV (AA) =$K4*EXP(-$L4*$N4)
            const PV_CURVATURE_UP = calculate(
                N_EXERCISE_PRICE,
                Math.exp(calculate(-N_TIME_TO_EXERCISE_OPTION, N_RISK_FREE_RATE, '*')),
                '*',
            );
            // σ√T (AB) =$O4*SQRT($L4)
            const T_CURVATURE_UP = calculate(N_PRICE_VOLATILITY, Math.sqrt(N_TIME_TO_EXERCISE_OPTION), '*');
            // d1 (AC) =IFERROR((LN($Z4/$K4)+($N4-$M4+$O4^2/2)*$L4)/AB4,0)
            const d1_CURVATURE_UP = calculate(
                calculate(
                    Math.log(calculate(Underlying_Price_CURVATURE_UP, N_EXERCISE_PRICE, '/')),
                    calculate(
                        calculate(
                            calculate(N_RISK_FREE_RATE, N_DIVIDEND, '-'),
                            calculate(Math.pow(N_PRICE_VOLATILITY, 2), 2, '/'),
                            '+',
                        ),
                        N_TIME_TO_EXERCISE_OPTION,
                        '*',
                    ),
                    '+',
                ),
                T_CURVATURE_UP,
                '/',
            );
            // d2 (AD) =$AC4-$AB4
            const d2_CURVATURE_UP = calculate(d1_CURVATURE_UP, T_CURVATURE_UP, '-');
            // N(d1) (AE) =NORMDIST($AC4,0,1,TRUE)
            const N_d1_CURVATURE_UP = normdistExcel(d1_CURVATURE_UP, 0, 1, true);
            // N(d2) (AF) =NORMDIST($AD4,0,1,TRUE)
            const N_d2_CURVATURE_UP = normdistExcel(d2_CURVATURE_UP, 0, 1, true);
            // PV*N(d2) (AG) =$AA4*$AF4
            const PV_N_d2_CURVATURE_UP = calculate(PV_CURVATURE_UP, N_d2_CURVATURE_UP, '*');
            // Valuation of Call/Put (AH) =IF(OR($C4="FRA",$C4="CapFloor",$C4="Xccy Swaption",$C4="PRDC Swap",$C4="Range Accrual Swap"),0,IF(H4="CALL",$AE4*$Z4*EXP(-$M4*$L4)-$AG4,$AE4*$Z4*EXP(-$M4*$L4)-$AG4+AA4-Z4))
            let valuation_Of_Call_Put_CURVATURE_UP;
            if (isZero) {
                valuation_Of_Call_Put_CURVATURE_UP = 0;
            } else {
                if (element.v_option_type === 'CALL') {
                    valuation_Of_Call_Put_CURVATURE_UP = calculate(
                        calculate(
                            calculate(N_d1_CURVATURE_UP, Underlying_Price_CURVATURE_UP, '*'),
                            Math.exp(calculate(-N_DIVIDEND, N_TIME_TO_EXERCISE_OPTION, '*')),
                            '*',
                        ),
                        PV_N_d2_CURVATURE_UP,
                        '-',
                    );
                } else {
                    valuation_Of_Call_Put_CURVATURE_UP = calculate(
                        calculate(
                            calculate(
                                calculate(
                                    calculate(N_d1_CURVATURE_UP, Underlying_Price_CURVATURE_UP, '*'),
                                    Math.exp(calculate(-N_DIVIDEND, N_TIME_TO_EXERCISE_OPTION, '*')),
                                    '*',
                                ),
                                PV_N_d2_CURVATURE_UP,
                                '-',
                            ),
                            PV_CURVATURE_UP,
                            '+',
                        ),
                        Underlying_Price_CURVATURE_UP,
                        '-',
                    );
                }
            }
            console.log(
                `===UP=== ${element.v_instrument_code} - ${PV_CURVATURE_UP} - ${T_CURVATURE_UP} - ${d1_CURVATURE_UP} - ${d2_CURVATURE_UP} - ${N_d1_CURVATURE_UP} - ${N_d2_CURVATURE_UP} - ${PV_N_d2_CURVATURE_UP} - ${valuation_Of_Call_Put_CURVATURE_UP}`,
            );

            // ===== END - PROCESSING AREA (CURVATURE UP) ===

            // ===== START - PROCESSING AREA (CURVATURE DOWN) ===

            // Underlying Price (AJ) =$J4*0.99
            const Underlying_Price_CURVATURE_DOWN = calculate(N_UNDERLYING_PRICE, 0.99, '*');
            // PV (AK) =$K4*EXP(-$L4*$N4)
            const PV_CURVATURE_DOWN = calculate(
                N_EXERCISE_PRICE,
                Math.exp(calculate(-N_TIME_TO_EXERCISE_OPTION, N_RISK_FREE_RATE, '*')),
                '*',
            );
            // σ√T (AL) =$O4*SQRT($L4)
            const T_CURVATURE_DOWN = calculate(N_PRICE_VOLATILITY, Math.sqrt(N_TIME_TO_EXERCISE_OPTION), '*');
            // d1 (AM) =IFERROR((LN($AJ4/$K4)+($N4-$M4+$O4^2/2)*$L4)/AL4,0)
            const d1_CURVATURE_DOWN = calculate(
                calculate(
                    Math.log(calculate(Underlying_Price_CURVATURE_DOWN, N_EXERCISE_PRICE, '/')),
                    calculate(
                        calculate(
                            calculate(N_RISK_FREE_RATE, N_DIVIDEND, '-'),
                            calculate(Math.pow(N_PRICE_VOLATILITY, 2), 2, '/'),
                            '+',
                        ),
                        N_TIME_TO_EXERCISE_OPTION,
                        '*',
                    ),
                    '+',
                ),
                T_CURVATURE_DOWN,
                '/',
            );
            // d2 (AN) =$AM4-$AL4
            const d2_CURVATURE_DOWN = calculate(d1_CURVATURE_DOWN, T_CURVATURE_DOWN, '-');
            // N(d1) (AO) =NORMDIST($AM4,0,1,TRUE)
            const N_d1_CURVATURE_DOWN = normdistExcel(d1_CURVATURE_DOWN, 0, 1, true);
            // N(d2) (AP) =NORMDIST($AN4,0,1,TRUE)
            const N_d2_CURVATURE_DOWN = normdistExcel(d2_CURVATURE_DOWN, 0, 1, true);
            // PV*N(d2) (AQ) =$AK4*$AP4
            const PV_N_d2_CURVATURE_DOWN = calculate(PV_CURVATURE_DOWN, N_d2_CURVATURE_DOWN, '*');
            // Valuation of Call/Put (AR) =IF(OR($C4="FRA",$C4="CapFloor",$C4="Xccy Swaption",$C4="PRDC Swap",$C4="Range Accrual Swap"),0,IF(H4="CALL",$AO4*$AJ4*EXP(-$M4*$L4)-$AQ4,$AO4*$AJ4*EXP(-$M4*$L4)-$AQ4+AK4-AJ4))
            let valuation_Of_Call_Put_CURVATURE_DOWN;
            if (isZero) {
                valuation_Of_Call_Put_CURVATURE_DOWN = 0;
            } else {
                if (element.v_option_type === 'CALL') {
                    valuation_Of_Call_Put_CURVATURE_DOWN = calculate(
                        calculate(
                            calculate(N_d1_CURVATURE_DOWN, Underlying_Price_CURVATURE_DOWN, '*'),
                            Math.exp(calculate(-N_DIVIDEND, N_TIME_TO_EXERCISE_OPTION, '*')),
                            '*',
                        ),
                        PV_N_d2_CURVATURE_DOWN,
                        '-',
                    );
                } else {
                    valuation_Of_Call_Put_CURVATURE_DOWN = calculate(
                        calculate(
                            calculate(
                                calculate(
                                    calculate(N_d1_CURVATURE_DOWN, Underlying_Price_CURVATURE_DOWN, '*'),
                                    Math.exp(calculate(-N_DIVIDEND, N_TIME_TO_EXERCISE_OPTION, '*')),
                                    '*',
                                ),
                                PV_N_d2_CURVATURE_DOWN,
                                '-',
                            ),
                            PV_CURVATURE_DOWN,
                            '+',
                        ),
                        Underlying_Price_CURVATURE_DOWN,
                        '-',
                    );
                }
            }

            // ===== END - PROCESSING AREA (CURVATURE DOWN) ===

            if (element.v_ccy_code) {
                // V_CURVATURE_GIRR_NORMAL (AV) =SUMIFS($X:$X,$D:$D,$AU4)+SUMIFS($X:$X,$E:$E,$AU4)
                if (!V_CURVATURE_GIRR_NORMAL_HASHMAP[element.v_ccy_code]) {
                    V_CURVATURE_GIRR_NORMAL_HASHMAP[element.v_ccy_code] = 0;
                }
                V_CURVATURE_GIRR_NORMAL_HASHMAP[element.v_ccy_code] = calculate(
                    valuation_Of_Call_Put_NORMAL,
                    V_CURVATURE_GIRR_NORMAL_HASHMAP[element.v_ccy_code],
                    '+',
                );
                // V_CURVATURE_GIRR_UP (AW) =SUMIFS($AH:$AH,$D:$D,$AU4)+SUMIFS($AH:$AH,$E:$E,$AU4)
                if (!V_CURVATURE_GIRR_UP_HASHMAP[element.v_ccy_code]) {
                    V_CURVATURE_GIRR_UP_HASHMAP[element.v_ccy_code] = 0;
                }
                V_CURVATURE_GIRR_UP_HASHMAP[element.v_ccy_code] = calculate(
                    valuation_Of_Call_Put_CURVATURE_UP,
                    V_CURVATURE_GIRR_UP_HASHMAP[element.v_ccy_code],
                    '+',
                );
                // V_CURVATURE_GIRR_DOWN (AX) =SUMIFS($AR:$AR,$D:$D,$AU4)+SUMIFS($AR:$AR,$E:$E,$AU4)
                if (!V_CURVATURE_GIRR_DOWN_HASHMAP[element.v_ccy_code]) {
                    V_CURVATURE_GIRR_DOWN_HASHMAP[element.v_ccy_code] = 0;
                }
                V_CURVATURE_GIRR_DOWN_HASHMAP[element.v_ccy_code] = calculate(
                    valuation_Of_Call_Put_CURVATURE_DOWN,
                    V_CURVATURE_GIRR_DOWN_HASHMAP[element.v_ccy_code],
                    '+',
                );
            }
            if (element.v_ccy2_code) {
                // V_CURVATURE_GIRR_NORMAL (AV) =SUMIFS($X:$X,$D:$D,$AU4)+SUMIFS($X:$X,$E:$E,$AU4)
                if (!V_CURVATURE_GIRR_NORMAL_HASHMAP[element.v_ccy2_code]) {
                    V_CURVATURE_GIRR_NORMAL_HASHMAP[element.v_ccy2_code] = 0;
                }
                V_CURVATURE_GIRR_NORMAL_HASHMAP[element.v_ccy2_code] = calculate(
                    valuation_Of_Call_Put_NORMAL,
                    V_CURVATURE_GIRR_NORMAL_HASHMAP[element.v_ccy2_code],
                    '+',
                );
                // V_CURVATURE_GIRR_UP (AW) =SUMIFS($AH:$AH,$D:$D,$AU4)+SUMIFS($AH:$AH,$E:$E,$AU4)
                if (!V_CURVATURE_GIRR_UP_HASHMAP[element.v_ccy2_code]) {
                    V_CURVATURE_GIRR_UP_HASHMAP[element.v_ccy2_code] = 0;
                }
                V_CURVATURE_GIRR_UP_HASHMAP[element.v_ccy2_code] = calculate(
                    valuation_Of_Call_Put_CURVATURE_UP,
                    V_CURVATURE_GIRR_UP_HASHMAP[element.v_ccy2_code],
                    '+',
                );
                // V_CURVATURE_GIRR_DOWN (AX) =SUMIFS($AR:$AR,$D:$D,$AU4)+SUMIFS($AR:$AR,$E:$E,$AU4)
                if (!V_CURVATURE_GIRR_DOWN_HASHMAP[element.v_ccy2_code]) {
                    V_CURVATURE_GIRR_DOWN_HASHMAP[element.v_ccy2_code] = 0;
                }
                V_CURVATURE_GIRR_DOWN_HASHMAP[element.v_ccy2_code] = calculate(
                    valuation_Of_Call_Put_CURVATURE_DOWN,
                    V_CURVATURE_GIRR_DOWN_HASHMAP[element.v_ccy2_code],
                    '+',
                );
            }
            if (element.v_ccy_code && element.v_ccy2_code) {
                // V_PAIR_CCY (F)
                const V_PAIR_CCY = `${element.v_ccy_code}/${element.v_ccy2_code}`;

                // V_CURVATURE_FX_NORMAL (AY) =SUMIFS($X:$X,$F:$F,$AU9)
                if (!V_CURVATURE_FX_NORMAL_HASHMAP[V_PAIR_CCY]) {
                    V_CURVATURE_FX_NORMAL_HASHMAP[V_PAIR_CCY] = 0;
                }
                V_CURVATURE_FX_NORMAL_HASHMAP[V_PAIR_CCY] = calculate(
                    valuation_Of_Call_Put_NORMAL,
                    V_CURVATURE_FX_NORMAL_HASHMAP[V_PAIR_CCY],
                    '+',
                );
                // V_CURVATURE_FX_UP (AZ) =SUMIFS($AH:$AH,$F:$F,$AU9)
                if (!V_CURVATURE_FX_UP_HASHMAP[V_PAIR_CCY]) {
                    V_CURVATURE_FX_UP_HASHMAP[V_PAIR_CCY] = 0;
                }
                V_CURVATURE_FX_UP_HASHMAP[V_PAIR_CCY] = calculate(
                    valuation_Of_Call_Put_CURVATURE_UP,
                    V_CURVATURE_FX_UP_HASHMAP[V_PAIR_CCY],
                    '+',
                );
                // V_CURVATURE_FX_DOWN (BA) =SUMIFS($AR:$AR,$F:$F,$AU9)
                if (!V_CURVATURE_FX_DOWN_HASHMAP[V_PAIR_CCY]) {
                    V_CURVATURE_FX_DOWN_HASHMAP[V_PAIR_CCY] = 0;
                }
                V_CURVATURE_FX_DOWN_HASHMAP[V_PAIR_CCY] = calculate(
                    valuation_Of_Call_Put_CURVATURE_DOWN,
                    V_CURVATURE_FX_DOWN_HASHMAP[V_PAIR_CCY],
                    '+',
                );
            }
        });

        db.data.V_CURVATURE_GIRR_NORMAL_HASHMAP = V_CURVATURE_GIRR_NORMAL_HASHMAP;
        db.data.V_CURVATURE_GIRR_UP_HASHMAP = V_CURVATURE_GIRR_UP_HASHMAP;
        db.data.V_CURVATURE_GIRR_DOWN_HASHMAP = V_CURVATURE_GIRR_DOWN_HASHMAP;
        db.data.V_CURVATURE_FX_NORMAL_HASHMAP = V_CURVATURE_FX_NORMAL_HASHMAP;
        db.data.V_CURVATURE_FX_UP_HASHMAP = V_CURVATURE_FX_UP_HASHMAP;
        db.data.V_CURVATURE_FX_DOWN_HASHMAP = V_CURVATURE_FX_DOWN_HASHMAP;
        db.write();
    } catch (error) {
        console.error(`calculate - calCurvatureShock - catch error: ${error.message}`);
    }
}
