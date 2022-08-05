import calCurvatureShock from './calculate-curvature-shock.js';
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
        calCurvatureShock();
        const RRAO = calRRAO();
        const DRC = calDRC();
        const deltaFx = calDeltaFx();
        const deltaFxLow = calDeltaFx(true);
        const deltaFxHigh = calDeltaFx(false, true);
        const vegaFx = calVegaFx();
        const vegaFxLow = calVegaFx(true);
        const vegaFxHigh = calVegaFx(false, true);
        const deltaGirr = calDeltaGirr();
        const deltaGirrLow = calDeltaGirr(true);
        const deltaGirrHigh = calDeltaGirr(false, true);
        const vegaGirr = calVegaGirr();
        const vegaGirrLow = calVegaGirr(true);
        const vegaGirrHigh = calVegaGirr(false, true);
        const curvatureFx = calCurvatureFx();
        const curvatureFxLow = calCurvatureFx(true);
        const curvatureFxHigh = calCurvatureFx(false, true);
        const curvatureGirr = calCurvatureGirr();
        const curvatureGirrLow = calCurvatureGirr(true);
        const curvatureGirrHigh = calCurvatureGirr(false, true);

        const result = {
            low: {
                DRC,
                RRAO,
                Delta: deltaFxLow + deltaGirrLow,
                Vega: vegaFxLow + vegaGirrLow,
                Curvature: curvatureFxLow + curvatureGirrLow,
                Total:
                    DRC +
                    RRAO +
                    (deltaFxLow + deltaGirrLow) +
                    (vegaFxLow + vegaGirrLow) +
                    (curvatureFxLow + curvatureGirrLow),
            },
            normal: {
                DRC,
                RRAO,
                Delta: deltaFx + deltaGirr,
                Vega: vegaFx + vegaGirr,
                Curvature: curvatureFx + curvatureGirr,
                Total: DRC + RRAO + (deltaFx + deltaGirr) + (vegaFx + vegaGirr) + (curvatureFx + curvatureGirr),
            },
            high: {
                DRC,
                RRAO,
                Delta: deltaFxHigh + deltaGirrHigh,
                Vega: vegaFxHigh + vegaGirrHigh,
                Curvature: curvatureFxHigh + curvatureGirrHigh,
                Total:
                    DRC +
                    (deltaFxHigh + deltaGirrHigh) +
                    (vegaFxHigh + vegaGirrHigh) +
                    (curvatureFxHigh + curvatureGirrHigh),
            },
        };

        let max = 0;
        for (const key in result) {
            const element = result[key];
            if (element.Total > max) {
                result.summary = element;
                max = element.Total;
            }
        }

        return result;
    } catch (error) {
        console.error(`calculate - calSaMr - catch error: ${error.message}`);
    }
}
