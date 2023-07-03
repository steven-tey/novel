import { createRenderStep } from './create-render-step.mjs';
import { frameData } from './data.mjs';

const maxElapsed = 40;
let useDefaultElapsed = true;
let runNextFrame = false;
const stepsOrder = [
    "read",
    "update",
    "preRender",
    "render",
    "postRender",
];
const steps = stepsOrder.reduce((acc, key) => {
    acc[key] = createRenderStep(() => (runNextFrame = true));
    return acc;
}, {});
const processStep = (stepId) => steps[stepId].process(frameData);
const processFrame = (timestamp) => {
    runNextFrame = false;
    frameData.delta = useDefaultElapsed
        ? 1000 / 60
        : Math.max(Math.min(timestamp - frameData.timestamp, maxElapsed), 1);
    frameData.timestamp = timestamp;
    frameData.isProcessing = true;
    stepsOrder.forEach(processStep);
    frameData.isProcessing = false;
    if (runNextFrame) {
        useDefaultElapsed = false;
        requestAnimationFrame(processFrame);
    }
};
const startLoop = () => {
    runNextFrame = true;
    useDefaultElapsed = true;
    if (!frameData.isProcessing)
        requestAnimationFrame(processFrame);
};
const frame = stepsOrder.reduce((acc, key) => {
    const step = steps[key];
    acc[key] = (process, keepAlive = false, immediate = false) => {
        if (!runNextFrame)
            startLoop();
        return step.schedule(process, keepAlive, immediate);
    };
    return acc;
}, {});
function cancelFrame(process) {
    stepsOrder.forEach((key) => steps[key].cancel(process));
}

export { cancelFrame, frame, steps, stepsOrder };
