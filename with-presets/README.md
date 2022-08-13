---
id: with-presets
---

<header>

# `<with-presets>`

A freeform text field with visible presets

</header>

<main>

## Features

- Freeform text with visible presets, for when you want to display both the label and value of the selected option (unlike `<datalist>`)
- Use with `<select>` and `<input>` or custom elements!
- Reactively selects a preset even if entered in the freeform text field
- Selects the correct preset, even if the preset was created dynamically
- TODO: How would labels be appropriately used for this?

## Examples

With select:

```html
<with-presets id="with_select">
	<select>
		<option value="[time(time, 'minutes')]">HH:ii</option>
		<option value="[time(time, 'hours')]">HH:00</option>
		<option value="[time(time, 'seconds')]">HH:ii:ss</option>
		<option value="[time(time, 'ms')]">HH:ii:ss.ms</option>
	</select>
	<input />
</with-presets>
```

With [`<button-group>`](../button-group/):

```html
<button-group>
	<button>1</button>
	<button value="2">Two</button>
	<button value="3">Three</button>
	<button value="custom">Custom…</button>
</button-group>
```

```html
<with-presets id="with_buttongroup">
	<button-group>
		<button>1</button>
		<button value="2">Two</button>
		<button value="3">Three</button>
		<button value="custom">Custom…</button>
	</button-group>
	<input />
</with-presets>
<button onclick='with_buttongroup.value = Math.floor(Math.random() * 5)'>Set random number 0-4</button>
```

With dynamic select:

```html
<with-presets vertical id="with_dynamic_select">
	<select size="4">
	</select>
	<input value="3">
</with-presets>
<button onclick='with_dynamic_select.children[0].insertAdjacentHTML("beforeend", `<option>${with_dynamic_select.select.children.length}</option>`)'>Add option</button>
```

## Installation

Just include the component's JS file and you're good:

```html
<script src="https://nudeui.com/with-presets/with-presets.js" type="module"></script>
```

In case you want to link to local files: CSS is fetched automatically, and assumed to be in the same directory as the JS file.

</main>