import { createMotionProxy } from './motion-proxy.mjs';
import { createDomMotionConfig } from './utils/create-config.mjs';

/**
 * @public
 */
const m = createMotionProxy(createDomMotionConfig);

export { m };
