import type { ResolvedMetadata } from '../types/metadata-interface';
import React from 'react';
export declare function BasicMetadata({ metadata }: {
    metadata: ResolvedMetadata;
}): NonNullable<React.JSX.Element | (React.JSX.Element | null)[]>[];
export declare function ItunesMeta({ itunes }: {
    itunes: ResolvedMetadata['itunes'];
}): React.JSX.Element | null;
export declare function FormatDetectionMeta({ formatDetection, }: {
    formatDetection: ResolvedMetadata['formatDetection'];
}): React.JSX.Element | null;
export declare function AppleWebAppMeta({ appleWebApp, }: {
    appleWebApp: ResolvedMetadata['appleWebApp'];
}): NonNullable<React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.JSX.Element[]>[] | null;
export declare function VerificationMeta({ verification, }: {
    verification: ResolvedMetadata['verification'];
}): NonNullable<React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactElement<any, string | React.JSXElementConstructor<any>>[]>[][] | null;
