declare type EasingFunction = (v: number) => number;
declare type EasingModifier = (easing: EasingFunction) => EasingFunction;
declare type BezierDefinition = [number, number, number, number];
declare type EasingDefinition = BezierDefinition | "linear" | "easeIn" | "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate";
/**
 * The easing function to use. Set as one of:
 *
 * - The name of an in-built easing function.
 * - An array of four numbers to define a cubic bezier curve.
 * - An easing function, that accepts and returns a progress value between `0` and `1`.
 *
 * @public
 */
declare type Easing = EasingDefinition | EasingFunction;

interface Point {
    x: number;
    y: number;
}

declare type FrameData = {
    delta: number;
    timestamp: number;
};
declare type Process = (data: FrameData) => void;
declare type Schedule = (process: Process, keepAlive?: boolean, immediate?: boolean) => Process;
interface Step {
    schedule: Schedule;
    cancel: (process: Process) => void;
    process: (frame: FrameData) => void;
}
declare type StepId = "read" | "update" | "preRender" | "render" | "postRender";
declare type Frameloop = {
    [key in StepId]: Schedule;
};
declare type Steps = {
    [key in StepId]: Step;
};

/**
 * @public
 */
interface SVGPathProperties {
    pathLength?: number;
    pathOffset?: number;
    pathSpacing?: number;
}

declare type GenericKeyframesTarget<V> = [null, ...V[]] | V[];

/**
 * An update function. It accepts a timestamp used to advance the animation.
 */
declare type Update = (timestamp: number) => void;
/**
 * Drivers accept a update function and call it at an interval. This interval
 * could be a synchronous loop, a setInterval, or tied to the device's framerate.
 */
interface DriverControls {
    start: () => void;
    stop: () => void;
    now: () => number;
}
declare type Driver = (update: Update) => DriverControls;

interface SVGAttributes {
    accentHeight?: number | string | undefined;
    accumulate?: "none" | "sum" | undefined;
    additive?: "replace" | "sum" | undefined;
    alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" | "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit" | undefined;
    allowReorder?: "no" | "yes" | undefined;
    alphabetic?: number | string | undefined;
    amplitude?: number | string | undefined;
    arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
    ascent?: number | string | undefined;
    attributeName?: string | undefined;
    attributeType?: string | undefined;
    autoReverse?: boolean | undefined;
    azimuth?: number | string | undefined;
    baseFrequency?: number | string | undefined;
    baselineShift?: number | string | undefined;
    baseProfile?: number | string | undefined;
    bbox?: number | string | undefined;
    begin?: number | string | undefined;
    bias?: number | string | undefined;
    by?: number | string | undefined;
    calcMode?: number | string | undefined;
    capHeight?: number | string | undefined;
    clip?: number | string | undefined;
    clipPath?: string | undefined;
    clipPathUnits?: number | string | undefined;
    clipRule?: number | string | undefined;
    colorInterpolation?: number | string | undefined;
    colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit" | undefined;
    colorProfile?: number | string | undefined;
    colorRendering?: number | string | undefined;
    contentScriptType?: number | string | undefined;
    contentStyleType?: number | string | undefined;
    cursor?: number | string | undefined;
    cx?: number | string | undefined;
    cy?: number | string | undefined;
    d?: string | undefined;
    decelerate?: number | string | undefined;
    descent?: number | string | undefined;
    diffuseConstant?: number | string | undefined;
    direction?: number | string | undefined;
    display?: number | string | undefined;
    divisor?: number | string | undefined;
    dominantBaseline?: number | string | undefined;
    dur?: number | string | undefined;
    dx?: number | string | undefined;
    dy?: number | string | undefined;
    edgeMode?: number | string | undefined;
    elevation?: number | string | undefined;
    enableBackground?: number | string | undefined;
    end?: number | string | undefined;
    exponent?: number | string | undefined;
    externalResourcesRequired?: boolean | undefined;
    fill?: string | undefined;
    fillOpacity?: number | string | undefined;
    fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
    filter?: string | undefined;
    filterRes?: number | string | undefined;
    filterUnits?: number | string | undefined;
    floodColor?: number | string | undefined;
    floodOpacity?: number | string | undefined;
    focusable?: boolean | "auto" | undefined;
    fontFamily?: string | undefined;
    fontSize?: number | string | undefined;
    fontSizeAdjust?: number | string | undefined;
    fontStretch?: number | string | undefined;
    fontStyle?: number | string | undefined;
    fontVariant?: number | string | undefined;
    fontWeight?: number | string | undefined;
    format?: number | string | undefined;
    fr?: number | string | undefined;
    from?: number | string | undefined;
    fx?: number | string | undefined;
    fy?: number | string | undefined;
    g1?: number | string | undefined;
    g2?: number | string | undefined;
    glyphName?: number | string | undefined;
    glyphOrientationHorizontal?: number | string | undefined;
    glyphOrientationVertical?: number | string | undefined;
    glyphRef?: number | string | undefined;
    gradientTransform?: string | undefined;
    gradientUnits?: string | undefined;
    hanging?: number | string | undefined;
    horizAdvX?: number | string | undefined;
    horizOriginX?: number | string | undefined;
    href?: string | undefined;
    ideographic?: number | string | undefined;
    imageRendering?: number | string | undefined;
    in2?: number | string | undefined;
    in?: string | undefined;
    intercept?: number | string | undefined;
    k1?: number | string | undefined;
    k2?: number | string | undefined;
    k3?: number | string | undefined;
    k4?: number | string | undefined;
    k?: number | string | undefined;
    kernelMatrix?: number | string | undefined;
    kernelUnitLength?: number | string | undefined;
    kerning?: number | string | undefined;
    keyPoints?: number | string | undefined;
    keySplines?: number | string | undefined;
    keyTimes?: number | string | undefined;
    lengthAdjust?: number | string | undefined;
    letterSpacing?: number | string | undefined;
    lightingColor?: number | string | undefined;
    limitingConeAngle?: number | string | undefined;
    local?: number | string | undefined;
    markerEnd?: string | undefined;
    markerHeight?: number | string | undefined;
    markerMid?: string | undefined;
    markerStart?: string | undefined;
    markerUnits?: number | string | undefined;
    markerWidth?: number | string | undefined;
    mask?: string | undefined;
    maskContentUnits?: number | string | undefined;
    maskUnits?: number | string | undefined;
    mathematical?: number | string | undefined;
    mode?: number | string | undefined;
    numOctaves?: number | string | undefined;
    offset?: number | string | undefined;
    opacity?: number | string | undefined;
    operator?: number | string | undefined;
    order?: number | string | undefined;
    orient?: number | string | undefined;
    orientation?: number | string | undefined;
    origin?: number | string | undefined;
    overflow?: number | string | undefined;
    overlinePosition?: number | string | undefined;
    overlineThickness?: number | string | undefined;
    paintOrder?: number | string | undefined;
    panose1?: number | string | undefined;
    path?: string | undefined;
    pathLength?: number | string | undefined;
    patternContentUnits?: string | undefined;
    patternTransform?: number | string | undefined;
    patternUnits?: string | undefined;
    pointerEvents?: number | string | undefined;
    points?: string | undefined;
    pointsAtX?: number | string | undefined;
    pointsAtY?: number | string | undefined;
    pointsAtZ?: number | string | undefined;
    preserveAlpha?: boolean | undefined;
    preserveAspectRatio?: string | undefined;
    primitiveUnits?: number | string | undefined;
    r?: number | string | undefined;
    radius?: number | string | undefined;
    refX?: number | string | undefined;
    refY?: number | string | undefined;
    renderingIntent?: number | string | undefined;
    repeatCount?: number | string | undefined;
    repeatDur?: number | string | undefined;
    requiredExtensions?: number | string | undefined;
    requiredFeatures?: number | string | undefined;
    restart?: number | string | undefined;
    result?: string | undefined;
    rotate?: number | string | undefined;
    rx?: number | string | undefined;
    ry?: number | string | undefined;
    scale?: number | string | undefined;
    seed?: number | string | undefined;
    shapeRendering?: number | string | undefined;
    slope?: number | string | undefined;
    spacing?: number | string | undefined;
    specularConstant?: number | string | undefined;
    specularExponent?: number | string | undefined;
    speed?: number | string | undefined;
    spreadMethod?: string | undefined;
    startOffset?: number | string | undefined;
    stdDeviation?: number | string | undefined;
    stemh?: number | string | undefined;
    stemv?: number | string | undefined;
    stitchTiles?: number | string | undefined;
    stopColor?: string | undefined;
    stopOpacity?: number | string | undefined;
    strikethroughPosition?: number | string | undefined;
    strikethroughThickness?: number | string | undefined;
    string?: number | string | undefined;
    stroke?: string | undefined;
    strokeDasharray?: string | number | undefined;
    strokeDashoffset?: string | number | undefined;
    strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
    strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
    strokeMiterlimit?: number | string | undefined;
    strokeOpacity?: number | string | undefined;
    strokeWidth?: number | string | undefined;
    surfaceScale?: number | string | undefined;
    systemLanguage?: number | string | undefined;
    tableValues?: number | string | undefined;
    targetX?: number | string | undefined;
    targetY?: number | string | undefined;
    textAnchor?: string | undefined;
    textDecoration?: number | string | undefined;
    textLength?: number | string | undefined;
    textRendering?: number | string | undefined;
    to?: number | string | undefined;
    transform?: string | undefined;
    u1?: number | string | undefined;
    u2?: number | string | undefined;
    underlinePosition?: number | string | undefined;
    underlineThickness?: number | string | undefined;
    unicode?: number | string | undefined;
    unicodeBidi?: number | string | undefined;
    unicodeRange?: number | string | undefined;
    unitsPerEm?: number | string | undefined;
    vAlphabetic?: number | string | undefined;
    values?: string | undefined;
    vectorEffect?: number | string | undefined;
    version?: string | undefined;
    vertAdvY?: number | string | undefined;
    vertOriginX?: number | string | undefined;
    vertOriginY?: number | string | undefined;
    vHanging?: number | string | undefined;
    vIdeographic?: number | string | undefined;
    viewBox?: string | undefined;
    viewTarget?: number | string | undefined;
    visibility?: number | string | undefined;
    vMathematical?: number | string | undefined;
    widths?: number | string | undefined;
    wordSpacing?: number | string | undefined;
    writingMode?: number | string | undefined;
    x1?: number | string | undefined;
    x2?: number | string | undefined;
    x?: number | string | undefined;
    xChannelSelector?: string | undefined;
    xHeight?: number | string | undefined;
    xlinkActuate?: string | undefined;
    xlinkArcrole?: string | undefined;
    xlinkHref?: string | undefined;
    xlinkRole?: string | undefined;
    xlinkShow?: string | undefined;
    xlinkTitle?: string | undefined;
    xlinkType?: string | undefined;
    xmlBase?: string | undefined;
    xmlLang?: string | undefined;
    xmlns?: string | undefined;
    xmlnsXlink?: string | undefined;
    xmlSpace?: string | undefined;
    y1?: number | string | undefined;
    y2?: number | string | undefined;
    y?: number | string | undefined;
    yChannelSelector?: string | undefined;
    z?: number | string | undefined;
    zoomAndPan?: string | undefined;
}

interface AnimationPlaybackLifecycles<V> {
    onUpdate?: (latest: V) => void;
    onPlay?: () => void;
    onComplete?: () => void;
    onRepeat?: () => void;
    onStop?: () => void;
}
interface Transition extends AnimationPlaybackOptions, Omit<SpringOptions, "keyframes">, Omit<InertiaOptions, "keyframes">, KeyframeOptions {
    delay?: number;
    elapsed?: number;
    driver?: Driver;
    type?: "decay" | "spring" | "keyframes" | "tween" | "inertia";
    duration?: number;
    autoplay?: boolean;
}
interface ValueAnimationTransition<V = any> extends Transition, AnimationPlaybackLifecycles<V> {
}
interface AnimationScope<T = any> {
    readonly current: T;
    animations: AnimationPlaybackControls[];
}
declare type StyleTransitions = {
    [K in keyof CSSStyleDeclarationWithTransform]?: Transition;
};
declare type SVGPathTransitions = {
    [K in keyof SVGPathProperties]: Transition;
};
declare type SVGTransitions = {
    [K in keyof SVGAttributes]: Transition;
};
declare type VariableTransitions = {
    [key: `--${string}`]: Transition;
};
declare type AnimationOptionsWithValueOverrides<V = any> = StyleTransitions & SVGPathTransitions & SVGTransitions & VariableTransitions & ValueAnimationTransition<V>;
declare type ElementOrSelector = Element | Element[] | NodeListOf<Element> | string;
/**
 * @public
 */
interface AnimationPlaybackControls {
    time: number;
    speed: number;
    duration: number;
    stop: () => void;
    play: () => void;
    pause: () => void;
    complete: () => void;
    cancel: () => void;
    then: (onResolve: VoidFunction, onReject?: VoidFunction) => Promise<void>;
}
declare type DynamicOption<T> = (i: number, total: number) => T;
interface CSSStyleDeclarationWithTransform extends Omit<CSSStyleDeclaration, "direction" | "transition"> {
    x: number | string;
    y: number | string;
    z: number | string;
    rotateX: number | string;
    rotateY: number | string;
    rotateZ: number | string;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    skewX: number | string;
    skewY: number | string;
}
declare type ValueKeyframe = string | number;
declare type UnresolvedValueKeyframe = ValueKeyframe | null;
declare type ValueKeyframesDefinition = ValueKeyframe | ValueKeyframe[] | UnresolvedValueKeyframe[];
declare type StyleKeyframesDefinition = {
    [K in keyof CSSStyleDeclarationWithTransform]?: ValueKeyframesDefinition;
};
declare type SVGKeyframesDefinition = {
    [K in keyof SVGAttributes]?: ValueKeyframesDefinition;
};
declare type VariableKeyframesDefinition = {
    [key: `--${string}`]: ValueKeyframesDefinition;
};
declare type SVGPathKeyframesDefinition = {
    [K in keyof SVGPathProperties]?: ValueKeyframesDefinition;
};
declare type DOMKeyframesDefinition = StyleKeyframesDefinition & SVGKeyframesDefinition & SVGPathKeyframesDefinition & VariableKeyframesDefinition;
interface VelocityOptions {
    velocity?: number;
    restSpeed?: number;
    restDelta?: number;
}
interface AnimationPlaybackOptions {
    repeat?: number;
    repeatType?: "loop" | "reverse" | "mirror";
    repeatDelay?: number;
}
interface DurationSpringOptions {
    duration?: number;
    bounce?: number;
}
interface SpringOptions extends DurationSpringOptions, VelocityOptions {
    stiffness?: number;
    damping?: number;
    mass?: number;
}
interface DecayOptions extends VelocityOptions {
    keyframes?: number[];
    power?: number;
    timeConstant?: number;
    modifyTarget?: (v: number) => number;
}
interface InertiaOptions extends DecayOptions {
    bounceStiffness?: number;
    bounceDamping?: number;
    min?: number;
    max?: number;
}
interface KeyframeOptions {
    ease?: Easing | Easing[];
    times?: number[];
}

/**
 * @public
 */
declare type Subscriber<T> = (v: T) => void;
/**
 * @public
 */
declare type PassiveEffect<T> = (v: T, safeSetter: (v: T) => void) => void;
interface MotionValueEventCallbacks<V> {
    animationStart: () => void;
    animationComplete: () => void;
    animationCancel: () => void;
    change: (latestValue: V) => void;
    renderRequest: () => void;
    velocityChange: (latestVelocity: number) => void;
}
interface ResolvedValues {
    [key: string]: string | number;
}
interface Owner {
    current: HTMLElement | unknown;
    getProps: () => {
        onUpdate?: (latest: ResolvedValues) => void;
    };
}
interface MotionValueOptions {
    owner?: Owner;
}
/**
 * `MotionValue` is used to track the state and velocity of motion values.
 *
 * @public
 */
declare class MotionValue<V = any> {
    /**
     * This will be replaced by the build step with the latest version number.
     * When MotionValues are provided to motion components, warn if versions are mixed.
     */
    version: string;
    /**
     * If a MotionValue has an owner, it was created internally within Framer Motion
     * and therefore has no external listeners. It is therefore safe to animate via WAAPI.
     */
    owner?: Owner;
    private stopPassiveEffect?;
    /**
     * Adds a function that will be notified when the `MotionValue` is updated.
     *
     * It returns a function that, when called, will cancel the subscription.
     *
     * When calling `onChange` inside a React component, it should be wrapped with the
     * `useEffect` hook. As it returns an unsubscribe function, this should be returned
     * from the `useEffect` function to ensure you don't add duplicate subscribers..
     *
     * ```jsx
     * export const MyComponent = () => {
     *   const x = useMotionValue(0)
     *   const y = useMotionValue(0)
     *   const opacity = useMotionValue(1)
     *
     *   useEffect(() => {
     *     function updateOpacity() {
     *       const maxXY = Math.max(x.get(), y.get())
     *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
     *       opacity.set(newOpacity)
     *     }
     *
     *     const unsubscribeX = x.on("change", updateOpacity)
     *     const unsubscribeY = y.on("change", updateOpacity)
     *
     *     return () => {
     *       unsubscribeX()
     *       unsubscribeY()
     *     }
     *   }, [])
     *
     *   return <motion.div style={{ x }} />
     * }
     * ```
     *
     * @param subscriber - A function that receives the latest value.
     * @returns A function that, when called, will cancel this subscription.
     *
     * @deprecated
     */
    onChange(subscription: Subscriber<V>): () => void;
    /**
     * An object containing a SubscriptionManager for each active event.
     */
    private events;
    on<EventName extends keyof MotionValueEventCallbacks<V>>(eventName: EventName, callback: MotionValueEventCallbacks<V>[EventName]): VoidFunction;
    clearListeners(): void;
    /**
     * Sets the state of the `MotionValue`.
     *
     * @remarks
     *
     * ```jsx
     * const x = useMotionValue(0)
     * x.set(10)
     * ```
     *
     * @param latest - Latest value to set.
     * @param render - Whether to notify render subscribers. Defaults to `true`
     *
     * @public
     */
    set(v: V, render?: boolean): void;
    setWithVelocity(prev: V, current: V, delta: number): void;
    /**
     * Set the state of the `MotionValue`, stopping any active animations,
     * effects, and resets velocity to `0`.
     */
    jump(v: V): void;
    updateAndNotify: (v: V, render?: boolean) => void;
    /**
     * Returns the latest state of `MotionValue`
     *
     * @returns - The latest state of `MotionValue`
     *
     * @public
     */
    get(): V;
    /**
     * @public
     */
    getPrevious(): V;
    /**
     * Returns the latest velocity of `MotionValue`
     *
     * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
     *
     * @public
     */
    getVelocity(): number;
    hasAnimated: boolean;
    /**
     * Stop the currently active animation.
     *
     * @public
     */
    stop(): void;
    /**
     * Returns `true` if this value is currently animating.
     *
     * @public
     */
    isAnimating(): boolean;
    private clearAnimation;
    /**
     * Destroy and clean up subscribers to this `MotionValue`.
     *
     * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
     * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
     * created a `MotionValue` via the `motionValue` function.
     *
     * @public
     */
    destroy(): void;
}
declare function motionValue<V>(init: V, options?: MotionValueOptions): MotionValue<V>;

declare type SequenceTime = number | "<" | `+${number}` | `-${number}` | `${string}`;
declare type SequenceLabel = string;
interface SequenceLabelWithTime {
    name: SequenceLabel;
    at: SequenceTime;
}
interface At {
    at?: SequenceTime;
}
declare type MotionValueSegment = [
    MotionValue,
    UnresolvedValueKeyframe | UnresolvedValueKeyframe[]
];
declare type MotionValueSegmentWithTransition = [
    MotionValue,
    UnresolvedValueKeyframe | UnresolvedValueKeyframe[],
    Transition & At
];
declare type DOMSegment = [ElementOrSelector, DOMKeyframesDefinition];
declare type DOMSegmentWithTransition = [
    ElementOrSelector,
    DOMKeyframesDefinition,
    DynamicAnimationOptions & At
];
declare type Segment = MotionValueSegment | MotionValueSegmentWithTransition | DOMSegment | DOMSegmentWithTransition | SequenceLabel | SequenceLabelWithTime;
declare type AnimationSequence = Segment[];
interface SequenceOptions extends AnimationPlaybackOptions {
    delay?: number;
    duration?: number;
    defaultTransition?: Transition;
}

interface DynamicAnimationOptions extends Omit<AnimationOptionsWithValueOverrides, "delay"> {
    delay?: number | DynamicOption<number>;
}
declare const createScopedAnimate: (scope?: AnimationScope) => {
    <V>(from: V, to: V | GenericKeyframesTarget<V>, options?: ValueAnimationTransition<V> | undefined): AnimationPlaybackControls;
    <V_1>(value: MotionValue<V_1>, keyframes: V_1 | GenericKeyframesTarget<V_1>, options?: ValueAnimationTransition<V_1> | undefined): AnimationPlaybackControls;
    (value: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: DynamicAnimationOptions): AnimationPlaybackControls;
    (sequence: AnimationSequence, options?: SequenceOptions): AnimationPlaybackControls;
};
declare const animate: {
    <V>(from: V, to: V | GenericKeyframesTarget<V>, options?: ValueAnimationTransition<V> | undefined): AnimationPlaybackControls;
    <V_1>(value: MotionValue<V_1>, keyframes: V_1 | GenericKeyframesTarget<V_1>, options?: ValueAnimationTransition<V_1> | undefined): AnimationPlaybackControls;
    (value: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: DynamicAnimationOptions): AnimationPlaybackControls;
    (sequence: AnimationSequence, options?: SequenceOptions): AnimationPlaybackControls;
};

interface AxisScrollInfo {
    current: number;
    offset: number[];
    progress: number;
    scrollLength: number;
    velocity: number;
    targetOffset: number;
    targetLength: number;
    containerLength: number;
    interpolatorOffsets?: number[];
    interpolate?: EasingFunction;
}
interface ScrollInfo {
    time: number;
    x: AxisScrollInfo;
    y: AxisScrollInfo;
}
declare type OnScroll = (info: ScrollInfo) => void;
declare type SupportedEdgeUnit = "px" | "vw" | "vh" | "%";
declare type EdgeUnit = `${number}${SupportedEdgeUnit}`;
declare type NamedEdges = "start" | "end" | "center";
declare type EdgeString = NamedEdges | EdgeUnit | `${number}`;
declare type Edge = EdgeString | number;
declare type ProgressIntersection = [number, number];
declare type Intersection = `${Edge} ${Edge}`;
declare type ScrollOffset = Array<Edge | Intersection | ProgressIntersection>;
interface ScrollOptions {
    container?: HTMLElement;
    target?: Element;
    axis?: "x" | "y";
    offset?: ScrollOffset;
    smooth?: number;
}

declare function scroll(onScroll: OnScroll, { container, ...options }?: ScrollOptions): () => void;

declare type ViewChangeHandler = (entry: IntersectionObserverEntry) => void;
interface InViewOptions {
    root?: Element | Document;
    margin?: string;
    amount?: "any" | "all" | number;
}
declare function inView(elementOrSelector: ElementOrSelector, onStart: (entry: IntersectionObserverEntry) => void | ViewChangeHandler, { root, margin: rootMargin, amount }?: InViewOptions): VoidFunction;

declare const anticipate: (p: number) => number;

declare const backOut: (t: number) => number;
declare const backIn: EasingFunction;
declare const backInOut: EasingFunction;

declare const circIn: EasingFunction;
declare const circOut: EasingFunction;
declare const circInOut: EasingFunction;

declare const easeIn: (t: number) => number;
declare const easeOut: (t: number) => number;
declare const easeInOut: (t: number) => number;

declare function cubicBezier(mX1: number, mY1: number, mX2: number, mY2: number): (t: number) => number;

declare const mirrorEasing: EasingModifier;

declare const reverseEasing: EasingModifier;

declare type StaggerOrigin = "first" | "last" | "center" | number;
declare type StaggerOptions = {
    startDelay?: number;
    from?: StaggerOrigin;
    ease?: Easing;
};
declare function stagger(duration?: number, { startDelay, from, ease }?: StaggerOptions): DynamicOption<number>;

/**
 * @public
 */
interface TransformOptions<T> {
    /**
     * Clamp values to within the given range. Defaults to `true`
     *
     * @public
     */
    clamp?: boolean;
    /**
     * Easing functions to use on the interpolations between each value in the input and output ranges.
     *
     * If provided as an array, the array must be one item shorter than the input and output ranges, as the easings apply to the transition **between** each.
     *
     * @public
     */
    ease?: EasingFunction | EasingFunction[];
    /**
     * Provide a function that can interpolate between any two values in the provided range.
     *
     * @public
     */
    mixer?: (from: T, to: T) => (v: number) => any;
}
/**
 * Transforms numbers into other values by mapping them from an input range to an output range.
 * Returns the type of the input provided.
 *
 * @remarks
 *
 * Given an input range of `[0, 200]` and an output range of
 * `[0, 1]`, this function will return a value between `0` and `1`.
 * The input range must be a linear series of numbers. The output range
 * can be any supported value type, such as numbers, colors, shadows, arrays, objects and more.
 * Every value in the output range must be of the same type and in the same format.
 *
 * ```jsx
 * import * as React from "react"
 * import { transform } from "framer-motion"
 *
 * export function MyComponent() {
 *    const inputRange = [0, 200]
 *    const outputRange = [0, 1]
 *    const output = transform(100, inputRange, outputRange)
 *
 *    // Returns 0.5
 *    return <div>{output}</div>
 * }
 * ```
 *
 * @param inputValue - A number to transform between the input and output ranges.
 * @param inputRange - A linear series of numbers (either all increasing or decreasing).
 * @param outputRange - A series of numbers, colors, strings, or arrays/objects of those. Must be the same length as `inputRange`.
 * @param options - Clamp: Clamp values to within the given range. Defaults to `true`.
 *
 * @public
 */
declare function transform<T>(inputValue: number, inputRange: number[], outputRange: T[], options?: TransformOptions<T>): T;
/**
 *
 * Transforms numbers into other values by mapping them from an input range to an output range.
 *
 * Given an input range of `[0, 200]` and an output range of
 * `[0, 1]`, this function will return a value between `0` and `1`.
 * The input range must be a linear series of numbers. The output range
 * can be any supported value type, such as numbers, colors, shadows, arrays, objects and more.
 * Every value in the output range must be of the same type and in the same format.
 *
 * ```jsx
 * import * as React from "react"
 * import { Frame, transform } from "framer"
 *
 * export function MyComponent() {
 *     const inputRange = [-200, -100, 100, 200]
 *     const outputRange = [0, 1, 1, 0]
 *     const convertRange = transform(inputRange, outputRange)
 *     const output = convertRange(-150)
 *
 *     // Returns 0.5
 *     return <div>{output}</div>
 * }
 *
 * ```
 *
 * @param inputRange - A linear series of numbers (either all increasing or decreasing).
 * @param outputRange - A series of numbers, colors or strings. Must be the same length as `inputRange`.
 * @param options - Clamp: clamp values to within the given range. Defaults to `true`.
 *
 * @public
 */
declare function transform<T>(inputRange: number[], outputRange: T[], options?: TransformOptions<T>): (inputValue: number) => T;

declare const clamp: (min: number, max: number, v: number) => number;

declare type DelayedFunction = (overshoot: number) => void;
/**
 * Timeout defined in ms
 */
declare function delay(callback: DelayedFunction, timeout: number): () => void;

declare const distance: (a: number, b: number) => number;
declare function distance2D(a: Point, b: Point): number;

declare type DevMessage = (check: boolean, message: string) => void;
declare let warning: DevMessage;
declare let invariant: DevMessage;

declare type Mix<T> = (v: number) => T;
declare type MixerFactory<T> = (from: T, to: T) => Mix<T>;
interface InterpolateOptions<T> {
    clamp?: boolean;
    ease?: EasingFunction | EasingFunction[];
    mixer?: MixerFactory<T>;
}
/**
 * Create a function that maps from a numerical input array to a generic output array.
 *
 * Accepts:
 *   - Numbers
 *   - Colors (hex, hsl, hsla, rgb, rgba)
 *   - Complex (combinations of one or more numbers or strings)
 *
 * ```jsx
 * const mixColor = interpolate([0, 1], ['#fff', '#000'])
 *
 * mixColor(0.5) // 'rgba(128, 128, 128, 1)'
 * ```
 *
 * TODO Revist this approach once we've moved to data models for values,
 * probably not needed to pregenerate mixer functions.
 *
 * @public
 */
declare function interpolate<T>(input: number[], output: T[], { clamp: isClamp, ease, mixer }?: InterpolateOptions<T>): (v: number) => T;

declare const mix: (from: number, to: number, progress: number) => number;

declare const pipe: (...transformers: Function[]) => Function;

declare const progress: (from: number, to: number, value: number) => number;

declare const wrap: (min: number, max: number, v: number) => number;

declare const stepsOrder: StepId[];
declare const steps: Steps;
declare const frame: Frameloop;
declare function cancelFrame(process: Process): void;

declare const frameData: {
    delta: number;
    timestamp: number;
    isProcessing: boolean;
};

/**
 * @deprecated
 *
 * Import as `frame` instead.
 */
declare const sync: Frameloop;
/**
 * @deprecated
 *
 * Use cancelFrame(callback) instead.
 */
declare const cancelSync: {};

export { DelayedFunction, DevMessage, InterpolateOptions, MixerFactory, MotionValue, PassiveEffect, Subscriber, animate, anticipate, backIn, backInOut, backOut, cancelFrame, cancelSync, circIn, circInOut, circOut, clamp, createScopedAnimate, cubicBezier, delay, distance, distance2D, easeIn, easeInOut, easeOut, frame, frameData, inView, interpolate, invariant, mirrorEasing, mix, motionValue, pipe, progress, reverseEasing, scroll, stagger, steps, stepsOrder, sync, transform, warning, wrap };
