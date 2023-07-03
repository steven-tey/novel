import { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu';
import React from 'react';
declare type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export declare type FloatingMenuProps = Omit<Optional<FloatingMenuPluginProps, 'pluginKey'>, 'element'> & {
    className?: string;
    children: React.ReactNode;
};
export declare const FloatingMenu: (props: FloatingMenuProps) => JSX.Element;
export {};
