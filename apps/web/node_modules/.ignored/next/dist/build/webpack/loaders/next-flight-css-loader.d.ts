/**
 * For server-side CSS imports, we need to ignore the actual module content but
 * still trigger the hot-reloading diff mechanism. So here we put the content
 * inside a comment.
 */
export declare function pitch(this: any): void;
declare const NextServerCSSLoader: (this: any, content: string) => string;
export default NextServerCSSLoader;
