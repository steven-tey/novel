import { AbsoluteFilenameNormalizer } from "../../absolute-filename-normalizer";
/**
 * DevAppPageNormalizer is a normalizer that is used to normalize a pathname
 * to a page in the `app` directory.
 */ export class DevAppPageNormalizer extends AbsoluteFilenameNormalizer {
    constructor(appDir, extensions){
        super(appDir, extensions, "app");
    }
}

//# sourceMappingURL=app-page-normalizer.js.map