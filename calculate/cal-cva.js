import calSCVA from './cal-scva.js';

import { calculate } from '../helper/operator.js';

export default function calCVA() {
    try {
        const SCVA = calSCVA();

        // Discount scalar
        const discountScalar = 0.65;
        // Supervisory correlation
        const supervisoryCorrelation = 0.5;

        let sumOfScvaOverCounterparties = 0;
        for (const key in SCVA) {
            // Sum of SCVA over counterparties
            sumOfScvaOverCounterparties = calculate(SCVA[key], sumOfScvaOverCounterparties, '+');
        }

        let sumOfScvaSquaredOverCounterparties = 0;
        for (const key in SCVA) {
            sumOfScvaSquaredOverCounterparties = calculate(
                calculate(SCVA[key], SCVA[key], '*'),
                sumOfScvaSquaredOverCounterparties,
                '+',
            );
        }

        // Systematic components of CVA risk
        const systematicComponentsOfCvaRisk = Math.pow(
            calculate(supervisoryCorrelation, sumOfScvaOverCounterparties, '*'),
            2,
        );
        // Idiosyncratic components of CVA risk
        const idiosyncraticComponentsOfCvaRisk = calculate(
            calculate(1, Math.pow(supervisoryCorrelation, 2), '-'),
            sumOfScvaSquaredOverCounterparties,
            '*',
        );

        // K Reduced
        const kReduced = Math.sqrt(calculate(systematicComponentsOfCvaRisk, idiosyncraticComponentsOfCvaRisk, '+'));

        // Capital requirements (reduced)
        const capital_requirements = calculate(discountScalar, kReduced, '*');

        return {
            capital_requirements,
            discount_scalar: discountScalar,
            k_reduced: kReduced,
            systematic_components_of_cva_risk: systematicComponentsOfCvaRisk,
            idiosyncratic_components_of_cva_risk: idiosyncraticComponentsOfCvaRisk,
            sum_of_scva_over_counterparties: sumOfScvaOverCounterparties,
            sum_of_scva_squared_over_counterparties: sumOfScvaSquaredOverCounterparties,
            supervisory_correlation: supervisoryCorrelation,
        };
    } catch (error) {
        console.error(`calculate - calCVA - catch error: ${error.message}`);
    }
}
