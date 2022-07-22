import distributions from 'distributions';

import db from '../helper/db.js';
import { calculate } from '../helper/operator.js';
import { formatStringNumber } from '../helper/utils.js';

export default function calAddOnUnmarginedCMD() {
    try {
        return 0
    } catch (error) {
        console.error(`calculate - calAddOnUnmarginedCMD - catch error: ${error.message}`);
    }
}
