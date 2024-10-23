---
id: meter-discrete
---

<header>

# `<meter-discrete>`

Like `<meter>`, but discrete. Useful to display ratings etc.

</header>



## Features

- Scales with font size
- Use emoji or custom icons
- Styleable bar and inactive part
- Uses [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) for accessibiity
- Ultra light (3KB **unminified** and **uncompressed**!)

## Examples

No attributes

```html
<meter-discrete></meter-discrete>
```

Without specifying icon

```html
<meter-discrete max="5" value="2.5"></meter-discrete>
```

With custom icon, and a max of 10

```html
<meter-discrete max="10" value="6.6" icon="❤️"></meter-discrete>
```

With step

```html
<meter-discrete max="10" value="6.6" step="0.5" icon="❤️"></meter-discrete>
```

Dynamic value

```html
<meter-discrete max="5" value="3.5" icon="💩"></meter-discrete>
<button onclick="this.previousElementSibling.value = Math.random() * 5">Random value</button>
```

Different styles


```html
<style>
#minimal_rating {
	font-size: 200%;
}

#minimal_rating::part(value),
#minimal_rating::part(inactive) {
	filter: contrast(0%) sepia() hue-rotate(140deg);
}

#minimal_rating::part(inactive) {
	opacity: .5;
}
</style>
<meter-discrete id="minimal_rating" max="5" value="2.5" icon="💜"></meter-discrete>
```

Actual image instead of emoji:


```html
<meter-discrete value="3.5" icon="/logo.svg"></meter-discrete>
```

## See also

* [`<nd-rating>`](../nd-rating), an editable version of `<meter-discrete>`

