interface PageViewEvent {
    type: 'pageview';
    url: string;
}
interface CustomEvent {
    type: 'event';
    url: string;
}
declare type BeforeSendEvent = PageViewEvent | CustomEvent;
declare type Mode = 'auto' | 'development' | 'production';
declare type AllowedPropertyValues = string | number | boolean | null;
declare type BeforeSend = (event: BeforeSendEvent) => BeforeSendEvent | null;
interface AnalyticsProps {
    beforeSend?: BeforeSend;
    debug?: boolean;
    mode?: Mode;
}
declare global {
    interface Window {
        va?: (event: 'beforeSend' | 'event', properties?: unknown) => void;
        vaq?: [string, unknown?][];
        vai?: boolean;
        vam?: Mode;
    }
}

/**
 * Injects the Vercel Web Analytics script into the page head and starts tracking page views. Read more in our [documentation](https://vercel.com/docs/concepts/analytics/package).
 * @param [props] - Analytics options.
 * @param [props.mode] - The mode to use for the analytics script. Defaults to `auto`.
 *  - `auto` - Automatically detect the environment.  Uses `production` if the environment cannot be determined.
 *  - `production` - Always use the production script. (Sends events to the server)
 *  - `development` - Always use the development script. (Logs events to the console)
 * @param [props.debug] - Whether to enable debug logging in development. Defaults to `true`.
 * @param [props.beforeSend] - A middleware function to modify events before they are sent. Should return the event object or `null` to cancel the event.
 */
declare function inject(props?: AnalyticsProps): void;
/**
 * Tracks a custom event. Please refer to the [documentation](https://vercel.com/docs/concepts/analytics/custom-events) for more information on custom events.
 * @param name - The name of the event.
 * * Examples: `Purchase`, `Click Button`, or `Play Video`.
 * @param [properties] - Additional properties of the event. Nested objects are not supported. Allowed values are `string`, `number`, `boolean`, and `null`.
 */
declare function track(name: string, properties?: Record<string, AllowedPropertyValues>): void;
declare const _default: {
    inject: typeof inject;
    track: typeof track;
};

export { _default as default, inject, track };
