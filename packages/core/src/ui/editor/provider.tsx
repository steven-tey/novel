"use client";

import { createContext } from "react";

export const NovelContext = createContext<{
  completionApi: string;
}>({
  completionApi: "/api/generate",
});
