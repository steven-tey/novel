import { isMotionValue } from '../../../value/utils/is-motion-value.mjs';
import { scrapeMotionValuesFromProps as scrapeMotionValuesFromProps$1 } from '../../html/utils/scrape-motion-values.mjs';
import { transformPropOrder } from '../../html/utils/transform.mjs';

function scrapeMotionValuesFromProps(props, prevProps) {
    const newValues = scrapeMotionValuesFromProps$1(props, prevProps);
    for (const key in props) {
        if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
            const targetKey = transformPropOrder.indexOf(key) !== -1
                ? "attr" + key.charAt(0).toUpperCase() + key.substring(1)
                : key;
            newValues[targetKey] = props[key];
        }
    }
    return newValues;
}

export { scrapeMotionValuesFromProps };
