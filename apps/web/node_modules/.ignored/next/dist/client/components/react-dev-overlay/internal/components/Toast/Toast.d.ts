import * as React from 'react';
export type ToastProps = {
    children?: React.ReactNode;
    onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    className?: string;
};
export declare const Toast: React.FC<ToastProps>;
