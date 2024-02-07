import { Command, renderItems } from "novel/extensions";
import React from "react";

const SlashCommand = Command.configure({
  suggestion: {
    items: [],
    render: renderItems,
  },
});
