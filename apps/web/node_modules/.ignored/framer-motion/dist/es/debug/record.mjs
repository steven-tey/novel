function record(data) {
    if (window.MotionDebug) {
        window.MotionDebug.record(data);
    }
}

export { record };
