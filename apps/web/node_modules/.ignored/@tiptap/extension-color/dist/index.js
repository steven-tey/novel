import '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';

const Color = Extension.create({
    name: 'color',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    color: {
                        default: null,
                        parseHTML: element => { var _a; return (_a = element.style.color) === null || _a === void 0 ? void 0 : _a.replace(/['"]+/g, ''); },
                        renderHTML: attributes => {
                            if (!attributes.color) {
                                return {};
                            }
                            return {
                                style: `color: ${attributes.color}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setColor: color => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { color })
                    .run();
            },
            unsetColor: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { color: null })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

export { Color, Color as default };
//# sourceMappingURL=index.js.map
