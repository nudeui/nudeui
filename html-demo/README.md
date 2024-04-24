---
id: html-demo
---

<header>

# `<html-demo>`

An element for displaying HTML content alongside its source code.
Great for documenting web components!

</header>

<main>

## Features

- Provide a code snippet and it will create the demo, or provide the demo and it will create the code snippet.
- Demo inherits page styles but you can optionally isolate

### Roadmap

From most to least likely to be implemented:

- More style customization (parts, CSS properties)
- Option to collapse code by default
- Open in CodePen button (need a way to specify dependencies)
- Structured attribute values
- Work with CSS and JS snippets (without having to include them in HTML markup)
- Execute `<script>` tags in code-first mode
- Different layouts
- Editable examples


## Examples

### Basic

Code-first:

```html
<html-demo>
	<pre class="language-html"><code>
		&lt;input type=range>
	</code></pre>
</html-demo>
```

Content-first:

```html
<html-demo id=foo>
	<input type=range>
</html-demo>
```

### Adjusters

Only `font-size` for now:

```html
<html-demo adjust="font-size">
	<button>Click me</button>
</html-demo>
```

Use `--font-size-min` and `--font-size-max` to set the range (default: `50%` to `300%`).

### Style isolation

By default the demo is rendered in the light DOM, and thus inherits the normal page styles.
In most cases, this is what you want.
If not, you can use the `isolate` attribute to use the UA’s default styles.
This works with both modes (code-first and content-first):

```html
<html-demo isolate>
	<button>Click me</button>
</html-demo>
```
```html
<html-demo isolate>
	<pre class="language-html"><code>
		&lt;button>Click me&lt;/button>
	</code></pre>
</html-demo>
```

### Auto-wrapping HTML code snippets on a whole page

The element class provides two helper methods for this very thing:

```js
import HTMLDemoElement from "https://nudeui.com/html-demo/html-demo.js";

HTMLDemoElement.wrapAll({
	container: mySection,
	ignore: ".no-html-demo, #installation, #some-other-section",
});
```

All parameters are optional.

| Name | Default value | Description |
| --- | --- | --- |
| `container` | `document.body` | The element to search for `<html-demo>` elements. |
| `ignore` | `""` | A CSS selector for elements to ignore. |
| `languages` | `["html", "markup"]` | The `language-xxx` classes whose code snippets to wrap |

</main>