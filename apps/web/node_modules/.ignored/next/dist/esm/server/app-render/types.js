import zod from "zod";
const dynamicParamTypesSchema = zod.enum([
    "c",
    "oc",
    "d"
]);
const segmentSchema = zod.union([
    zod.string(),
    zod.tuple([
        zod.string(),
        zod.string(),
        dynamicParamTypesSchema
    ])
]);
export const flightRouterStateSchema = zod.lazy(()=>{
    const parallelRoutesSchema = zod.record(flightRouterStateSchema);
    const urlSchema = zod.string().nullable().optional();
    const refreshSchema = zod.literal("refetch").nullable().optional();
    const isRootLayoutSchema = zod.boolean().optional();
    // Due to the lack of optional tuple types in Zod, we need to use union here.
    // https://github.com/colinhacks/zod/issues/1465
    return zod.union([
        zod.tuple([
            segmentSchema,
            parallelRoutesSchema,
            urlSchema,
            refreshSchema,
            isRootLayoutSchema
        ]),
        zod.tuple([
            segmentSchema,
            parallelRoutesSchema,
            urlSchema,
            refreshSchema
        ]),
        zod.tuple([
            segmentSchema,
            parallelRoutesSchema,
            urlSchema
        ]),
        zod.tuple([
            segmentSchema,
            parallelRoutesSchema
        ])
    ]);
});

//# sourceMappingURL=types.js.map