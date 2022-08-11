---
title: <drop-down>
id: drop-down
---
<header>

# `<drop-down>`

Drop-down menu that performs actions when items are clicked

</header>

<main>

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

```html
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

```html
<drop-down>
	<button>+</button>
	<select aria-label="Create new…">
		<option>Document</option>
		<option>Sheet</option>
		<option onclick="alert('hi')">Picture</option>
	</select>
</drop-down>
```


## Installation

Just include the component's JS file and you're good:

```html
<script src="https://nudeui.com/drop-down/drop-down.js" type="module"></script>
```

In case you want to link to local files: CSS is fetched automatically, and assumed to be in the same directory as the JS file.

</main>