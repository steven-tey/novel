"use client";
import { defaultEditorContent } from "@/lib/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  ImageResizer,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
  ChatMessage,
} from "novel";
import { useEffect, useState, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "./ui/separator";

import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import { saveDocument, loadDocument, supabase } from "@/lib/supabaseClient";
import { useUser } from "@/app/providers";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

const BLANK_DOC = { type: 'doc', content: [] };

const getNextDefaultTitle = (docs: any[]) => {
  // Find max n in titles like 'New Document n'
  let maxN = 0;
  docs.forEach(doc => {
    const match = doc.title && doc.title.match(/^New Document (\d+)$/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > maxN) maxN = n;
    }
  });
  return `New Document ${maxN + 1}`;
};

export const DocumentTitle = ({ user, docId, setDocId, saveStatus, setSaveStatus, title, setTitle, loading }) => {
  const inputRef = useRef(null);

  const handleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  if (!user || loading) return <div className="h-12 mb-2" />;
  return (
    <input
      ref={inputRef}
      className="text-3xl font-bold mb-4 w-full outline-none bg-transparent"
      value={title}
      onChange={handleChange}
      placeholder="Document Title..."
      aria-label="Document Title"
    />
  );
};

const TailwindAdvancedEditor = ({ docId, setDocId, saveStatus, setSaveStatus, content, setContent, loading }) => {
  const user = useUser();
  const [editorInstance, setEditorInstance] = useState(null);
  const [charsCount, setCharsCount] = useState();
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const [chatMode, setChatMode] = useState(false);

  // Debug: log render and chatMode/editor state
  console.log('[ChatMode] Render', { chatMode, editorInstance });

  // Remove all document fetching logic, just use content prop
  const initialContent = content;

  const debouncedUpdates = useDebouncedCallback(async (editor: any) => {
    if (!user) return;
    const json = editor.getJSON();
    setCharsCount(editor.storage.characterCount.words());
    window.localStorage.setItem("html-content", highlightCodeblocks(editor.getHTML()));
    window.localStorage.setItem("novel-content", JSON.stringify(json));
    window.localStorage.setItem("markdown", editor.storage.markdown.getMarkdown());
    setSaveStatus("Saving...");
    try {
      const saved = await saveDocument({
        id: docId,
        owner_id: user.id,
        title: "Untitled",
        content: json,
        markdown: editor.storage.markdown.getMarkdown(),
        html: editor.getHTML(),
        origin: "user",
        ai_metadata: null,
      });
      setDocId(saved.id);
      setSaveStatus("Saved");
      setContent(saved.content);
    } catch (e) {
      setSaveStatus("Error");
      console.log("Supabase save error", e);
    }
  }, 500);

  // Placeholder for AI call and response handling
  const handleAIResponse = async (userMessage, insertAIMessage) => {
    // TODO: Implement streaming AI call and error handling
    // For now, just insert a fake AI response after a delay
    setTimeout(() => {
      insertAIMessage("This is a placeholder AI response.");
    }, 1000);
  };

  // --- Drag handle block selection logic ---
  // (Removed: useEffect for drag handle event listeners)
  // --- End drag handle block selection logic ---

  if (!user) {
    return <div className="flex items-center justify-center min-h-[400px]">Please log in to use the editor.</div>;
  }
  if (loading || !initialContent) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  return (
    <div className="relative w-full max-w-screen-lg">
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">{saveStatus}</div>
        <div className={charsCount ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground" : "hidden"}>
          {charsCount} Words
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <label className="font-medium">Chat Mode</label>
        <button
          className={`px-2 py-1 rounded ${chatMode ? "bg-purple-500 text-white" : "bg-gray-200"}`}
          onClick={() => {
            setChatMode((v) => {
              const newValue = !v;
              console.log('[ChatMode] Toggle clicked, new value:', newValue);
              return newValue;
            });
          }}
        >
          {chatMode ? "On" : "Off"}
        </button>
      </div>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => {
                console.log('[ChatMode] Keydown event:', event.key, { chatMode, editorInstance });
                if (chatMode && event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
                  if (!editorInstance) return false;
                  console.log('[ChatMode] Enter pressed');
                  event.preventDefault();
                  const { state, commands } = editorInstance;
                  const { from } = state.selection;
                  // Always get the full block (node) at the cursor/selection
                  const $from = state.doc.resolve(from);
                  const blockStart = $from.start($from.depth);
                  const blockEnd = $from.end($from.depth);
                  const blockNode = $from.node($from.depth);
                  // Get the text content of the block
                  const text = blockNode.textContent;
                  if (!text.trim()) {
                    console.log('[ChatMode] No text to submit');
                    return true;
                  }
                  // Build user and AI chatMessage nodes
                  const userNode = {
                    type: "chatMessage",
                    attrs: { sender: "user", timestamp: new Date().toISOString() },
                    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
                  };
                  const aiNode = {
                    type: "chatMessage",
                    attrs: { sender: "ai", timestamp: new Date().toISOString() },
                    content: [{ type: "paragraph", content: [{ type: "text", text: "..." }] }],
                  };
                  // Insert both as siblings, replacing the current block
                  console.log('[ChatMode] Inserting user and AI chatMessage nodes as siblings:', text);
                  commands.insertContentAt({ from: blockStart, to: blockEnd }, [userNode, aiNode]);
                  // Simulate AI response
                  handleAIResponse(text, (aiText) => {
                    const doc2 = editorInstance.getJSON();
                    let lastAIIndex = -1;
                    for (let i = doc2.content.length - 1; i >= 0; i--) {
                      if (doc2.content[i].type === "chatMessage" && doc2.content[i].attrs.sender === "ai") {
                        lastAIIndex = i;
                        break;
                      }
                    }
                    if (lastAIIndex !== -1) {
                      doc2.content[lastAIIndex].content = [{ type: "paragraph", content: [{ type: "text", text: aiText }] }];
                      editorInstance.commands.setContent(doc2);
                      console.log('[ChatMode] AI response set in document');
                    } else {
                      console.log('[ChatMode] No AI message found to update');
                    }
                  });
                  return true;
                }
                return handleCommandNavigation(event);
              },
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            console.log('[ChatMode] onUpdate editor:', editor);
            setEditorInstance(editor);
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
          immediatelyRender={false}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;
