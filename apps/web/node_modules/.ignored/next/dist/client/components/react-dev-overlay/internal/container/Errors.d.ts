import * as React from 'react';
import { UnhandledErrorAction, UnhandledRejectionAction } from '../error-overlay-reducer';
import type { VersionInfo } from '../../../../../server/dev/parse-version-info';
export type SupportedErrorEvent = {
    id: number;
    event: UnhandledErrorAction | UnhandledRejectionAction;
};
export type ErrorsProps = {
    errors: SupportedErrorEvent[];
    initialDisplayState: DisplayState;
    versionInfo?: VersionInfo;
};
type DisplayState = 'minimized' | 'fullscreen' | 'hidden';
export declare const Errors: React.FC<ErrorsProps>;
export declare const styles: string;
export {};
