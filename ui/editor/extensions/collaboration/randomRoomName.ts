import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  names,
  animals,
} from "unique-names-generator";

export function randomRoomName() {
  return (
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals, names],
      separator: "-",
      length: 4,
      style: "lowerCase",
    }).replace(/ /g, "") +
    "-" +
    getSuffix()
  );
}

const SUFFIX_LENGTH = 3;
const URLSAFE_BASE64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function getSuffix() {
  let bytes = crypto.getRandomValues(new Uint8Array(SUFFIX_LENGTH));
  return Array.from(bytes)
    .map((x) => URLSAFE_BASE64_ALPHABET[x & 63])
    .join("");
}
