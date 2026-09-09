---
title: "Switch"
description: "On/off toggle switch"
id: nd-switch
css_only: true
order: 1
status: Mature
---
<link rel="stylesheet" href="./style.css">

# Switch

CSS-only toggle switch




## Examples

Basic:

```html {demo}
<input type="checkbox" class="nd-switch">
```

Bigger:

```html {demo}
<input type="checkbox" class="nd-switch" style="font-size: 200%">
```

With larger and smaller thumb:

```html {demo}
<input type="checkbox" class="nd-switch" style="--nd-thumb-margin: -.2em">
<input type="checkbox" class="nd-switch" style="--nd-thumb-margin: .2em">
```

Different colors:
```html {demo}
<input type="checkbox" class="nd-switch" style="
	--nd-thumb-color: black;
	--nd-switch-color: white; border: 1px solid black;
	--nd-switch-color-checked: red
">
```

Right to left:

```html {demo}
<input type="checkbox" class="nd-switch" dir="rtl">
```

Disabled:

```html {demo}
<input type="checkbox" class="nd-switch" disabled>
```

