import { createMotionComponent } from '../../motion/index.mjs';
import { createMotionProxy } from './motion-proxy.mjs';
import { createDomMotionConfig } from './utils/create-config.mjs';
import { gestureAnimations } from '../../motion/features/gestures.mjs';
import { animations } from '../../motion/features/animations.mjs';
import { drag } from '../../motion/features/drag.mjs';
import { createDomVisualElement } from './create-visual-element.mjs';
import { layout } from '../../motion/features/layout.mjs';

const preloadedFeatures = {
    ...animations,
    ...gestureAnimations,
    ...drag,
    ...layout,
};
/**
 * HTML & SVG components, optimised for use with gestures and animation. These can be used as
 * drop-in replacements for any HTML & SVG component, all CSS & SVG properties are supported.
 *
 * @public
 */
const motion = /*@__PURE__*/ createMotionProxy((Component, config) => createDomMotionConfig(Component, config, preloadedFeatures, createDomVisualElement));
/**
 * Create a DOM `motion` component with the provided string. This is primarily intended
 * as a full alternative to `motion` for consumers who have to support environments that don't
 * support `Proxy`.
 *
 * ```javascript
 * import { createDomMotionComponent } from "framer-motion"
 *
 * const motion = {
 *   div: createDomMotionComponent('div')
 * }
 * ```
 *
 * @public
 */
function createDomMotionComponent(key) {
    return createMotionComponent(createDomMotionConfig(key, { forwardMotionProps: false }, preloadedFeatures, createDomVisualElement));
}

export { createDomMotionComponent, motion };
