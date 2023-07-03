import { useState, useEffect } from 'react';
import { useConstant } from '../../utils/use-constant.mjs';
import { getOrigin, checkTargetForNewValues } from '../../render/utils/setters.mjs';
import { makeUseVisualState } from '../../motion/utils/use-visual-state.mjs';
import { createBox } from '../../projection/geometry/models.mjs';
import { VisualElement } from '../../render/VisualElement.mjs';
import { animateVisualElement } from '../interfaces/visual-element.mjs';

const createObject = () => ({});
class StateVisualElement extends VisualElement {
    build() { }
    measureInstanceViewportBox() {
        return createBox();
    }
    resetTransform() { }
    restoreTransform() { }
    removeValueFromRenderState() { }
    renderInstance() { }
    scrapeMotionValuesFromProps() {
        return createObject();
    }
    getBaseTargetFromProps() {
        return undefined;
    }
    readValueFromInstance(_state, key, options) {
        return options.initialState[key] || 0;
    }
    sortInstanceNodePosition() {
        return 0;
    }
    makeTargetAnimatableFromInstance({ transition, transitionEnd, ...target }) {
        const origin = getOrigin(target, transition || {}, this);
        checkTargetForNewValues(this, target, origin);
        return { transition, transitionEnd, ...target };
    }
}
const useVisualState = makeUseVisualState({
    scrapeMotionValuesFromProps: createObject,
    createRenderState: createObject,
});
/**
 * This is not an officially supported API and may be removed
 * on any version.
 */
function useAnimatedState(initialState) {
    const [animationState, setAnimationState] = useState(initialState);
    const visualState = useVisualState({}, false);
    const element = useConstant(() => {
        return new StateVisualElement({ props: {}, visualState, presenceContext: null }, { initialState });
    });
    useEffect(() => {
        element.mount({});
        return () => element.unmount();
    }, [element]);
    useEffect(() => {
        element.update({
            onUpdate: (v) => {
                setAnimationState({ ...v });
            },
        }, null);
    }, [setAnimationState, element]);
    const startAnimation = useConstant(() => (animationDefinition) => {
        return animateVisualElement(element, animationDefinition);
    });
    return [animationState, startAnimation];
}

export { useAnimatedState };
