"use client";

import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import Magic from "@/ui/icons/magic";

const frameworks = [
  {
    value: "improve",
    label: "Improve writing",
  },
  {
    value: "continue",
    label: "Continue writing",
  },
];

export function AISelector() {
  const [value, setValue] = React.useState("");

  return (
    <Command>
      <CommandInput placeholder="Search framework..." className="h-9" />
      <CommandEmpty>No framework found.</CommandEmpty>
      <CommandGroup>
        {frameworks.map((framework) => (
          <CommandItem
            key={framework.value}
            value={framework.value}
            onSelect={(currentValue) => {
              setValue(currentValue === value ? "" : currentValue);
            }}
          >
            {framework.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}
