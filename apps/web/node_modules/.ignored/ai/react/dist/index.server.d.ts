import * as react_jsx_runtime from 'react/jsx-runtime';

type Props = {
    /**
     * A ReadableStream produced by the AI SDK.
     */
    stream: ReadableStream;
};
/**
 * A React Server Component that recursively renders a stream of tokens.
 * Can only be used inside of server components.
 */
declare function Tokens(props: Props): Promise<react_jsx_runtime.JSX.Element>;

export { Tokens };
