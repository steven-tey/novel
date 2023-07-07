"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/ui/primitives/popover";
import { useContext } from "react";
import { AppContext } from "./providers";
import { FontDefault, FontSerif, FontMono } from '@/ui/icons'
import { Check, Menu as MenuIcon, Monitor, Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";

const fonts = [
  {
    font: "Default",
    icon: <FontDefault className="h-4 w-4" />,
  },
  {
    font: "Serif",
    icon: <FontSerif className="h-4 w-4" />,
  },
  {
    font: "Mono",
    icon: <FontMono className="h-4 w-4" />,
  }
];
const appearances = [
  {
    theme: "System",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    theme: "Light",
    icon: <SunDim className="h-4 w-4" />,
  },
  {
    theme: "Dark",
    icon: <Moon className="h-4 w-4" />,
  },
];

export default function Menu() {
  const { font: currentFont, setFont } = useContext(AppContext);
  const { theme: currentTheme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger className="absolute bottom-5 right-5 z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-stone-100 active:bg-stone-200 sm:bottom-auto sm:top-5">
        <MenuIcon className="text-stone-600" width={16} />
      </PopoverTrigger>
      <PopoverContent className="w-52 divide-y divide-stone-200" align="end">
        <div className="p-2">
          <p className="p-2 text-xs font-medium text-stone-500">Font</p>
          {fonts.map(({font, icon}) => (
            <button
              key={font}
              className="flex w-full items-center justify-between rounded px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
              onClick={() => {
                setFont(font);
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border border-stone-200 p-1">{icon}</div>
                <span>{font}</span>
              </div>
              {currentFont === font && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
        <div className="p-2">
          <p className="p-2 text-xs font-medium text-stone-500">Appearance</p>
          {appearances.map(({ theme, icon }) => (
            <button
              key={theme}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
              onClick={() => {
                setTheme(theme.toLowerCase());
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border border-stone-200 p-1">
                  {icon}
                </div>
                <span>{theme}</span>
              </div>
              {currentTheme === theme.toLowerCase() && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
