import { useConstant } from '../../utils/use-constant.mjs';
import { useUnmountEffect } from '../../utils/use-unmount-effect.mjs';
import { createScopedAnimate } from '../animate.mjs';

function useAnimate() {
    const scope = useConstant(() => ({
        current: null,
        animations: [],
    }));
    const animate = useConstant(() => createScopedAnimate(scope));
    useUnmountEffect(() => {
        scope.animations.forEach((animation) => animation.stop());
    });
    return [scope, animate];
}

export { useAnimate };
