# Tooltips

![Tooltip example 1](./img/tooltips/tooltip-1.png)

![Tooltip example 2](./img/tooltips/tooltip-2.png)

Directus has the [`v-tooltip`](https://github.com/Akryum/v-tooltip) library installed and in use. This means you can add a tooltip with helpful info for the user by adding the `v-tooltip` directive to any element:

```vue
<p v-tooltip="€1">$1.17</p>
```

## Inverse colors

When rendering a tooltip on a dark background, you can render the tooltip with the `inverted` class added. This'll render the tooltip with a light-gray background and dark text versus the regular white text on a dark background:

```vue
<button v-tooltip="{ classes: ['inverted'], content: 'Click to save!' }">Save</button>
```

Please checkout the docs for [`v-tooltip`](https://github.com/Akryum/v-tooltip) for more advanced usage instructions.
