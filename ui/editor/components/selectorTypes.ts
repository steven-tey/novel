export const SelectorTypes = Object.freeze({
  NODE: "NODE",
  LINK: "LINK",
  COLOR: "COLOR",
  NONE: "NONE",
});

export type SelectorType = (typeof SelectorTypes)[keyof typeof SelectorTypes];
