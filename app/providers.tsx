"use client";

import { Dispatch, ReactNode, SetStateAction, createContext } from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { displayFontMapper, defaultFontMapper } from "@/styles/fonts";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { cn } from "@/lib/utils";

export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Sans Serif",
  setFont: () => {},
});

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Sans Serif");

  return (
    <AppContext.Provider
      value={{
        font,
        setFont,
      }}
    >
      <Toaster />
      <body className={cn(displayFontMapper[font], defaultFontMapper[font])}>
        {children}
      </body>
      <Analytics />
    </AppContext.Provider>
  );
}
