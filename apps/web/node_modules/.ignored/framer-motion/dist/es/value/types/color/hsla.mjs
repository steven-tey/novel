import { alpha } from '../numbers/index.mjs';
import { percent } from '../numbers/units.mjs';
import { sanitize } from '../utils.mjs';
import { isColorString, splitColor } from './utils.mjs';

const hsla = {
    test: isColorString("hsl", "hue"),
    parse: splitColor("hue", "saturation", "lightness"),
    transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
        return ("hsla(" +
            Math.round(hue) +
            ", " +
            percent.transform(sanitize(saturation)) +
            ", " +
            percent.transform(sanitize(lightness)) +
            ", " +
            sanitize(alpha.transform(alpha$1)) +
            ")");
    },
};

export { hsla };
