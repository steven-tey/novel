"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "flightRouterStateSchema", {
    enumerable: true,
    get: function() {
        return flightRouterStateSchema;
    }
});
const _zod = /*#__PURE__*/ _interop_require_default(require("zod"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const dynamicParamTypesSchema = _zod.default.enum([
    "c",
    "oc",
    "d"
]);
const segmentSchema = _zod.default.union([
    _zod.default.string(),
    _zod.default.tuple([
        _zod.default.string(),
        _zod.default.string(),
        dynamicParamTypesSchema
    ])
]);
const flightRouterStateSchema = _zod.default.lazy(()=>{
    const parallelRoutesSchema = _zod.default.record(flightRouterStateSchema);
    const urlSchema = _zod.default.string().nullable().optional();
    const refreshSchema = _zod.default.literal("refetch").nullable().optional();
    const isRootLayoutSchema = _zod.default.boolean().optional();
    // Due to the lack of optional tuple types in Zod, we need to use union here.
    // https://github.com/colinhacks/zod/issues/1465
    return _zod.default.union([
        _zod.default.tuple([
            segmentSchema,
            parallelRoutesSchema,
            urlSchema,
            refreshSchema,
            isRootLayoutSchema
        ]),
        _zod.default.tuple([
            segmentSchema,
            parallelRoutesSchema,
            urlSchema,
            refreshSchema
        ]),
        _zod.default.tuple([
            segmentSchema,
            parallelRoutesSchema,
            urlSchema
        ]),
        _zod.default.tuple([
            segmentSchema,
            parallelRoutesSchema
        ])
    ]);
});

//# sourceMappingURL=types.js.map