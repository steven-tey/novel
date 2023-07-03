/**
 * Polyfills `FormData` and `Blob` in the Node.js runtime.
 */ "use strict";
if (!global.FormData) {
    const { FormData  } = require("next/dist/compiled/@edge-runtime/ponyfill");
    global.FormData = FormData;
}
if (!global.Blob) {
    const { Blob  } = require("next/dist/compiled/@edge-runtime/ponyfill");
    global.Blob = Blob;
}

//# sourceMappingURL=node-polyfill-form.js.map