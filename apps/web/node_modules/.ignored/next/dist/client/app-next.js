"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _appbootstrap = require("./app-bootstrap");
(0, _appbootstrap.appBootstrap)(()=>{
    // Include app-router and layout-router in the main chunk
    require("next/dist/client/components/app-router");
    require("next/dist/client/components/layout-router");
    const { hydrate  } = require("./app-index");
    hydrate();
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=app-next.js.map