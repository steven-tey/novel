import * as React from 'react';
import { forwardRef, useContext } from 'react';
import { MotionConfigContext } from '../context/MotionConfigContext.mjs';
import { MotionContext } from '../context/MotionContext/index.mjs';
import { useVisualElement } from './utils/use-visual-element.mjs';
import { useMotionRef } from './utils/use-motion-ref.mjs';
import { useCreateMotionContext } from '../context/MotionContext/create.mjs';
import { loadFeatures } from './features/load-features.mjs';
import { isBrowser } from '../utils/is-browser.mjs';
import { LayoutGroupContext } from '../context/LayoutGroupContext.mjs';
import { LazyContext } from '../context/LazyContext.mjs';
import { SwitchLayoutGroupContext } from '../context/SwitchLayoutGroupContext.mjs';
import { motionComponentSymbol } from './utils/symbol.mjs';

/**
 * Create a `motion` component.
 *
 * This function accepts a Component argument, which can be either a string (ie "div"
 * for `motion.div`), or an actual React component.
 *
 * Alongside this is a config option which provides a way of rendering the provided
 * component "offline", or outside the React render cycle.
 */
function createMotionComponent({ preloadedFeatures, createVisualElement, useRender, useVisualState, Component, }) {
    preloadedFeatures && loadFeatures(preloadedFeatures);
    function MotionComponent(props, externalRef) {
        /**
         * If we need to measure the element we load this functionality in a
         * separate class component in order to gain access to getSnapshotBeforeUpdate.
         */
        let MeasureLayout;
        const configAndProps = {
            ...useContext(MotionConfigContext),
            ...props,
            layoutId: useLayoutId(props),
        };
        const { isStatic } = configAndProps;
        const context = useCreateMotionContext(props);
        const visualState = useVisualState(props, isStatic);
        if (!isStatic && isBrowser) {
            /**
             * Create a VisualElement for this component. A VisualElement provides a common
             * interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
             * providing a way of rendering to these APIs outside of the React render loop
             * for more performant animations and interactions
             */
            context.visualElement = useVisualElement(Component, visualState, configAndProps, createVisualElement);
            /**
             * Load Motion gesture and animation features. These are rendered as renderless
             * components so each feature can optionally make use of React lifecycle methods.
             */
            const initialLayoutGroupConfig = useContext(SwitchLayoutGroupContext);
            const isStrict = useContext(LazyContext).strict;
            if (context.visualElement) {
                MeasureLayout = context.visualElement.loadFeatures(
                // Note: Pass the full new combined props to correctly re-render dynamic feature components.
                configAndProps, isStrict, preloadedFeatures, initialLayoutGroupConfig);
            }
        }
        /**
         * The mount order and hierarchy is specific to ensure our element ref
         * is hydrated by the time features fire their effects.
         */
        return (React.createElement(MotionContext.Provider, { value: context },
            MeasureLayout && context.visualElement ? (React.createElement(MeasureLayout, { visualElement: context.visualElement, ...configAndProps })) : null,
            useRender(Component, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, context.visualElement)));
    }
    const ForwardRefComponent = forwardRef(MotionComponent);
    ForwardRefComponent[motionComponentSymbol] = Component;
    return ForwardRefComponent;
}
function useLayoutId({ layoutId }) {
    const layoutGroupId = useContext(LayoutGroupContext).id;
    return layoutGroupId && layoutId !== undefined
        ? layoutGroupId + "-" + layoutId
        : layoutId;
}

export { createMotionComponent };
