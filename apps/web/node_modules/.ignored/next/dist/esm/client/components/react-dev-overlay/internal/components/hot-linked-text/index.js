import React from "react";
import { getWordsAndWhitespaces } from "./get-words-and-whitespaces";
const linkRegex = /https?:\/\/[^\s/$.?#].[^\s"]*/i;
export const HotlinkedText = function HotlinkedText(props) {
    const { text  } = props;
    const wordsAndWhitespaces = getWordsAndWhitespaces(text);
    return /*#__PURE__*/ React.createElement(React.Fragment, null, linkRegex.test(text) ? wordsAndWhitespaces.map((word, index)=>{
        if (linkRegex.test(word)) {
            return /*#__PURE__*/ React.createElement(React.Fragment, {
                key: "link-" + index
            }, /*#__PURE__*/ React.createElement("a", {
                href: word
            }, word));
        }
        return /*#__PURE__*/ React.createElement(React.Fragment, {
            key: "text-" + index
        }, word);
    }) : text);
};

//# sourceMappingURL=index.js.map