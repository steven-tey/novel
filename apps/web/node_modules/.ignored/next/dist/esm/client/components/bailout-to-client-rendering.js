import { suspense } from "../../shared/lib/lazy-dynamic/dynamic-no-ssr";
import { staticGenerationAsyncStorage } from "./static-generation-async-storage";
export function bailoutToClientRendering() {
    const staticGenerationStore = staticGenerationAsyncStorage.getStore();
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.forceStatic) {
        return true;
    }
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.isStaticGeneration) {
        suspense();
    }
    return false;
}

//# sourceMappingURL=bailout-to-client-rendering.js.map