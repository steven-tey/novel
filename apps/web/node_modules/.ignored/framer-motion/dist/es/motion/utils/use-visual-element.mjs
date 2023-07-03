import { useContext, useRef, useInsertionEffect, useEffect } from 'react';
import { PresenceContext } from '../../context/PresenceContext.mjs';
import { MotionContext } from '../../context/MotionContext/index.mjs';
import { useIsomorphicLayoutEffect } from '../../utils/use-isomorphic-effect.mjs';
import { LazyContext } from '../../context/LazyContext.mjs';
import { MotionConfigContext } from '../../context/MotionConfigContext.mjs';

function useVisualElement(Component, visualState, props, createVisualElement) {
    const { visualElement: parent } = useContext(MotionContext);
    const lazyContext = useContext(LazyContext);
    const presenceContext = useContext(PresenceContext);
    const reducedMotionConfig = useContext(MotionConfigContext).reducedMotion;
    const visualElementRef = useRef();
    /**
     * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
     */
    createVisualElement = createVisualElement || lazyContext.renderer;
    if (!visualElementRef.current && createVisualElement) {
        visualElementRef.current = createVisualElement(Component, {
            visualState,
            parent,
            props,
            presenceContext,
            blockInitialAnimation: presenceContext
                ? presenceContext.initial === false
                : false,
            reducedMotionConfig,
        });
    }
    const visualElement = visualElementRef.current;
    useInsertionEffect(() => {
        visualElement && visualElement.update(props, presenceContext);
    });
    useIsomorphicLayoutEffect(() => {
        visualElement && visualElement.render();
    });
    useEffect(() => {
        visualElement && visualElement.updateFeatures();
    });
    /**
     * Ideally this function would always run in a useEffect.
     *
     * However, if we have optimised appear animations to handoff from,
     * it needs to happen synchronously to ensure there's no flash of
     * incorrect styles in the event of a hydration error.
     *
     * So if we detect a situtation where optimised appear animations
     * are running, we use useLayoutEffect to trigger animations.
     */
    const useAnimateChangesEffect = window.HandoffAppearAnimations
        ? useIsomorphicLayoutEffect
        : useEffect;
    useAnimateChangesEffect(() => {
        if (visualElement && visualElement.animationState) {
            visualElement.animationState.animateChanges();
        }
    });
    return visualElement;
}

export { useVisualElement };
