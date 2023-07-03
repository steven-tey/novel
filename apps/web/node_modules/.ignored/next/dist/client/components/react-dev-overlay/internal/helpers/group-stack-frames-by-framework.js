"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "groupStackFramesByFramework", {
    enumerable: true,
    get: function() {
        return groupStackFramesByFramework;
    }
});
/**
 * Get the origin framework of the stack frame by package name.
 */ function getFramework(sourcePackage) {
    if (!sourcePackage) return undefined;
    if (/^(react|react-dom|react-is|react-refresh|react-server-dom-webpack|scheduler)$/.test(sourcePackage)) {
        return "react";
    } else if (sourcePackage === "next") {
        return "next";
    }
    return undefined;
}
function groupStackFramesByFramework(stackFrames) {
    const stackFramesGroupedByFramework = [];
    for (const stackFrame of stackFrames){
        const currentGroup = stackFramesGroupedByFramework[stackFramesGroupedByFramework.length - 1];
        const framework = getFramework(stackFrame.sourcePackage);
        if (currentGroup && currentGroup.framework === framework) {
            currentGroup.stackFrames.push(stackFrame);
        } else {
            stackFramesGroupedByFramework.push({
                framework: framework,
                stackFrames: [
                    stackFrame
                ]
            });
        }
    }
    return stackFramesGroupedByFramework;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=group-stack-frames-by-framework.js.map