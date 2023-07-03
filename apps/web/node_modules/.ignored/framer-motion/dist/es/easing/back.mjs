import { cubicBezier } from './cubic-bezier.mjs';
import { mirrorEasing } from './modifiers/mirror.mjs';
import { reverseEasing } from './modifiers/reverse.mjs';

const backOut = cubicBezier(0.33, 1.53, 0.69, 0.99);
const backIn = reverseEasing(backOut);
const backInOut = mirrorEasing(backIn);

export { backIn, backInOut, backOut };
