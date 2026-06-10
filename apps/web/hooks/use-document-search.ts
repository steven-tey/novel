import { useDebounce } from "@/hooks/use-debounce";
import {
  getSearchHistory,
  saveSearchHistory,
  searchDocuments,
  type SearchType,
} from "@/lib/document-search";
import type { DocumentItem } from "@/lib/documents";
import { useEffect, useMemo, useState } from "react";

export function useDocumentSearch(documents: DocumentItem[]) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [history, setHistory] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const keyword = debouncedQuery.trim();

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  useEffect(() => {
    if (!keyword) return;
    setHistory(saveSearchHistory(keyword));
  }, [keyword]);

  const results = useMemo(() => searchDocuments(documents, keyword, searchType), [documents, keyword, searchType]);

  const applyHistoryKeyword = (nextKeyword: string) => {
    setQuery(nextKeyword);
    setHistory(saveSearchHistory(nextKeyword));
  };

  return {
    query,
    setQuery,
    debouncedQuery,
    keyword,
    searchType,
    setSearchType,
    results,
    history,
    applyHistoryKeyword,
  };
}
