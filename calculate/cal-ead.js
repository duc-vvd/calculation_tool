import calEADUnmargined1111 from './cal-ead-unmargined-1111.js';
import calEADUnmargined1113 from './cal-ead-unmargined-1113.js';
import calEADUnmargined1114 from './cal-ead-unmargined-1114.js';
import calEADUnmargined1115 from './cal-ead-unmargined-1115.js';
import calEADMargined1112 from './cal-ead-margined-1112.js';

import { calculate } from '../helper/operator.js';

export default function calEAD() {
    try {
        const EADUnmargined1111 = calEADUnmargined1111();
        const EADUnmargined1113 = calEADUnmargined1113();
        const EADUnmargined1114 = calEADUnmargined1114();
        const EADUnmargined1115 = calEADUnmargined1115();
        const EADMargined1112 = calEADMargined1112();

        // EAD
        const ead = calculate(
            calculate(
                EADUnmargined1111,
                calculate(EADUnmargined1113, calculate(EADUnmargined1114, EADUnmargined1115, '+'), '+'),
                '+',
            ),
            EADMargined1112,
            '+',
        );
        return ead;
    } catch (error) {
        console.error(`calculate - calEAD - catch error: ${error.message}`);
    }
}
