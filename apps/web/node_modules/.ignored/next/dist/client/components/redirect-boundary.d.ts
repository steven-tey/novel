/// <reference types="react/experimental" />
import React from 'react';
import { AppRouterInstance } from '../../shared/lib/app-router-context';
import { RedirectType } from './redirect';
interface RedirectBoundaryProps {
    router: AppRouterInstance;
    children: React.ReactNode;
}
export declare class RedirectErrorBoundary extends React.Component<RedirectBoundaryProps, {
    redirect: string | null;
    redirectType: RedirectType | null;
}> {
    constructor(props: RedirectBoundaryProps);
    static getDerivedStateFromError(error: any): {
        redirect: string;
        redirectType: RedirectType;
    };
    render(): string | number | boolean | React.ReactFragment | React.PromiseLikeOfReactNode | React.JSX.Element | null | undefined;
}
export declare function RedirectBoundary({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export {};
