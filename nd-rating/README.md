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
<nd-rating max="5" value="3.5" step="0.1" style="font-size: 200%"></nd-rating>
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
<nd-rating id="minimal_rating" max="5" value="2.5" step="0.5" icon="💜"></nd-rating>
```

Actual image instead of emoji:


```html
<nd-rating value="3.5" icon="../logo.svg"></nd-rating>
```

## Installation

Just include the component's JS file and you're good:

```html
<script src="https://nudeui.com/nd-rating/nd-rating.js" type="module"></script>
```

In case you want to link to local files: CSS is fetched automatically, and assumed to be in the same directory as the JS file.

</main>