import db from "../helper/db.js";
import { calculate } from "../helper/operator.js";
import { formatStringNumber } from "../helper/utils.js";

export default function calRRAO() {
  try {
    const { STG_INSTRUMENT_CONTRACT_MASTER, STG_BANK_POSITIONS_HASHMAP } =
      db.data;
    return STG_INSTRUMENT_CONTRACT_MASTER.reduce((sum, item) => {
      const N_NOTIONAL_AMT_RCV_LCY =
        STG_BANK_POSITIONS_HASHMAP[item.V_INSTRUMENT_CODE]
          ?.N_NOTIONAL_AMT_RCV_LCY;
      if (!N_NOTIONAL_AMT_RCV_LCY) return sum;
      let riskWeight = 0;
      if (item.F_EXOTIC_UNDERLYING === "Y") {
        riskWeight = 0.01;
      } else if (item.F_OPTIONAL === "Y") {
        riskWeight = 0.001;
      }
      const weightedNotional = calculate(
        formatStringNumber(N_NOTIONAL_AMT_RCV_LCY),
        riskWeight,
        "*"
      );
      return sum + weightedNotional;
    }, 0);
  } catch (error) {
    console.error(`calculate - calRRAO - catch error: ${error.message}`);
  }
}
