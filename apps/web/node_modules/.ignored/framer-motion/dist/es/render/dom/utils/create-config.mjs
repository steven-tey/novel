import { isSVGComponent } from './is-svg-component.mjs';
import { createUseRender } from '../use-render.mjs';
import { svgMotionConfig } from '../../svg/config-motion.mjs';
import { htmlMotionConfig } from '../../html/config-motion.mjs';

function createDomMotionConfig(Component, { forwardMotionProps = false }, preloadedFeatures, createVisualElement) {
    const baseConfig = isSVGComponent(Component)
        ? svgMotionConfig
        : htmlMotionConfig;
    return {
        ...baseConfig,
        preloadedFeatures,
        useRender: createUseRender(forwardMotionProps),
        createVisualElement,
        Component,
    };
}

export { createDomMotionConfig };
