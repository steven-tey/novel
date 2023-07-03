import { invariant } from '../../../utils/errors.mjs';

function resolveElements(elements, scope, selectorCache) {
    var _a;
    if (typeof elements === "string") {
        let root = document;
        if (scope) {
            invariant(Boolean(scope.current), "Scope provided, but no element detected.");
            root = scope.current;
        }
        if (selectorCache) {
            (_a = selectorCache[elements]) !== null && _a !== void 0 ? _a : (selectorCache[elements] = root.querySelectorAll(elements));
            elements = selectorCache[elements];
        }
        else {
            elements = root.querySelectorAll(elements);
        }
    }
    else if (elements instanceof Element) {
        elements = [elements];
    }
    /**
     * Return an empty array
     */
    return Array.from(elements || []);
}

export { resolveElements };
