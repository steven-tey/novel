import { Command, renderItems } from "novel/extensions";
import { querySuggestions } from "../command/suggestions";

export const slashCommand = Command.configure({
  suggestion: {
    items: querySuggestions,
    render: renderItems,
  },
});
