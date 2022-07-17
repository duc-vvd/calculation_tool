const arr = [
  "FIC_MIS_DATE",
  "V_CUST_REF_CODE",
  "N_TOTAL_ASSETS",
  "N_TOTAL_REVENUE",
  "D_BS_CREATION_DATE",
  "V_CCY_CODE",
  "XX_N_ANNUAL_DEBT",
  "XX_N_ANNUAL_INCOME",
  "N_LEVERAGE_RATIO",
  "N_TOTAL_EQUITY",
  "XX_F_FIN_STATE_TYPE",
  "XX_F_AUDITED_REPORT",
  "N_TOTAL_DEBT",
];

const obj = arr.reduce((prev, cur, i) => {
  prev[cur] = i;
  return prev;
}, {});

console.log(JSON.stringify(obj));
