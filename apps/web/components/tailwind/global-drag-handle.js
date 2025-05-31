import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, NodeSelection, TextSelection } from '@tiptap/pm/state';
import { Slice, Fragment } from '@tiptap/pm/model';
import { __serializeForClipboard } from '@tiptap/pm/view';

function absoluteRect(node) {
    const data = node.getBoundingClientRect();
    const modal = node.closest('[role="dialog"]');
    if (modal && window.getComputedStyle(modal).transform !== 'none') {
        const modalRect = modal.getBoundingClientRect();
        return {
            top: data.top - modalRect.top,
            left: data.left - modalRect.left,
            width: data.width,
        };
    }
    return {
        top: data.top,
        left: data.left,
        width: data.width,
    };
}
function nodeDOMAtCoords(coords, options) {
    const selectors = [
        'li',
        'p:not(:first-child)',
        'pre',
        'blockquote',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        ...options.customNodes.map((node) => `[data-type=${node}]`),
    ].join(', ');
    return document
        .elementsFromPoint(coords.x, coords.y)
        .find((elem) => elem.parentElement?.matches?.('.ProseMirror') ||
        elem.matches(selectors));
}
function nodePosAtDOM(node, view, options) {
    const boundingRect = node.getBoundingClientRect();
    return view.posAtCoords({
        left: boundingRect.left + 50 + options.dragHandleWidth,
        top: boundingRect.top + 1,
    })?.inside;
}
function calcNodePos(pos, view) {
    const $pos = view.state.doc.resolve(pos);
    if ($pos.depth > 1)
        return $pos.before($pos.depth);
    return pos;
}
function DragHandlePlugin(options) {
    let listType = '';
    function handleDragStart(event, view) {
        view.focus();
        if (!event.dataTransfer)
            return;
        const node = nodeDOMAtCoords({
            x: event.clientX + 50 + options.dragHandleWidth,
            y: event.clientY,
        }, options);
        if (!(node instanceof Element))
            return;
        let draggedNodePos = nodePosAtDOM(node, view, options);
        if (draggedNodePos == null || draggedNodePos < 0)
            return;
        draggedNodePos = calcNodePos(draggedNodePos, view);
        const { from, to } = view.state.selection;
        const diff = from - to;
        const fromSelectionPos = calcNodePos(from, view);
        let differentNodeSelected = false;
        const nodePos = view.state.doc.resolve(fromSelectionPos);
        // Check if nodePos points to the top level node
        if (nodePos.node().type.name === 'doc')
            differentNodeSelected = true;
        else {
            const nodeSelection = NodeSelection.create(view.state.doc, nodePos.before());
            // Check if the node where the drag event started is part of the current selection
            differentNodeSelected = !(draggedNodePos + 1 >= nodeSelection.$from.pos &&
                draggedNodePos <= nodeSelection.$to.pos);
        }
        let selection = view.state.selection;
        if (!differentNodeSelected &&
            diff !== 0 &&
            !(view.state.selection instanceof NodeSelection)) {
            const endSelection = NodeSelection.create(view.state.doc, to - 1);
            selection = TextSelection.create(view.state.doc, draggedNodePos, endSelection.$to.pos);
        }
        else {
            selection = NodeSelection.create(view.state.doc, draggedNodePos);
            // if inline node is selected, e.g mention -> go to the parent node to select the whole node
            // if table row is selected, go to the parent node to select the whole node
            if (selection.node.type.isInline ||
                selection.node.type.name === 'tableRow') {
                let $pos = view.state.doc.resolve(selection.from);
                selection = NodeSelection.create(view.state.doc, $pos.before());
            }
        }
        view.dispatch(view.state.tr.setSelection(selection));
        // If the selected node is a list item, we need to save the type of the wrapping list e.g. OL or UL
        if (view.state.selection instanceof NodeSelection &&
            view.state.selection.node.type.name === 'listItem') {
            listType = node.parentElement.tagName;
        }
        const slice = view.state.selection.content();
        const { dom, text } = __serializeForClipboard(view, slice);
        event.dataTransfer.clearData();
        event.dataTransfer.setData('text/html', dom.innerHTML);
        event.dataTransfer.setData('text/plain', text);
        event.dataTransfer.effectAllowed = 'copyMove';
        event.dataTransfer.setDragImage(node, 0, 0);
        view.dragging = { slice, move: event.ctrlKey };
    }
    let dragHandleElement = null;
    function hideDragHandle() {
        if (dragHandleElement) {
            dragHandleElement.classList.add('hide');
        }
    }
    function showDragHandle() {
        if (dragHandleElement) {
            dragHandleElement.classList.remove('hide');
        }
    }
    function hideHandleOnEditorOut(event) {
        if (event.target instanceof Element) {
            // Check if the relatedTarget class is still inside the editor
            const relatedTarget = event.relatedTarget;
            const isInsideEditor = relatedTarget?.classList.contains('tiptap') ||
                relatedTarget?.classList.contains('drag-handle');
            if (isInsideEditor)
                return;
        }
        hideDragHandle();
    }
    return new Plugin({
        key: new PluginKey(options.pluginKey),
        view: (view) => {
            const handleBySelector = options.dragHandleSelector
                ? document.querySelector(options.dragHandleSelector)
                : null;
            dragHandleElement = handleBySelector ?? document.createElement('div');
            dragHandleElement.draggable = true;
            dragHandleElement.dataset.dragHandle = '';
            dragHandleElement.classList.add('drag-handle');
            function onDragHandleDragStart(e) {
                console.log('[PLUGIN] dragstart');
                handleDragStart(e, view);
            }
            dragHandleElement.addEventListener('dragstart', onDragHandleDragStart);
            function onDragHandleDrag(e) {
                hideDragHandle();
                let scrollY = window.scrollY;
                if (e.clientY < options.scrollTreshold) {
                    window.scrollTo({ top: scrollY - 30, behavior: 'smooth' });
                }
                else if (window.innerHeight - e.clientY < options.scrollTreshold) {
                    window.scrollTo({ top: scrollY + 30, behavior: 'smooth' });
                }
            }
            dragHandleElement.addEventListener('drag', onDragHandleDrag);
            // Add dragend event to reset view.dragging
            dragHandleElement.addEventListener('dragend', function() {
                console.log('[PLUGIN] dragend');
                view.dragging = null;
            });
            hideDragHandle();
            if (!handleBySelector) {
                view?.dom?.parentElement?.appendChild(dragHandleElement);
            }
            view?.dom?.parentElement?.addEventListener('mouseout', hideHandleOnEditorOut);
            // PATCH: Add click/mousedown handler for selection
            dragHandleElement.addEventListener('mousedown', function(e) {
                console.log('[PatchedDragHandle] mousedown');
                // Your selection logic here
                // Example: select the block's text content
                const rect = dragHandleElement.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                const pos = view.posAtCoords({ left: x, top: y });
                if (!pos) {
                  console.log('[PatchedDragHandle] No position found at coords', x, y);
                  return;
                }
                const $pos = view.state.doc.resolve(pos.pos);
                const node = $pos.node($pos.depth);
                if (!node) {
                  console.log('[PatchedDragHandle] No node found at resolved position');
                  return;
                }
                const start = $pos.start($pos.depth);
                const end = $pos.end($pos.depth);
                if (end - start > 1) {
                  console.log('[PatchedDragHandle] Setting text selection', { from: start + 1, to: end - 1 });
                  view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, start + 1, end - 1)));
                } else {
                  console.log('[PatchedDragHandle] Setting node selection', { pos: start });
                  view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, start)));
                }
                view.focus();
                e.preventDefault();
                e.stopPropagation();
            });
            return {
                destroy: () => {
                    if (!handleBySelector) {
                        dragHandleElement?.remove?.();
                    }
                    dragHandleElement?.removeEventListener('drag', onDragHandleDrag);
                    dragHandleElement?.removeEventListener('dragstart', onDragHandleDragStart);
                    dragHandleElement = null;
                    view?.dom?.parentElement?.removeEventListener('mouseout', hideHandleOnEditorOut);
                },
            };
        },
        // ... rest of the plugin code remains unchanged
    });
}
// ... rest of the file remains unchanged 