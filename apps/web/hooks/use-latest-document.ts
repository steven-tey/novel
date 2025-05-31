import { useEffect, useState, useCallback } from "react";
import { supabase, saveDocument } from "@/lib/supabaseClient";
import { defaultEditorContent } from "@/lib/content";

export function useLatestDocument(user) {
  const [docId, setDocId] = useState();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("Loading...");

  // Fetch or create latest document
  useEffect(() => {
    if (!user) {
      setDocId(undefined);
      setTitle("");
      setContent(null);
      setLoading(false);
      setSaveStatus("No user");
      return;
    }
    let cancelled = false;
    async function fetchOrCreate() {
      setLoading(true);
      setSaveStatus("Loading...");
      // Get all docs for user
      const { data: docs, error } = await supabase
        .from("documents")
        .select("id, title, content, updated_at")
        .eq("owner_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) {
        setLoading(false);
        setSaveStatus("Error");
        return;
      }
      if (!docs || docs.length === 0) {
        // No docs: create new
        const defaultTitle = "New Document 1";
        const saved = await saveDocument({
          owner_id: user.id,
          title: defaultTitle,
          content: defaultEditorContent,
        });
        if (!cancelled) {
          setDocId(saved.id);
          setTitle(saved.title);
          setContent(saved.content);
          setSaveStatus("Saved");
          setLoading(false);
        }
      } else {
        // Use latest doc
        const latest = docs[0];
        if (!cancelled) {
          setDocId(latest.id);
          setTitle(latest.title);
          setContent(latest.content);
          setSaveStatus("Loaded");
          setLoading(false);
        }
      }
    }
    fetchOrCreate();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Title update handler
  const updateTitle = useCallback(async (newTitle) => {
    setTitle(newTitle);
    setSaveStatus("Saving...");
    await saveDocument({
      id: docId,
      owner_id: user.id,
      title: newTitle,
      content: content || defaultEditorContent,
    });
    setSaveStatus("Saved");
  }, [docId, user, content]);

  return {
    docId,
    setDocId,
    loading,
    saveStatus,
    setSaveStatus,
    title,
    setTitle: updateTitle,
    content,
    setContent,
  };
} 