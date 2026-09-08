---
title: "Progress ring"
description: "Circular spinner or progress ring, from a bare <progress> and no extra elements"
id: progress-ring
css_only: true
order: 12
status: In incubation
---
<link rel="stylesheet" href="/elements/progress-ring/progress-ring.css">
<script type="module" src="/elements/progress-ring/progress-ring.js"></script>

# Progress ring

A circular spinner or progress ring, drawn entirely in CSS on the element itself — no SVG, no wrapper,
no extra elements. Use it on a `<progress>`, or on anything carrying the right ARIA.

## Features

- **No extra markup.** The ring is the element’s own background and border area.
- **Indeterminate or determinate**, chosen the way the platform already says: `:indeterminate` for
  `<progress>`, presence of `aria-valuenow` for everything else.
- **Real transparency** in the middle so it works on any backdrop.
- **Scales with `font-size`**, or set `--size` directly.

## Examples

### Spinner

No value means indeterminate:

```html {demo}
<p>Loading <progress class="ring"></progress> data…</p>
```

Without `<progress>`, using ARIA:

```html {demo}
<span class="progress-ring" role="progressbar" aria-label="Loading"></span>
```

It scales with `font-size`:

```html {demo}
<progress class="ring" style="font-size: .75rem"></progress>
<progress class="ring" style="font-size: 1rem"></progress>
<progress class="ring" style="font-size: 1.5rem"></progress>
<progress class="ring" style="font-size: 2rem"></progress>
<progress class="ring" style="font-size: 3rem"></progress>
```

Colors, thickness, and speed:

```html {demo}
<progress class="ring" style="font-size: 3rem; --accent-color: seagreen"></progress>
<progress class="ring" style="font-size: 3rem; --track-width: 6px; --track-color: transparent"></progress>
<progress class="ring" style="font-size: 3rem; --speed: .6s"></progress>
```

### Progress ring

With a value, it becomes a determinate ring. On `<progress>` that is `value` and `max`; on anything
else, `aria-valuenow` and `aria-valuemax`:

```html {demo}
<progress class="ring" value="37" max="100"></progress>
<div class="progress-ring" role="progressbar" aria-valuenow="37" aria-valuemax="100">37%</div>
```

The label is your own content.
It is announced, but it is also yours to keep in sync with the value. Only the arc is computed here.

Changing the value transitions:

```html {demo}
<label>Value
	<input type="range" min="0" max="100" value="37"
	       oninput="this.nextElementSibling.value = this.value">
	<progress class="ring" value="37" max="100" style="--track-width: 8px"></progress>
</label>
```

### Flat caps

The arc has round caps by default. `.cap-flat` squares them off:

```html {demo}
<progress class="ring" value="37" max="100" style="--track-width: 8px"></progress>
<progress class="ring cap-flat" value="37" max="100" style="--track-width: 8px"></progress>
```

### Around a button

Because the ring needs no children of its own, it can be the border area of a real control:

```html {demo}
<button class="progress-ring" style="--size: 3rem; --track-width: 3px" aria-label="Cancel upload">
	<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
		<rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
	</svg>
</button>
```

For a *determinate* ring around a button, the two have to be siblings: ARIA makes the children of both
`button` and `progressbar` presentational, so neither can contain the other. Stack them in one grid
cell and point the button at the ring with `aria-describedby`.

<style>
.progress-button {
	display: inline-grid;
	place-items: center;

	> * {
		grid-area: 1 / 1;
	}

	> button {
		border: 0;
		padding: 0;
		background: none;
		color: var(--accent-color, var(--progress-ring-accent-color, accentcolor));
		cursor: pointer;
		display: grid;
		place-content: center;
		inline-size: 2em;
		block-size: 2em;
		border-radius: 50%;

		&:hover, &:focus-visible {
			background: color-mix(in oklab, currentcolor 12%, transparent);
		}
	}
}
</style>

```html {demo}
<span class="progress-button">
	<span class="progress-ring" role="progressbar" id="upload-progress"
	      style="--size: 3rem; --track-width: 3px"
	      aria-label="Upload progress" aria-valuenow="37" aria-valuemax="100" aria-valuetext="37%"></span>
	<button aria-describedby="upload-progress" aria-label="Cancel upload">
		<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
			<rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
		</svg>
	</button>
</span>
```

## Customization

Every knob is read twice: **unprefixed for a single ring, `--progress-ring-*` for a whole region**. Both
are read as defaults rather than declared, and the unprefixed one is read first, so a value set on the
ring itself wins over a `--progress-ring-*` set high up on an ancestor.

| Property | Description | Default |
|----------|-------------|---------|
| `--size` / `--progress-ring-size` | Ring diameter | `1em` (spinner), `3.5em` (determinate) |
| `--track-width` / `--progress-ring-track-width` | Stroke thickness | `2px` (spinner), `.25em` (determinate) |
| `--accent-color` / `--progress-ring-accent-color` | Arc and label color | `accentcolor`, falling back to `#2563eb` |
| `--track-color` / `--progress-ring-track-color` | The groove behind the arc | `#e4e4e7` |
| `--speed` / `--progress-ring-speed` | Time for one full rotation (spinner only) | `2s` |
| `--value` / `--progress-ring-value` | Overrides the value read from the attribute | — |
| `--max` / `--progress-ring-max` | Overrides the max read from the attribute | — |
| `--value-default` / `--progress-ring-value-default` | Value used when the attribute is missing or not a number | `0` |
| `--max-default` / `--progress-ring-max-default` | Max used when the attribute is missing or not a number | `1` on `<progress>`, `100` with ARIA |

So `--progress-ring-accent-color` on your `:root` colors every ring on the page, while `--accent-color`
on one ring colors only that ring.

## Browser support

The determinate ring reads its numbers straight from the attributes with
[typed `attr()`](https://developer.mozilla.org/en-US/docs/Web/CSS/attr), which only Chromium ships so
far. Everywhere else you need `progress-ring.js`, which does nothing but copy those attributes into
`--value` and `--max` — all the math stays in the CSS.

It no-ops entirely on engines with typed `attr()`, and keeps rings in sync as attributes change or new
rings are added. For rings inside a shadow root, call `observe(root)` yourself.

**Don’t want the script?** Set the two custom properties yourself, inline, next to the attribute:

```html
<progress class="ring" value="37" max="100" style="--value: 37; --max: 100"></progress>
```

You still need `value` / `aria-valuenow` on the element — that is what makes it determinate (and
accessible) — but the ring will then draw without any JS anywhere. `--value` takes precedence over the
attribute, so it can come from any rule, not just inline styles.

Spinners need none of this and work everywhere. `background-clip: border-area` is progressive
enhancement: without it the ring is masked instead, which looks the same in every case except when the
ring itself creates a stacking context.
