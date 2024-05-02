---
id: data-bind
---

<header>

# `<data-bind>`

An element for propagating data changes between elements.

</header>



## Features

- TBD


## Examples

### Basic

Display slider value:

```html
<data-bind>
	<input type="range" data-bind-source></textarea>
	<span data-bind="value"></span>
</data-bind>
```

Show character count:

```html
<data-bind>
	<textarea data-bind-source></textarea>
	<span data-bind="value.length"></span>
</data-bind>
```



