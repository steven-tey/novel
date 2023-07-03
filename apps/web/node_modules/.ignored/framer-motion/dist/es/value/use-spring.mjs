import { useContext, useRef, useInsertionEffect } from 'react';
import { isMotionValue } from './utils/is-motion-value.mjs';
import { useMotionValue } from './use-motion-value.mjs';
import { MotionConfigContext } from '../context/MotionConfigContext.mjs';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-effect.mjs';
import { animateValue } from '../animation/animators/js/index.mjs';
import { frameData } from '../frameloop/data.mjs';
import { millisecondsToSeconds } from '../utils/time-conversion.mjs';

/**
 * Creates a `MotionValue` that, when `set`, will use a spring animation to animate to its new state.
 *
 * It can either work as a stand-alone `MotionValue` by initialising it with a value, or as a subscriber
 * to another `MotionValue`.
 *
 * @remarks
 *
 * ```jsx
 * const x = useSpring(0, { stiffness: 300 })
 * const y = useSpring(x, { damping: 10 })
 * ```
 *
 * @param inputValue - `MotionValue` or number. If provided a `MotionValue`, when the input `MotionValue` changes, the created `MotionValue` will spring towards that value.
 * @param springConfig - Configuration options for the spring.
 * @returns `MotionValue`
 *
 * @public
 */
function useSpring(source, config = {}) {
    const { isStatic } = useContext(MotionConfigContext);
    const activeSpringAnimation = useRef(null);
    const value = useMotionValue(isMotionValue(source) ? source.get() : source);
    const stopAnimation = () => {
        if (activeSpringAnimation.current) {
            activeSpringAnimation.current.stop();
        }
    };
    useInsertionEffect(() => {
        return value.attach((v, set) => {
            /**
             * A more hollistic approach to this might be to use isStatic to fix VisualElement animations
             * at that level, but this will work for now
             */
            if (isStatic)
                return set(v);
            stopAnimation();
            activeSpringAnimation.current = animateValue({
                keyframes: [value.get(), v],
                velocity: value.getVelocity(),
                type: "spring",
                restDelta: 0.001,
                restSpeed: 0.01,
                ...config,
                onUpdate: set,
            });
            /**
             * If we're between frames, resync the animation to the frameloop.
             */
            if (!frameData.isProcessing) {
                const delta = performance.now() - frameData.timestamp;
                if (delta < 30) {
                    activeSpringAnimation.current.time =
                        millisecondsToSeconds(delta);
                }
            }
            return value.get();
        }, stopAnimation);
    }, [JSON.stringify(config)]);
    useIsomorphicLayoutEffect(() => {
        if (isMotionValue(source)) {
            return source.on("change", (v) => value.set(parseFloat(v)));
        }
    }, [value]);
    return value;
}

export { useSpring };
