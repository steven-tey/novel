import { renderSVG } from './utils/render.mjs';
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.mjs';
import { makeUseVisualState } from '../../motion/utils/use-visual-state.mjs';
import { createSvgRenderState } from './utils/create-render-state.mjs';
import { buildSVGAttrs } from './utils/build-attrs.mjs';
import { isSVGTag } from './utils/is-svg-tag.mjs';

const svgMotionConfig = {
    useVisualState: makeUseVisualState({
        scrapeMotionValuesFromProps: scrapeMotionValuesFromProps,
        createRenderState: createSvgRenderState,
        onMount: (props, instance, { renderState, latestValues }) => {
            try {
                renderState.dimensions =
                    typeof instance.getBBox ===
                        "function"
                        ? instance.getBBox()
                        : instance.getBoundingClientRect();
            }
            catch (e) {
                // Most likely trying to measure an unrendered element under Firefox
                renderState.dimensions = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                };
            }
            buildSVGAttrs(renderState, latestValues, { enableHardwareAcceleration: false }, isSVGTag(instance.tagName), props.transformTemplate);
            renderSVG(instance, renderState);
        },
    }),
};

export { svgMotionConfig };
