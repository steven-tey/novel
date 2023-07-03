import { isCSSVariableName } from '../../render/dom/utils/is-css-variable.mjs';
import { transformProps } from '../../render/html/utils/transform.mjs';
import { addUniqueItem, removeItem } from '../../utils/array.mjs';
import { useConstant } from '../../utils/use-constant.mjs';
import { MotionValue } from '../index.mjs';
import { camelToDash } from '../../render/dom/utils/camel-to-dash.mjs';

class WillChangeMotionValue extends MotionValue {
    constructor() {
        super(...arguments);
        this.members = [];
        this.transforms = new Set();
    }
    add(name) {
        let memberName;
        if (transformProps.has(name)) {
            this.transforms.add(name);
            memberName = "transform";
        }
        else if (!name.startsWith("origin") &&
            !isCSSVariableName(name) &&
            name !== "willChange") {
            memberName = camelToDash(name);
        }
        if (memberName) {
            addUniqueItem(this.members, memberName);
            this.update();
        }
    }
    remove(name) {
        if (transformProps.has(name)) {
            this.transforms.delete(name);
            if (!this.transforms.size) {
                removeItem(this.members, "transform");
            }
        }
        else {
            removeItem(this.members, camelToDash(name));
        }
        this.update();
    }
    update() {
        this.set(this.members.length ? this.members.join(", ") : "auto");
    }
}
function useWillChange() {
    return useConstant(() => new WillChangeMotionValue("auto"));
}

export { WillChangeMotionValue, useWillChange };
