import { appearStoreId } from './store-id.mjs';
import { animateStyle } from '../animators/waapi/index.mjs';
import { optimizedAppearDataId } from './data-id.mjs';
import { handoffOptimizedAppearAnimation } from './handoff.mjs';
import { appearAnimationStore } from './store.mjs';
import { noop } from '../../utils/noop.mjs';

function startOptimizedAppearAnimation(element, name, keyframes, options, onReady) {
    const id = element.dataset[optimizedAppearDataId];
    if (!id)
        return;
    window.HandoffAppearAnimations = handoffOptimizedAppearAnimation;
    const storeId = appearStoreId(id, name);
    /**
     * Use a dummy animation to detect when Chrome is ready to start
     * painting the page and hold off from triggering the real animation
     * until then.
     *
     * https://bugs.chromium.org/p/chromium/issues/detail?id=1406850
     */
    const readyAnimation = animateStyle(element, name, [keyframes[0], keyframes[0]], 
    /**
     * 10 secs is basically just a super-safe duration to give Chrome
     * long enough to get the animation ready.
     */
    { duration: 10000, ease: "linear" });
    appearAnimationStore.set(storeId, {
        animation: readyAnimation,
        startTime: null,
    });
    const startAnimation = () => {
        readyAnimation.cancel();
        const appearAnimation = animateStyle(element, name, keyframes, options);
        if (document.timeline) {
            appearAnimation.startTime = document.timeline.currentTime;
        }
        appearAnimationStore.set(storeId, {
            animation: appearAnimation,
            startTime: performance.now(),
        });
        if (onReady)
            onReady(appearAnimation);
    };
    if (readyAnimation.ready) {
        readyAnimation.ready.then(startAnimation).catch(noop);
    }
    else {
        startAnimation();
    }
}

export { startOptimizedAppearAnimation };
