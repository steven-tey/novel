'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var state = require('@tiptap/pm/state');
var view = require('@tiptap/pm/view');
var core = require('@tiptap/core');

function findSuggestionMatch(config) {
    var _a;
    const { char, allowSpaces, allowedPrefixes, startOfLine, $position, } = config;
    const escapedChar = core.escapeForRegEx(char);
    const suffix = new RegExp(`\\s${escapedChar}$`);
    const prefix = startOfLine ? '^' : '';
    const regexp = allowSpaces
        ? new RegExp(`${prefix}${escapedChar}.*?(?=\\s${escapedChar}|$)`, 'gm')
        : new RegExp(`${prefix}(?:^)?${escapedChar}[^\\s${escapedChar}]*`, 'gm');
    const text = ((_a = $position.nodeBefore) === null || _a === void 0 ? void 0 : _a.isText) && $position.nodeBefore.text;
    if (!text) {
        return null;
    }
    const textFrom = $position.pos - text.length;
    const match = Array.from(text.matchAll(regexp)).pop();
    if (!match || match.input === undefined || match.index === undefined) {
        return null;
    }
    // JavaScript doesn't have lookbehinds. This hacks a check that first character
    // is a space or the start of the line
    const matchPrefix = match.input.slice(Math.max(0, match.index - 1), match.index);
    const matchPrefixIsAllowed = new RegExp(`^[${allowedPrefixes === null || allowedPrefixes === void 0 ? void 0 : allowedPrefixes.join('')}\0]?$`).test(matchPrefix);
    if (allowedPrefixes !== null && !matchPrefixIsAllowed) {
        return null;
    }
    // The absolute position of the match in the document
    const from = textFrom + match.index;
    let to = from + match[0].length;
    // Edge case handling; if spaces are allowed and we're directly in between
    // two triggers
    if (allowSpaces && suffix.test(text.slice(to - 1, to + 1))) {
        match[0] += ' ';
        to += 1;
    }
    // If the $position is located within the matched substring, return that range
    if (from < $position.pos && to >= $position.pos) {
        return {
            range: {
                from,
                to,
            },
            query: match[0].slice(char.length),
            text: match[0],
        };
    }
    return null;
}

const SuggestionPluginKey = new state.PluginKey('suggestion');
function Suggestion({ pluginKey = SuggestionPluginKey, editor, char = '@', allowSpaces = false, allowedPrefixes = [' '], startOfLine = false, decorationTag = 'span', decorationClass = 'suggestion', command = () => null, items = () => [], render = () => ({}), allow = () => true, }) {
    let props;
    const renderer = render === null || render === void 0 ? void 0 : render();
    const plugin = new state.Plugin({
        key: pluginKey,
        view() {
            return {
                update: async (view, prevState) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    const prev = (_a = this.key) === null || _a === void 0 ? void 0 : _a.getState(prevState);
                    const next = (_b = this.key) === null || _b === void 0 ? void 0 : _b.getState(view.state);
                    // See how the state changed
                    const moved = prev.active && next.active && prev.range.from !== next.range.from;
                    const started = !prev.active && next.active;
                    const stopped = prev.active && !next.active;
                    const changed = !started && !stopped && prev.query !== next.query;
                    const handleStart = started || moved;
                    const handleChange = changed && !moved;
                    const handleExit = stopped || moved;
                    // Cancel when suggestion isn't active
                    if (!handleStart && !handleChange && !handleExit) {
                        return;
                    }
                    const state = handleExit && !handleStart ? prev : next;
                    const decorationNode = view.dom.querySelector(`[data-decoration-id="${state.decorationId}"]`);
                    props = {
                        editor,
                        range: state.range,
                        query: state.query,
                        text: state.text,
                        items: [],
                        command: commandProps => {
                            command({
                                editor,
                                range: state.range,
                                props: commandProps,
                            });
                        },
                        decorationNode,
                        // virtual node for popper.js or tippy.js
                        // this can be used for building popups without a DOM node
                        clientRect: decorationNode
                            ? () => {
                                var _a;
                                // because of `items` can be asynchrounous we’ll search for the current decoration node
                                const { decorationId } = (_a = this.key) === null || _a === void 0 ? void 0 : _a.getState(editor.state); // eslint-disable-line
                                const currentDecorationNode = view.dom.querySelector(`[data-decoration-id="${decorationId}"]`);
                                return (currentDecorationNode === null || currentDecorationNode === void 0 ? void 0 : currentDecorationNode.getBoundingClientRect()) || null;
                            }
                            : null,
                    };
                    if (handleStart) {
                        (_c = renderer === null || renderer === void 0 ? void 0 : renderer.onBeforeStart) === null || _c === void 0 ? void 0 : _c.call(renderer, props);
                    }
                    if (handleChange) {
                        (_d = renderer === null || renderer === void 0 ? void 0 : renderer.onBeforeUpdate) === null || _d === void 0 ? void 0 : _d.call(renderer, props);
                    }
                    if (handleChange || handleStart) {
                        props.items = await items({
                            editor,
                            query: state.query,
                        });
                    }
                    if (handleExit) {
                        (_e = renderer === null || renderer === void 0 ? void 0 : renderer.onExit) === null || _e === void 0 ? void 0 : _e.call(renderer, props);
                    }
                    if (handleChange) {
                        (_f = renderer === null || renderer === void 0 ? void 0 : renderer.onUpdate) === null || _f === void 0 ? void 0 : _f.call(renderer, props);
                    }
                    if (handleStart) {
                        (_g = renderer === null || renderer === void 0 ? void 0 : renderer.onStart) === null || _g === void 0 ? void 0 : _g.call(renderer, props);
                    }
                },
                destroy: () => {
                    var _a;
                    if (!props) {
                        return;
                    }
                    (_a = renderer === null || renderer === void 0 ? void 0 : renderer.onExit) === null || _a === void 0 ? void 0 : _a.call(renderer, props);
                },
            };
        },
        state: {
            // Initialize the plugin's internal state.
            init() {
                const state = {
                    active: false,
                    range: {
                        from: 0,
                        to: 0,
                    },
                    query: null,
                    text: null,
                    composing: false,
                };
                return state;
            },
            // Apply changes to the plugin state from a view transaction.
            apply(transaction, prev, oldState, state) {
                const { isEditable } = editor;
                const { composing } = editor.view;
                const { selection } = transaction;
                const { empty, from } = selection;
                const next = { ...prev };
                next.composing = composing;
                // We can only be suggesting if the view is editable, and:
                //   * there is no selection, or
                //   * a composition is active (see: https://github.com/ueberdosis/tiptap/issues/1449)
                if (isEditable && (empty || editor.view.composing)) {
                    // Reset active state if we just left the previous suggestion range
                    if ((from < prev.range.from || from > prev.range.to) && !composing && !prev.composing) {
                        next.active = false;
                    }
                    // Try to match against where our cursor currently is
                    const match = findSuggestionMatch({
                        char,
                        allowSpaces,
                        allowedPrefixes,
                        startOfLine,
                        $position: selection.$from,
                    });
                    const decorationId = `id_${Math.floor(Math.random() * 0xffffffff)}`;
                    // If we found a match, update the current state to show it
                    if (match && allow({ editor, state, range: match.range })) {
                        next.active = true;
                        next.decorationId = prev.decorationId ? prev.decorationId : decorationId;
                        next.range = match.range;
                        next.query = match.query;
                        next.text = match.text;
                    }
                    else {
                        next.active = false;
                    }
                }
                else {
                    next.active = false;
                }
                // Make sure to empty the range if suggestion is inactive
                if (!next.active) {
                    next.decorationId = null;
                    next.range = { from: 0, to: 0 };
                    next.query = null;
                    next.text = null;
                }
                return next;
            },
        },
        props: {
            // Call the keydown hook if suggestion is active.
            handleKeyDown(view, event) {
                var _a;
                const { active, range } = plugin.getState(view.state);
                if (!active) {
                    return false;
                }
                return ((_a = renderer === null || renderer === void 0 ? void 0 : renderer.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(renderer, { view, event, range })) || false;
            },
            // Setup decorator on the currently active suggestion.
            decorations(state) {
                const { active, range, decorationId } = plugin.getState(state);
                if (!active) {
                    return null;
                }
                return view.DecorationSet.create(state.doc, [
                    view.Decoration.inline(range.from, range.to, {
                        nodeName: decorationTag,
                        class: decorationClass,
                        'data-decoration-id': decorationId,
                    }),
                ]);
            },
        },
    });
    return plugin;
}

exports.Suggestion = Suggestion;
exports.SuggestionPluginKey = SuggestionPluginKey;
exports["default"] = Suggestion;
exports.findSuggestionMatch = findSuggestionMatch;
//# sourceMappingURL=index.cjs.map
