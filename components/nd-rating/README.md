---
title: "Rating"
description: "Like discrete meter, but editable via hovering and clicking"
id: nd-rating
order: 5
status: Mature
---
<<<<<<<< HEAD:components/nd-rating/README.md
<script type="module" src="./nd-rating.js"></script>
========
<script type="module" src="/components/nd-rating/nd-rating.js"></script>
>>>>>>>> origin/main:docs/components/nd-rating.md

# Rating

Like [`<meter-discrete>`](../meter-discrete/), but editable. Useful to display and set ratings etc.




## Features

- All features of [`<meter-discrete>`](../meter-discrete/), plus:
- Uses [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) to work like a built-in form element
- Keyboard accessible (use arrow keys)
- Ultra light (3KB **unminified** and **uncompressed** + another 3KB for `<meter-discrete>`)

## Examples

Basic

```html {demo}
<nd-rating max="5" value="3.5"></nd-rating>
<button onclick="this.previousElementSibling.readonly = !this.previousElementSibling.readonly">Toggle readonly</button>
```

With step

```html {demo}
<nd-rating max="5" value="3.5" step="0.1" style="font-size: 200%"></nd-rating>
```

Different styles


```html {demo}
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


```html {demo}
<nd-rating value="3.5" icon="../logo.svg"></nd-rating>
```

Participates in form submission (requires [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) support):

```html {demo}
<form action="about:blank" target="_blank">
	<nd-rating name="myrating"></nd-rating>
	<button type=submit>Submit</button>
</form>
```

