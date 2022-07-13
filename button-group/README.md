# `<button-group>`


## Features

- Uses existing button styling
- Uses `ElementInternals` to work like a built-in form element


## Examples

Basic

```html
<button-group>
	<button>Design</button>
	<button>Preview</button>
</button-group>
```

Pre-selected state via `value`

```html
<button-group value="preview">
	<button>Design</button>
	<button>Preview</button>
</button-group>
```

Pre-selected state via `aria-pressed`

```html
<button-group>
	<button>Design</button>
	<button aria-pressed="true">Preview</button>
</button-group>
```

Participates in form selection:

```html
<form target="_blank">
	<button-group name="favorite_condiment" value="garlic">
		<button>Garlic</button>
		<button>MSG</button>
		<button>Salt</button>
	</button-group>
	<button type=submit>Submit</button>
</form>
```

Vertical

```html
<button-group name="type" vertical>
	<button>Text</button>
	<button aria-pressed>Number</button>
	<button>Bar</button>
	<button>Options</button>
	<button>Toggle</button>
	<button>Location</button>
	<button>Custom</button>
</button-group>
```
