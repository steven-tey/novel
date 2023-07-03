export function parseComponentStack(componentStack) {
    const componentStackFrames = [];
    for (const line of componentStack.trim().split("\n")){
        // Get component and file from the component stack line
        const match = /at ([^ ]+)( \((.*)\))?/.exec(line);
        if (match == null ? void 0 : match[1]) {
            const component = match[1];
            const webpackFile = match[3];
            // Stop parsing the component stack if we reach a Next.js component
            if (webpackFile == null ? void 0 : webpackFile.includes("next/dist")) {
                break;
            }
            const modulePath = webpackFile == null ? void 0 : webpackFile.replace(/^(webpack-internal:\/\/\/|file:\/\/)(\(.*\)\/)?/, "");
            var _modulePath_split;
            const [file, lineNumber, column] = (_modulePath_split = modulePath == null ? void 0 : modulePath.split(":")) != null ? _modulePath_split : [];
            componentStackFrames.push({
                component,
                file,
                lineNumber: lineNumber ? Number(lineNumber) : undefined,
                column: column ? Number(column) : undefined
            });
        }
    }
    return componentStackFrames;
}

//# sourceMappingURL=parse-component-stack.js.map