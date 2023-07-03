import Anser from "next/dist/compiled/anser";
import * as React from "react";
import { HotlinkedText } from "../hot-linked-text";
import { EditorLink } from "./EditorLink";
function getFile(lines) {
    const contentFileName = lines.shift();
    if (!contentFileName) return null;
    const [fileName, line, column] = contentFileName.split(":");
    const parsedLine = Number(line);
    const parsedColumn = Number(column);
    const hasLocation = !Number.isNaN(parsedLine) && !Number.isNaN(parsedColumn);
    return {
        fileName: hasLocation ? fileName : contentFileName,
        location: hasLocation ? {
            line: parsedLine,
            column: parsedColumn
        } : undefined
    };
}
function getImportTraceFiles(lines) {
    if (lines.some((line)=>/ReactServerComponentsError:/.test(line)) || lines.some((line)=>/Import trace for requested module:/.test(line))) {
        // Grab the lines at the end containing the files
        const files = [];
        while(/.+\..+/.test(lines[lines.length - 1]) && !lines[lines.length - 1].includes(":")){
            const file = lines.pop().trim();
            files.unshift(file);
        }
        return files;
    }
    return [];
}
function getEditorLinks(content) {
    const lines = content.split("\n");
    const file = getFile(lines);
    const importTraceFiles = getImportTraceFiles(lines);
    return {
        file,
        source: lines.join("\n"),
        importTraceFiles
    };
}
export const Terminal = function Terminal(param) {
    let { content  } = param;
    const { file , source , importTraceFiles  } = React.useMemo(()=>getEditorLinks(content), [
        content
    ]);
    const decoded = React.useMemo(()=>{
        return Anser.ansiToJson(source, {
            json: true,
            use_classes: true,
            remove_empty: true
        });
    }, [
        source
    ]);
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-terminal": true
    }, file && /*#__PURE__*/ React.createElement(EditorLink, {
        isSourceFile: true,
        key: file.fileName,
        file: file.fileName,
        location: file.location
    }), /*#__PURE__*/ React.createElement("pre", null, decoded.map((entry, index)=>/*#__PURE__*/ React.createElement("span", {
            key: "terminal-entry-" + index,
            style: {
                color: entry.fg ? "var(--color-" + entry.fg + ")" : undefined,
                ...entry.decoration === "bold" ? {
                    fontWeight: 800
                } : entry.decoration === "italic" ? {
                    fontStyle: "italic"
                } : undefined
            }
        }, /*#__PURE__*/ React.createElement(HotlinkedText, {
            text: entry.content
        }))), importTraceFiles.map((importTraceFile)=>/*#__PURE__*/ React.createElement(EditorLink, {
            isSourceFile: false,
            key: importTraceFile,
            file: importTraceFile
        }))));
};

//# sourceMappingURL=Terminal.js.map