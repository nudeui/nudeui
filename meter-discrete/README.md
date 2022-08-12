---
id: meter-discrete
---

<header>

# `<meter-discrete>`

Like `<meter>`, but discrete. Useful to display ratings etc.

</header>

<main>

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
<meter-discrete value="3.5" icon="../logo.svg"></meter-discrete>
```

## Installation

Just include the component's JS file and you're good:

```html
<script src="https://nudeui.com/meter-discrete/meter-discrete.js" type="module"></script>
```

In case you want to link to local files: CSS is fetched automatically, and assumed to be in the same directory as the JS file.

</main>