import { cubicBezier } from './cubic-bezier.mjs';

const easeIn = cubicBezier(0.42, 0, 1, 1);
const easeOut = cubicBezier(0, 0, 0.58, 1);
const easeInOut = cubicBezier(0.42, 0, 0.58, 1);

export { easeIn, easeInOut, easeOut };
