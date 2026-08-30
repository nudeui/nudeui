---
title: "<drop-down>"
description: "Drop-down menu that performs actions when items are clicked"
id: drop-down
order: 100
component:
  name: Drop down
  status: Failed
---
<script type="module" src="/elements/drop-down/drop-down.js"></script>

# `<drop-down>`

Drop-down menu that performs actions when items are clicked




<section class="failed">

## Failed experiment

This is a failed experiment. Do not use.
It is only posted here, in the hopes that someone else may be able to fix its issues.

### Issues

- It is impossible to reliably detect when the `<select>` is closed,
so when the menu is closed with no selection, `aria-pressed` lingers until the button is unfocused.

</section>

## Features

- Uses a regular `<select>` menu, ensuring it works well on a variety of devices
- Accessible (?)
- Tiny (3K **uncompressed** and **unminified**!)


## Examples

Basic:

```html {demo}
<drop-down>
	<button>Click me</button>
	<select>
		<option>One</option>
		<option>Two</option>
		<option onclick="alert('hi')">Three</option>
	</select>
</drop-down>
```

With customized menu label:

```html {demo}
<drop-down>
	<button>+</button>
	<select aria-label="Create new…">
		<option>Document</option>
		<option>Sheet</option>
		<option onclick="alert('hi')">Picture</option>
	</select>
</drop-down>
```

