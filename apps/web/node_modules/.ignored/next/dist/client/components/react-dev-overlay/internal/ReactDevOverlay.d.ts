import * as React from 'react';
import { OverlayState } from './error-overlay-reducer';
import { SupportedErrorEvent } from './container/Errors';
interface ReactDevOverlayState {
    reactError: SupportedErrorEvent | null;
}
declare class ReactDevOverlay extends React.PureComponent<{
    state: OverlayState;
    children: React.ReactNode;
    onReactError: (error: Error) => void;
}, ReactDevOverlayState> {
    state: {
        reactError: null;
    };
    static getDerivedStateFromError(error: Error): ReactDevOverlayState;
    componentDidCatch(componentErr: Error): void;
    render(): React.JSX.Element;
}
export default ReactDevOverlay;
