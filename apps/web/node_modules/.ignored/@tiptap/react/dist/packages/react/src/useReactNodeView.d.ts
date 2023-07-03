/// <reference types="react" />
export interface ReactNodeViewContextProps {
    onDragStart: (event: DragEvent) => void;
    nodeViewContentRef: (element: HTMLElement | null) => void;
}
export declare const ReactNodeViewContext: import("react").Context<Partial<ReactNodeViewContextProps>>;
export declare const useReactNodeView: () => Partial<ReactNodeViewContextProps>;
