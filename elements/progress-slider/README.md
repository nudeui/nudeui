---
id: progress-slider
---
<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/components/format-number/format-number.js"></script>
<header>

# `<progress-slider>`

Several improvements over the native `<input type=range>`.

</header>



## Features

- Editable spinner that shows the value or progress of the slider, displayed as a tooltip or inline
- Convenience methods

## Examples

### Basic

Simplest version:

```html
<progress-slider></progress-slider>
```

You can also *provide* a specific slider element yourself so it can be easier to style or customize:

```html
<progress-slider>
	<input type=range>
</progress-slider>
```

You can also provide a specific element for the value:

```html
<progress-slider>
	<sl-format-number slot="value" type="currency" currency="USD"></sl-format-number>
</progress-slider>
```

If it has a `value` property it will be assumed to be editable, otherwise it will be read-only.

---

All usual slider attributes work and are simply copied to the slider and spinner elements:

```html
<progress-slider min="-180" max="180" step="0.01"></progress-slider>
```

You are encouraged to provide a slider with the right attributes from the start, to minimize updates.

---

By default the number is shown as a read/write tooltip, but you can make it display inline:

```html
<progress-slider style="--value-position: end"></progress-slider>
```

Yes, this is a regular CSS property that you can even set in your stylesheet.
It requires [style queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries#container_style_queries_2),
which means [at the time of this writing, it won’t work in Firefox](https://caniuse.com/css-container-queries-style).

By default shown is the slider value, but you can switch to showing (and editing) the progress instead:

```html
<progress-slider show="progress"></progress-slider>
```

## Properties and methods

In addition to the usual properties and methods of a slider (`min`, `max`, `step`, `value`, `defaultValue`), the following are available:
- `show`: Whether to show the value or the progress. Possible values: `value`, `progress`. Default: `value`.
- `valueElement`: The element that shows the value.
- `sliderElement`: The element that is the slider.
- `progress`: The progress of the slider, as a number between 0 and 1.
- `progressAt(value)`: Returns the progress at a given point, as a number between 0 and 1.
- `valueAt(progress)`: Returns the value at a given progress, as a number between `min` and `max`.

