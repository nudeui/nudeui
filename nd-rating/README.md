---
id: nd-rating
---

<header>

# `<nd-rating>`

Like [`<meter-discrete>`](../meter-discrete/), but editable. Useful to display and set ratings etc.

</header>

<main>

## Examples

Basic

```html
<nd-rating max="5" value="3.5"></nd-rating>
<button onclick="this.previousElementSibling.readonly = !this.previousElementSibling.readonly">Toggle readonly</button>
```

With step

```html
<nd-rating max="5" value="3.5" editable step="0.1" style="font-size: 200%"></nd-rating>
```

</main>