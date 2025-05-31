# Chat Mode Implementation Plan

## Goals
- Add a "chat mode" to the existing editor.
- In chat mode, pressing Enter submits the user's message to the AI.
- The AI's response is inserted as a new block directly beneath the user's message (ideally streamed in real time).
- The editor is still used for both user and AI messages.

## Requirements
- Toggle between editor mode and chat mode (UI or prop).
- In chat mode:
  - Enter submits the current block as a user message (not just a newline).
  - Each user message and AI response is a separate block (like chat bubbles).
  - AI response is inserted immediately after the user message.
  - Streaming support for AI response (if possible).
- Style user and AI messages distinctly (optional, for chat feel).

## Current App & AI Implementation
- **Editor:** Built with Tiptap/ProseMirror, using `novel` extensions and custom UI.
- **AI Integration:**
  - AI completions are triggered via UI (e.g., `AISelector`, `AICompletionCommands`).
  - AI answers are inserted using `editor.chain().insertContentAt(...)`.
  - The `/api/generate` endpoint supports streaming responses (using `streamText`).
- **Block Structure:**
  - Blocks are nodes like `paragraph`, `heading`, etc. Multiple sentences can be in one block.
  - Insertion logic can insert content as a new block if formatted as such (e.g., Markdown with newlines).
- **Key Event Handling:**
  - The editor currently uses `handleCommandNavigation` for keydown events.
  - No custom chat message node exists yet.

## Proposed Architecture
1. **Chat Mode State**
   - Add a state/prop to toggle chat mode.
2. **Input Handling**
   - In chat mode, override Enter key:
     - Prevent default newline.
     - Capture current block as user message.
     - Insert user message as a new custom chat message node (if not already).
     - Trigger AI call with user message.
   - **Clarification:**
     > The full block (including all lines, e.g. multi-line input) should be treated as the user prompt when submitting to the AI. Multi-line input within a block is preserved and sent as a single prompt.
3. **AI Response Handling**
   - Insert a placeholder custom chat message node below the user message.
   - As AI response streams in, update the AI block in real time.
   - Use `editor.chain().insertContentAt(...)` for block insertion.
4. **Block Structure**
   - Each message (user or AI) is a separate custom chat message node (with attributes for sender, timestamp, etc.).
   - The custom node will support block content (e.g., lists, code blocks) for rich messages.
5. **UI/UX**
   - Style user and AI messages differently (optional).
   - Show loading indicator while waiting for AI response.

**Decision:**
> We will use a custom node for chat messages. This allows for rich styling, metadata, and future extensibility (e.g., highlighting AI answers, avatars, reactions, etc.). The custom node will support block content for rich chat messages.

**Chat History Persistence:**
> Chat history will be persisted as part of the main document. This ensures simplicity, atomic saves, and easy export/versioning. All chat messages (user and AI) are stored directly in the document structure as custom chat message nodes.

## Integration Points
- `advanced-editor.tsx`: Main editor logic, key event handling, and content updates.
- `ai-selector.tsx` and related: Reference for AI call and streaming logic.
- `/api/generate/route.ts`: AI backend, already supports streaming.

## Open Questions
- ~~Should we use a custom node type for chat messages, or just paragraphs with metadata?~~
  - **Decision: Use a custom node type for chat messages.**
- ~~Should chat history be persisted separately from the main document?~~
  - **Decision: Persist chat history as part of the main document.**
- How should we handle errors or rate limits from the AI API?

## Progress Update (2024-05-31)
- ✅ Custom chat message node (`ChatMessage`) implemented as a Tiptap extension in `packages/headless/src/extensions/chat-message.tsx`.
- ✅ Exported and integrated into the editor extensions (`defaultExtensions`) in the web app.
- ✅ Chat mode state and UI toggle implemented in the editor (`advanced-editor.tsx`).
- ⏳ Next: Override Enter key in chat mode to submit the current block as a chat message node, insert user and AI messages, stream AI response, and show error messages if the AI API call fails.

## Next Steps
1. Confirm requirements and open questions with the team.
2. Prototype Enter key override and block insertion in chat mode.
3. Integrate AI streaming response into the editor as a new block.
4. Add UI for toggling chat mode and distinguishing messages.
5. Refine UX and handle edge cases (multi-line, errors, etc.). 