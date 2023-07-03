declare module 'eslint-module-utils/hash.js' {
  import type { Hash } from 'node:crypto'
  export const hashObject: (object: object, hash?: Hash) => Hash
}
