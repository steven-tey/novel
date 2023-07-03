<img src="https://raw.githubusercontent.com/tailwindlabs/prettier-plugin-tailwindcss/main/.github/banner.jpg" alt="prettier-plugin-tailwindcss" />

A [Prettier](https://prettier.io/) plugin for Tailwind CSS v3.0+ that automatically sorts classes based on [our recommended class order](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted).

## Installation

To get started, just install `prettier-plugin-tailwindcss` as a dev-dependency:

```sh
npm install -D prettier prettier-plugin-tailwindcss
```

This plugin follows Prettier’s autoloading convention, so as long as you’ve got Prettier set up in your project, it’ll start working automatically as soon as it’s installed.

_Note that plugin autoloading is not supported when using certain package managers, such as pnpm or Yarn PnP. In this case you may need to add the plugin to your Prettier config explicitly:_

```js
// prettier.config.js
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
}
```

## Options

### Customizing your Tailwind config path

To ensure that the class sorting takes into consideration any of your project's Tailwind customizations, it needs access to your [Tailwind configuration file](https://tailwindcss.com/docs/configuration) (`tailwind.config.js`).

By default the plugin will look for this file in the same directory as your Prettier configuration file. However, if your Tailwind configuration is somewhere else, you can specify this using the `tailwindConfig` option in your Prettier configuration.

Note that paths are resolved relative to the Prettier configuration file.

```js
// prettier.config.js
module.exports = {
  tailwindConfig: './styles/tailwind.config.js',
}
```

If a local configuration file cannot be found the plugin will fallback to the default Tailwind configuration.

## Sorting non-standard attributes

By default this plugin only sorts classes in the `class` attribute as well as any framework-specific equivalents like `class`, `className`, `:class`, `[ngClass]`, etc.

You can sort additional attributes using the `tailwindAttributes` option, which takes an array of attribute names:

```js
// prettier.config.js
module.exports = {
  tailwindAttributes: ['myClassList'],
}
```

With this configuration, any classes found in the `myClassList` attribute will be sorted:

```jsx
function MyButton({ children }) {
  return (
    <button myClassList="rounded bg-blue-500 px-4 py-2 text-base text-white">
      {children}
    </button>
  );
}
```

## Sorting classes in function calls

In addition to sorting classes in attributes, you can also sort classes in strings provided to function calls. This is useful when working with libraries like [clsx](https://github.com/lukeed/clsx) or [cva](https://cva.style/).

You can sort classes in function calls using the `tailwindFunctions` option, which takes a list of function names:

```js
// prettier.config.js
module.exports = {
  tailwindFunctions: ['clsx'],
}
```

With this configuration, any classes in `clsx()` function calls will be sorted:

```jsx
import clsx from 'clsx'

function MyButton({ isHovering, children }) {
  let classes = clsx(
    'rounded bg-blue-500 px-4 py-2 text-base text-white',
    {
      'bg-blue-700 text-gray-100': isHovering,
    },
  )

  return (
    <button className={classes}>
      {children}
    </button>
  )
}
```

## Sorting classes in template literals

This plugin also enables sorting of classes in tagged template literals.

You can sort classes in template literals using the `tailwindFunctions` option, which takes a list of function names:

```js
// prettier.config.js
module.exports = {
  tailwindFunctions: ['tw'],
}
```

With this configuration, any classes in template literals tagged with `tw` will automatically be sorted:

```jsx
import { View, Text } from 'react-native'
import tw from 'twrnc'

function MyScreen() {
  return (
    <View style={tw`bg-white p-4 dark:bg-black`}>
      <Text style={tw`text-md text-black dark:text-white`}>Hello World</Text>
    </View>
  )
}
```

## Compatibility with other Prettier plugins

This plugin uses Prettier APIs that can only be used by one plugin at a time, making it incompatible with other Prettier plugins implemented the same way. To solve this we've added explicit per-plugin workarounds that enable compatibility with the following Prettier plugins:

- `@prettier/plugin-pug`
- `@shopify/prettier-plugin-liquid`
- `@ianvs/prettier-plugin-sort-imports`
- `@trivago/prettier-plugin-sort-imports`
- `prettier-plugin-astro`
- `prettier-plugin-css-order`
- `prettier-plugin-import-sort`
- `prettier-plugin-jsdoc`
- `prettier-plugin-organize-attributes`
- `prettier-plugin-organize-imports`
- `prettier-plugin-style-order`
- `prettier-plugin-svelte`
- `prettier-plugin-twig-melody`

One limitation with this approach is that `prettier-plugin-tailwindcss` *must* be loaded last, meaning Prettier auto-loading needs to be disabled. You can do this by setting the `pluginSearchDirs` option to `false` and then listing each of your Prettier plugins in the `plugins` array:

```json5
// .prettierrc
{
  // ..
  "plugins": [
    "prettier-plugin-svelte",
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss" // MUST come last
  ],
  "pluginSearchDirs": false
}
```
