---
title: "Data bind"
description: "Declaratively bind data from a source element to a target element"
id: data-bind
order: 10
status: In incubation
---
<<<<<<<< HEAD:components/data-bind/README.md
<script type="module" src="./data-bind.js"></script>
========
<script type="module" src="/components/data-bind/data-bind.js"></script>
>>>>>>>> origin/main:docs/components/data-bind.md

# Data bind

An element for propagating data changes between elements.




## Features

- TBD


## Examples

### Basic

Display slider value:

```html {demo}
<data-bind>
	<input type="range" data-bind-source></textarea>
	<span data-bind="value"></span>
</data-bind>
```

Show character count:

```html {demo}
<data-bind>
	<textarea data-bind-source></textarea>
	<span data-bind="value.length"></span>
</data-bind>
```



