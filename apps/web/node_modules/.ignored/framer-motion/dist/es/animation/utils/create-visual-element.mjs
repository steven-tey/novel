import { isSVGElement } from '../../render/dom/utils/is-svg-element.mjs';
import { SVGVisualElement } from '../../render/svg/SVGVisualElement.mjs';
import { HTMLVisualElement } from '../../render/html/HTMLVisualElement.mjs';
import { visualElementStore } from '../../render/store.mjs';

function createVisualElement(element) {
    const options = {
        presenceContext: null,
        props: {},
        visualState: {
            renderState: {
                transform: {},
                transformOrigin: {},
                style: {},
                vars: {},
                attrs: {},
            },
            latestValues: {},
        },
    };
    const node = isSVGElement(element)
        ? new SVGVisualElement(options, {
            enableHardwareAcceleration: false,
        })
        : new HTMLVisualElement(options, {
            enableHardwareAcceleration: true,
        });
    node.mount(element);
    visualElementStore.set(element, node);
}

export { createVisualElement };
