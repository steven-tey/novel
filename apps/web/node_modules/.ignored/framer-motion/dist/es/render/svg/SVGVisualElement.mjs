import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.mjs';
import { DOMVisualElement } from '../dom/DOMVisualElement.mjs';
import { buildSVGAttrs } from './utils/build-attrs.mjs';
import { camelToDash } from '../dom/utils/camel-to-dash.mjs';
import { camelCaseAttributes } from './utils/camel-case-attrs.mjs';
import { transformProps } from '../html/utils/transform.mjs';
import { renderSVG } from './utils/render.mjs';
import { getDefaultValueType } from '../dom/value-types/defaults.mjs';
import { createBox } from '../../projection/geometry/models.mjs';
import { isSVGTag } from './utils/is-svg-tag.mjs';

class SVGVisualElement extends DOMVisualElement {
    constructor() {
        super(...arguments);
        this.isSVGTag = false;
    }
    getBaseTargetFromProps(props, key) {
        return props[key];
    }
    readValueFromInstance(instance, key) {
        if (transformProps.has(key)) {
            const defaultType = getDefaultValueType(key);
            return defaultType ? defaultType.default || 0 : 0;
        }
        key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
        return instance.getAttribute(key);
    }
    measureInstanceViewportBox() {
        return createBox();
    }
    scrapeMotionValuesFromProps(props, prevProps) {
        return scrapeMotionValuesFromProps(props, prevProps);
    }
    build(renderState, latestValues, options, props) {
        buildSVGAttrs(renderState, latestValues, options, this.isSVGTag, props.transformTemplate);
    }
    renderInstance(instance, renderState, styleProp, projection) {
        renderSVG(instance, renderState, styleProp, projection);
    }
    mount(instance) {
        this.isSVGTag = isSVGTag(instance.tagName);
        super.mount(instance);
    }
}

export { SVGVisualElement };
