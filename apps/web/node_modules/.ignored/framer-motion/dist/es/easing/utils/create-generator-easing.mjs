import { spring } from '../../animation/generators/spring/index.mjs';
import { calcGeneratorDuration, maxGeneratorDuration } from '../../animation/generators/utils/calc-duration.mjs';
import { millisecondsToSeconds } from '../../utils/time-conversion.mjs';

/**
 * Create a progress => progress easing function from a generator.
 */
function createGeneratorEasing(options, scale = 100) {
    const generator = spring({ keyframes: [0, scale], ...options });
    const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
    return {
        type: "keyframes",
        ease: (progress) => generator.next(duration * progress).value / scale,
        duration: millisecondsToSeconds(duration),
    };
}

export { createGeneratorEasing };
