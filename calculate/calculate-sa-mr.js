import calRRAO from './calculate-rrao.js';
import calDRC from './calculate-drc.js';
import calDeltaFx from './calculate-delta-fx.js';
import calVegaFx from './calculate-vega-fx.js';
import calDeltaGirr from './calculate-delta-girr.js';
import calVegaGirr from './calculate-vega-girr.js';
import calCurvatureFx from './calculate-curvature-fx.js';
import calCurvatureGirr from './calculate-curvature-girr.js';

export default function calSaMr() {
    try {
        const RRAO = calRRAO();
        const DRC = calDRC();
        const deltaFx = calDeltaFx();
        const vegaFx = calVegaFx();
        const deltaGirr = calDeltaGirr();
        const vegaGirr = calVegaGirr();
        const curvatureFx = calCurvatureFx();
        const curvatureGirr = calCurvatureGirr();
        console.log({
            DRC,
            delta: deltaFx + deltaGirr,
            vega: vegaFx + vegaGirr,
            curvature: curvatureFx + curvatureGirr,
        });
        const total = DRC + RRAO + (deltaFx + deltaGirr) + (vegaFx + vegaGirr) + (curvatureFx + curvatureGirr);
        return total;
    } catch (error) {
        console.error(`calculate - calSaMr - catch error: ${error.message}`);
    }
}
