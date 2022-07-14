<header>

# `<button-group>`

Group of exclusive push buttons

</header>

<main>

## Features

- Uses existing button styling present in the page
- Uses `ElementInternals` to work like a built-in form element


## Examples

Basic

```html
<button-group>
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

Participates in form submission (requires `ElementInternals` support):

```html
<form action="about:blank" target="_blank">
	<button-group name="favorite_letter">
		<button>A</button>
		<button aria-pressed="true">B</button>
		<button>C</button>
		<button>D</button>
		<button>E</button>
		<button>F</button>
		<button>G</button>
	</button-group>
	<button type=submit>Submit</button>
</form>
```

Vertical

```html
<button-group name="type" vertical>
	<button value="garlic" aria-pressed="true">Garlic</button>
	<button value="msg">MSG</button>
	<button value="salt">Salt</button>
</button-group>
```

Dynamically setting `element.value`

```html
<button-group id="group1">
	<button>A</button>
	<button aria-pressed="true">B</button>
	<button>C</button>
</button-group>
<button onclick="group1.value = 'C'">Select C</button>
```

Dynamically adding `aria-pressed` attribute

```html
<button-group id="group2">
	<button>A</button>
	<button aria-pressed="true">B</button>
	<button>C</button>
</button-group>
<button onclick="group2.children[2].ariaPressed = true">Select C</button>
```

Dynamically adding options

```html
<button-group id="group3">
	<button>1</button>
	<button>2</button>
	<button aria-pressed="true">3</button>
</button-group>
<button onclick="window.counter ||= 3; group3.insertAdjacentHTML('beforeend', `<button aria-pressed=true>${++counter}</button>`)">Add option</button>
```

</main>