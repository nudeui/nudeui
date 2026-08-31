---
title: "Cycle Toggle"
description: "Compact way to select one option from a group, click selects the next option"
id: cycle-toggle
order: 3
status: Mature
---
<script type="module" src="/elements/cycle-toggle/cycle-toggle.js"></script>

# Cycle Toggle

Click to cycle through a variety of options




## Features

- Uses [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) to work like a built-in form element
- Accessible (?)
- Tiny (3K **uncompressed** and **unminified**!)


## Examples

Basic, no selected option:

```html {demo}
<label for="mood">Mood:</label>
<cycle-toggle id="mood">
	<span>😔</span>
	<span>😕</span>
	<span>😐</span>
	<span>🙂</span>
	<span>😀</span>
</cycle-toggle>
```

Pre-selected option:

```html {demo}
<label for="mood2">Mood:</label>
<cycle-toggle id="mood2">
	<span>😔</span>
	<span>😕</span>
	<span>😐</span>
	<span aria-selected="true">🙂</span>
	<span>😀</span>
</cycle-toggle>
```

With values (any child element works):

```html {demo}
<label for="mood3">Mood:</label>
<cycle-toggle id="mood3">
	<data value="sad">😔</data>
	<data value="neutral">😐</data>
	<data value="happy" aria-selected="true">🙂</data>
	<data value="elated">😀</data>
</cycle-toggle>
```

With styles:

```html {demo}
<cycle-toggle>
	<data value="" style="opacity: .4">👍🏼</data>
	<data value="1">👍🏼</data>
</cycle-toggle>
```

Readonly:

```html {demo}
<cycle-toggle id="readonly_toggle" readonly>
	<span>😔</span>
	<span>😕</span>
	<span>😐</span>
	<span aria-selected="true">🙂</span>
	<span>😀</span>
</cycle-toggle>
<button onclick="readonly_toggle.readonly = !readonly_toggle.readonly">Toggle readonly</button>
```

Set `element.value`:

```html {demo}
<cycle-toggle id="toggle_rate">
	<data value="1">👍🏼</data>
	<data value="-1">👎🏼</data>
</cycle-toggle>
<button onclick="toggle_rate.value = 1">Select 👍🏼</button>
<button onclick="toggle_rate.value = -1">Select 👎🏼</button>
```

Dynamic `aria-selected`:

```html {demo}
<cycle-toggle id="dynamic_selected">
	<span>😔</span>
	<span>😕</span>
	<span>😐</span>
	<span>🙂</span>
	<span>😀</span>
</cycle-toggle>
<button onclick="dynamic_selected.children[3].setAttribute('aria-selected', 'true')">Select 🙂</button>
```

