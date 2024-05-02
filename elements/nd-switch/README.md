---
title: Nude switch
id: nd-switch
css_only: true
---

<header>

# Nude switch

CSS-only toggle switch

</header>



## Examples

Basic:

```html
<input type="checkbox" class="nd-switch">
```

Bigger:

```html
<input type="checkbox" class="nd-switch" style="font-size: 200%">
```

With larger and smaller thumb:

```html
<input type="checkbox" class="nd-switch" style="--nd-thumb-margin: -.2em">
<input type="checkbox" class="nd-switch" style="--nd-thumb-margin: .2em">
```

Different colors:
```html
<input type="checkbox" class="nd-switch" style="
	--nd-thumb-color: black;
	--nd-switch-color: white; border: 1px solid black;
	--nd-switch-color-checked: red
">
```

Right to left:

```html
<input type="checkbox" class="nd-switch" dir="rtl">
```

Disabled:

```html
<input type="checkbox" class="nd-switch" disabled>
```

