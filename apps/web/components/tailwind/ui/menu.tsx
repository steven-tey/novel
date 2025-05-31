"use client";

import { Check, Menu as MenuIcon, Monitor, Moon, SunDim, UserRoundCog } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useUser } from "@/app/providers";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// TODO implement multiple fonts editor
// const fonts = [
//   {
//     font: "Default",
//     icon: <FontDefault className="h-4 w-4" />,
//   },
//   {
//     font: "Serif",
//     icon: <FontSerif className="h-4 w-4" />,
//   },
//   {
//     font: "Mono",
//     icon: <FontMono className="h-4 w-4" />,
//   },
// ];
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
  // const { font: currentFont, setFont } = useContext(AppContext);
  const { theme: currentTheme, setTheme } = useTheme();
  const user = useUser();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserRoundCog width={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="end">
        {/* Login/Logout options */}
        <div className="p-2 border-b mb-2">
          {user ? (
            <button
              className="w-full text-left text-sm text-red-600 hover:underline"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="w-full text-left text-sm text-blue-600 hover:underline"
              onClick={handleLogin}
            >
              Login
            </button>
          )}
        </div>
        {/* <div className="p-2">
          <p className="p-2 text-xs font-medium text-stone-500">Font</p>
          {fonts.map(({ font, icon }) => (
            <button
              key={font}
              className="flex w-full items-center justify-between rounded px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
              onClick={() => {
                setFont(font);
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border border-stone-200 p-1">
                  {icon}
                </div>
                <span>{font}</span>
              </div>
              {currentFont === font && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div> */}
        <p className="p-2 text-xs font-medium text-muted-foreground">Appearance</p>
        {appearances.map(({ theme, icon }) => (
          <Button
            variant="ghost"
            key={theme}
            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm"
            onClick={() => {
              setTheme(theme.toLowerCase());
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border  p-1">{icon}</div>
              <span>{theme}</span>
            </div>
            {currentTheme === theme.toLowerCase() && <Check className="h-4 w-4" />}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
