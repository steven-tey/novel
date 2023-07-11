"use client"

import * as React from "react"
import { useContext } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FontDefault,
  FontMono,
  FontSerif
} from "@/ui/icons";
import { AppContext } from "@/app/providers";

const fonts = [
  {
    font: "Default",
    icon: <FontDefault className="h-4 w-4 mr-2"/>,
  },
  {
    font: "Serif",
    icon: <FontSerif className="h-4 w-4 mr-2"/>,
  },
  {
    font: "Mono",
    icon: <FontMono className="h-4 w-4 mr-2"/>,
  }
];

export function FontToggle() {
  const {setFont} = useContext(AppContext);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-9 px-0">
          <FontDefault className="h-4 w-4"/>
          <span className="sr-only">Toggle font</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {fonts.map(({font, icon}) => (
          <DropdownMenuItem
            key={font}
            onClick={() => setFont(font)}
            className="cursor-pointer"
          >
            {icon}
            <span>{font}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
