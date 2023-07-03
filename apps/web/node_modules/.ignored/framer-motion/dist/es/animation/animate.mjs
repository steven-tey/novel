import { resolveElements } from '../render/dom/utils/resolve-element.mjs';
import { visualElementStore } from '../render/store.mjs';
import { invariant } from '../utils/errors.mjs';
import { GroupPlaybackControls } from './GroupPlaybackControls.mjs';
import { isDOMKeyframes } from './utils/is-dom-keyframes.mjs';
import { animateTarget } from './interfaces/visual-element-target.mjs';
import { createVisualElement } from './utils/create-visual-element.mjs';
import { animateSingleValue } from './interfaces/single-value.mjs';
import { createAnimationsFromSequence } from './sequence/create.mjs';
import { isMotionValue } from '../value/utils/is-motion-value.mjs';

function animateElements(elementOrSelector, keyframes, options, scope) {
    const elements = resolveElements(elementOrSelector, scope);
    const numElements = elements.length;
    invariant(Boolean(numElements), "No valid element provided.");
    const animations = [];
    for (let i = 0; i < numElements; i++) {
        const element = elements[i];
        /**
         * Check each element for an associated VisualElement. If none exists,
         * we need to create one.
         */
        if (!visualElementStore.has(element)) {
            /**
             * TODO: We only need render-specific parts of the VisualElement.
             * With some additional work the size of the animate() function
             * could be reduced significantly.
             */
            createVisualElement(element);
        }
        const visualElement = visualElementStore.get(element);
        const transition = { ...options };
        /**
         * Resolve stagger function if provided.
         */
        if (typeof transition.delay === "function") {
            transition.delay = transition.delay(i, numElements);
        }
        animations.push(...animateTarget(visualElement, { ...keyframes, transition }, {}));
    }
    return new GroupPlaybackControls(animations);
}
const isSequence = (value) => Array.isArray(value) && Array.isArray(value[0]);
function animateSequence(sequence, options, scope) {
    const animations = [];
    const animationDefinitions = createAnimationsFromSequence(sequence, options, scope);
    animationDefinitions.forEach(({ keyframes, transition }, subject) => {
        let animation;
        if (isMotionValue(subject)) {
            animation = animateSingleValue(subject, keyframes.default, transition.default);
        }
        else {
            animation = animateElements(subject, keyframes, transition);
        }
        animations.push(animation);
    });
    return new GroupPlaybackControls(animations);
}
const createScopedAnimate = (scope) => {
    /**
     * Implementation
     */
    function scopedAnimate(valueOrElementOrSequence, keyframes, options) {
        let animation;
        if (isSequence(valueOrElementOrSequence)) {
            animation = animateSequence(valueOrElementOrSequence, keyframes, scope);
        }
        else if (isDOMKeyframes(keyframes)) {
            animation = animateElements(valueOrElementOrSequence, keyframes, options, scope);
        }
        else {
            animation = animateSingleValue(valueOrElementOrSequence, keyframes, options);
        }
        if (scope) {
            scope.animations.push(animation);
        }
        return animation;
    }
    return scopedAnimate;
};
const animate = createScopedAnimate();

export { animate, createScopedAnimate };
