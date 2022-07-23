import distributions from 'distributions';

import calEADUnmargined1111 from './cal-ead-unmargined-1111.js';
import calEADUnmargined1113 from './cal-ead-unmargined-1113.js';
import calEADUnmargined1114 from './cal-ead-unmargined-1114.js';
import calEADUnmargined1115 from './cal-ead-unmargined-1115.js';
import calEADMargined1112 from './cal-ead-margined-1112.js';

import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber, yearfrac3 } from '../helper/utils.js';

export default function calSCVA() {
    try {
        const EADUnmargined1111 = calEADUnmargined1111();
        const EADUnmargined1113 = calEADUnmargined1113();
        const EADUnmargined1114 = calEADUnmargined1114();
        const EADUnmargined1115 = calEADUnmargined1115();
        const EADMargined1112 = calEADMargined1112();

        const { dataDeal } = db.data;
        const effectiveMaturityOfEachTransaction = {};
        const sumNotionalAmountInLcyOfEachNettingSet = {};
        const supervisoryRiskWeightsIG = {
            'Sovereigns including central banks and multilateral development banks': 0.005,
            'Local government, government-backed non-financials, education and public administration': 0.01,
            'Financials including government-backed financials': 0.05,
            'Basic materials, energy, industrials, agriculture, manufacturing, mining and quarrying': 0.03,
            'Consumer goods and services, transportation and storage, administrative and support service activities': 0.03,
            'Technology, telecommunications': 0.02,
            'Health care, utilities, professional and technical activities': 0.015,
            'Other sector': 0.05,
        };
        const supervisoryRiskWeightsHYAndNR = {
            'Sovereigns including central banks and multilateral development banks': 0.02,
            'Local government, government-backed non-financials, education and public administration': 0.04,
            'Financials including government-backed financials': 0.12,
            'Basic materials, energy, industrials, agriculture, manufacturing, mining and quarrying': 0.07,
            'Consumer goods and services, transportation and storage, administrative and support service activities': 0.085,
            'Technology, telecommunications': 0.055,
            'Health care, utilities, professional and technical activities': 0.05,
            'Other sector': 0.12,
        };

        // bat dau - can phai xoa
        const effectiveMaturityOfEachTransactionFake = {
            IRS_10001: 5.681701031,
            IRS_10002: 3.081818182,
            IRS_10003: 5.737244898,
            IRS_10004: 2.995238095,
            'CCS_1.1': 5.573770492,
            'CCS_1.2': 5.714285714,
            'CCS_2.1': 6.05,
            'CCS_2.2': 6.111111111,
            FXOP_1: 1.048232323,
            FXOP_2: 1.032189542,
            FXOP_3: 1.041239316,
            FXFWD_1: 1.538461538,
            FXFWD_2: 1.029093567,
            FXFWD_3: 1.058333333,
            FXFWD_4: 1.068650794,
            FXFWD_5: 1.042676768,
            'FXSWP_1.1': 4.06,
            'FXSWP_1.2': 4.2,
            'FXSWP_2.1': 5.563380282,
            'FXSWP_2.2': 5.549450549,
            FXFWD_6: 1.555555556,
            FXFWD_7: 1.041239316,
            IRS_10005: 5.681701031,
        };
        // ket thuc - can phai xoa

        dataDeal.forEach((element) => {
            if (!element.V_NETTING_CODE) return;

            // Effective maturity of each transaction
            effectiveMaturityOfEachTransaction[element.V_INSTRUMENT_CODE] =
                effectiveMaturityOfEachTransactionFake[element.V_INSTRUMENT_CODE]; // chua biet tinh => fake data

            if (!sumNotionalAmountInLcyOfEachNettingSet[element.V_NETTING_CODE]) {
                sumNotionalAmountInLcyOfEachNettingSet[element.V_NETTING_CODE] = 0;
            }

            sumNotionalAmountInLcyOfEachNettingSet[element.V_NETTING_CODE] = calculate(
                formatStringNumber(element.N_NOTIONAL_AMT),
                sumNotionalAmountInLcyOfEachNettingSet[element.V_NETTING_CODE],
                '+',
            );
        });

        const weightOfEachTransactionInItsNettingSet = {};
        const effectiveMaturityMultipliedByWeightOfEachTransacion = {};
        dataDeal.forEach((element) => {
            if (!element.V_NETTING_CODE) return;

            // Weight of each transacion in its netting set
            weightOfEachTransactionInItsNettingSet[element.V_INSTRUMENT_CODE] = calculate(
                element.N_NOTIONAL_AMT,
                sumNotionalAmountInLcyOfEachNettingSet[element.V_NETTING_CODE],
                '/',
            );

            // Effective maturity * Weight of each transacion in its netting set

            effectiveMaturityMultipliedByWeightOfEachTransacion[element.V_INSTRUMENT_CODE] = calculate(
                effectiveMaturityOfEachTransaction[element.V_INSTRUMENT_CODE],
                weightOfEachTransactionInItsNettingSet[element.V_INSTRUMENT_CODE],
                '*',
            );
        });

        const counterpartyNettingCode = {};
        const effectiveMaturity = {};
        const sectorOfCounterpartyHashmap = {};
        const creditRatingHashmap = {};
        dataDeal.forEach((element) => {
            if (!element.V_NETTING_CODE) return;

            if (!effectiveMaturity[element.V_NETTING_CODE]) {
                effectiveMaturity[element.V_NETTING_CODE] = 0;
            }

            // Counterparty
            if (!counterpartyNettingCode[element.V_NETTING_CODE]) {
                counterpartyNettingCode[element.V_NETTING_CODE] = element.V_PARTY_ID;
            }

            // Sector of Counterparty
            if (!sectorOfCounterpartyHashmap[element.V_PARTY_ID]) {
                sectorOfCounterpartyHashmap[element.V_PARTY_ID] = element.SECTOR_OF_COUNTERPARTY;
            }

            // Credit rating (Investment Grade/High Yield - Not rated) credit_rating
            if (!creditRatingHashmap[element.V_PARTY_ID]) {
                creditRatingHashmap[element.V_PARTY_ID] = element.credit_rating;
            }

            // Effective maturity
            effectiveMaturity[element.V_NETTING_CODE] = calculate(
                effectiveMaturity[element.V_NETTING_CODE],
                effectiveMaturityMultipliedByWeightOfEachTransacion[element.V_INSTRUMENT_CODE],
                '+',
            );
        });

        const sumCounterpartyNettingCode = {};
        for (const key in effectiveMaturity) {
            // EAD
            let ead;
            if (key == 1111) {
                ead = EADUnmargined1111;
            } else if (key == 1112) {
                ead = EADMargined1112;
            } else if (key == 1113) {
                ead = EADUnmargined1113;
            } else if (key == 1114) {
                ead = EADUnmargined1114;
            } else if (key == 1115) {
                ead = EADUnmargined1115;
            }

            // Regulatory Df
            const regulatoryDf = calculate(
                calculate(1, Math.exp(-0.05 * effectiveMaturity[key]), '-'),
                calculate(0.05, effectiveMaturity[key], '*'),
                '/',
            );

            // sum counterparty of each netting set
            const counterparty = counterpartyNettingCode[key];
            if (!sumCounterpartyNettingCode[counterparty]) {
                sumCounterpartyNettingCode[counterparty] = 0;
            }
            sumCounterpartyNettingCode[counterparty] = calculate(
                calculate(calculate(effectiveMaturity[key], ead, '*'), regulatoryDf, '*'),
                sumCounterpartyNettingCode[counterparty],
                '+',
            );
        }

        const scva = {};
        for (const key in sumCounterpartyNettingCode) {
            // Sector of Counterparty
            const sectorOfCounterparty = sectorOfCounterpartyHashmap[key];

            // Credit rating (Investment Grade/High Yield - Not rated) credit_rating
            const creditRating = creditRatingHashmap[key];

            // Risk Weight
            let riskWeight = supervisoryRiskWeightsIG[sectorOfCounterparty];
            if (creditRating === 'HY and NR') {
                riskWeight = supervisoryRiskWeightsHYAndNR[sectorOfCounterparty];
            }

            // SCVA
            scva[key] = calculate(calculate(1 / 1.4, riskWeight, '*'), sumCounterpartyNettingCode[key], '*');
        }
        return scva;
    } catch (error) {
        console.error(`calculate - calSCVA - catch error: ${error.message}`);
    }
}
