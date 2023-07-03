import { invariant } from '../../utils/errors.mjs';
import { setValues } from '../../render/utils/setters.mjs';
import { animateVisualElement } from '../interfaces/visual-element.mjs';

function stopAnimation(visualElement) {
    visualElement.values.forEach((value) => value.stop());
}
/**
 * @public
 */
function animationControls() {
    /**
     * Track whether the host component has mounted.
     */
    let hasMounted = false;
    /**
     * A collection of linked component animation controls.
     */
    const subscribers = new Set();
    const controls = {
        subscribe(visualElement) {
            subscribers.add(visualElement);
            return () => void subscribers.delete(visualElement);
        },
        start(definition, transitionOverride) {
            invariant(hasMounted, "controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook.");
            const animations = [];
            subscribers.forEach((visualElement) => {
                animations.push(animateVisualElement(visualElement, definition, {
                    transitionOverride,
                }));
            });
            return Promise.all(animations);
        },
        set(definition) {
            invariant(hasMounted, "controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook.");
            return subscribers.forEach((visualElement) => {
                setValues(visualElement, definition);
            });
        },
        stop() {
            subscribers.forEach((visualElement) => {
                stopAnimation(visualElement);
            });
        },
        mount() {
            hasMounted = true;
            return () => {
                hasMounted = false;
                controls.stop();
            };
        },
    };
    return controls;
}

export { animationControls };
