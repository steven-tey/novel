import { animateValue } from './js/index.mjs';
import { noop } from '../../utils/noop.mjs';

function createInstantAnimation({ keyframes, delay, onUpdate, onComplete, }) {
    const setValue = () => {
        onUpdate && onUpdate(keyframes[keyframes.length - 1]);
        onComplete && onComplete();
        /**
         * TODO: As this API grows it could make sense to always return
         * animateValue. This will be a bigger project as animateValue
         * is frame-locked whereas this function resolves instantly.
         * This is a behavioural change and also has ramifications regarding
         * assumptions within tests.
         */
        return {
            time: 0,
            speed: 1,
            duration: 0,
            play: (noop),
            pause: (noop),
            stop: (noop),
            then: (resolve) => {
                resolve();
                return Promise.resolve();
            },
            cancel: (noop),
            complete: (noop),
        };
    };
    return delay
        ? animateValue({
            keyframes: [0, 1],
            duration: 0,
            delay,
            onComplete: setValue,
        })
        : setValue();
}

export { createInstantAnimation };
