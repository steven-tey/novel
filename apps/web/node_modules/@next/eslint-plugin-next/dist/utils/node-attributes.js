"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var NodeAttributes = /*#__PURE__*/ function() {
    "use strict";
    function NodeAttributes(ASTnode) {
        var _this = this;
        _classCallCheck(this, NodeAttributes);
        this.attributes = {};
        ASTnode.attributes.forEach(function(attribute) {
            if (!attribute.type || attribute.type !== "JSXAttribute") {
                return;
            }
            if (!!attribute.value) {
                // hasValue
                var value = typeof attribute.value.value === "string" ? attribute.value.value : typeof attribute.value.expression.value !== "undefined" ? attribute.value.expression.value : attribute.value.expression.properties;
                _this.attributes[attribute.name.name] = {
                    hasValue: true,
                    value: value
                };
            } else {
                _this.attributes[attribute.name.name] = {
                    hasValue: false
                };
            }
        });
    }
    var _proto = NodeAttributes.prototype;
    _proto.hasAny = function hasAny() {
        return !!Object.keys(this.attributes).length;
    };
    _proto.has = function has(attrName) {
        return !!this.attributes[attrName];
    };
    _proto.hasValue = function hasValue(attrName) {
        return !!this.attributes[attrName].hasValue;
    };
    _proto.value = function value(attrName) {
        var attr = this.attributes[attrName];
        if (!attr) {
            return true;
        }
        if (attr.hasValue) {
            return attr.value;
        }
        return undefined;
    };
    return NodeAttributes;
}();
exports.default = NodeAttributes;
