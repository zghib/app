# Checkbox

## Basic usage

```html
<v-checkbox v-model="checked" label="Receive newsletter" />
```

## Colors

The checkbox component accepts any CSS color value, or variable name:

```html
<v-checkbox color="#abcabc" />
<v-checkbox color="rgba(125, 125, 198, 0.5)" />
<v-checkbox color="--red" />
<v-checkbox color="--input-border-color" />
```

## Boolean vs arrays

Just as with checkboxes, you can use `v-model` with both an array and a boolean:


```html
<template>
	<v-checkbox v-model="withBoolean" />

	<v-checkbox v-model="withArray" value="red" />
	<v-checkbox v-model="withArray" value="blue" />
	<v-checkbox v-model="withArray" value="green" />
</template>

<script>
	export default {
		data() {
			return {
				withBoolean: false,
				withArray: ['red', 'green']
			}
		}
	}
</script>
```

Keep in mind to pass the `value` prop with a unique value when using arrays in `v-model`.

## Events

| Event    | Description                | Data                       |
|----------|----------------------------|----------------------------|
| `change` | New state for the checkbox | Boolean or array of values |

## Props

| Prop         | Description                                                                                            | Default                           |
|--------------|--------------------------------------------------------------------------------------------------------|-----------------------------------|
| `value`      | Value for checkbox. Similar to value attr on checkbox type input in HTML                               | `--`                              |
| `inputValue` | Value that's used with `v-model`. Either boolean or array of values                                    | `false`                           |
| `label`      | Label for the checkbox                                                                                 | `--`                              |
| `color`      | Color for the checked state of the checkbox. Either CSS var name (fe `--red`) or other valid CSS color | `--input-background-color-active` |

## Slots

| Slot    | Description                                                                                    |
|---------|------------------------------------------------------------------------------------------------|
| `label` | Allows custom markup and HTML to be rendered inside the label. Will override the `label` prop. |
