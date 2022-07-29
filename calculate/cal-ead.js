import calEADUnmargined1111 from './cal-ead-unmargined-1111.js';
import calEADUnmargined1113 from './cal-ead-unmargined-1113.js';
import calEADUnmargined1114 from './cal-ead-unmargined-1114.js';
import calEADUnmargined1115 from './cal-ead-unmargined-1115.js';
import calEADMargined1112 from './cal-ead-margined-1112.js';

import { calculate } from '../helper/operator.js';

export default function calEAD() {
    try {
        const EAD_unmargined_1111 = calEADUnmargined1111();
        const EAD_unmargined_1113 = calEADUnmargined1113();
        const EAD_unmargined_1114 = calEADUnmargined1114();
        const EAD_unmargined_1115 = calEADUnmargined1115();
        const EAD_margined_1112 = calEADMargined1112();

        const EAD_of_unmargined_transactions = calculate(
            EAD_unmargined_1111,
            calculate(EAD_unmargined_1113, calculate(EAD_unmargined_1114, EAD_unmargined_1115, '+'), '+'),
            '+',
        );
        const EAD_of_margined_transactions = EAD_margined_1112;

        // EAD
        const EAD = calculate(EAD_of_unmargined_transactions, EAD_of_margined_transactions, '+');

        return {
            EAD,
            EAD_of_unmargined_transactions,
            EAD_unmargined_1111,
            EAD_unmargined_1113,
            EAD_unmargined_1114,
            EAD_unmargined_1115,
            EAD_of_margined_transactions,
            EAD_margined_1112,
        };
    } catch (error) {
        console.error(`calculate - calEAD - catch error: ${error.message}`);
    }
}
