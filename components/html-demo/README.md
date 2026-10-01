---
title: "HTML Demo"
description: "Display demos of HTML content alongside their source code"
id: html-demo
order: 6
status: Mature
---
<script type="module" src="./html-demo.js"></script>

# HTML Demo

An element for displaying HTML content alongside its source code.
Great for documenting web components!




## Features

- Provide a code snippet and it will create the demo, or provide the demo and it will create the code snippet.
- Demo inherits page styles but you can optionally isolate it, in a shadow tree or an iframe
- Executes `<script>` tags (in code-first mode)

### Roadmap

From most to least likely to be implemented:

- More style customization (parts, CSS properties)
- Option to collapse code by default
- Open in CodePen button (need a way to specify dependencies)
- Structured attribute values
- Work with CSS and JS snippets (without having to include them in HTML markup)
- Different layouts
- Editable examples


## Examples

### Basic

Code-first:

```html {demo}
<html-demo>
	<pre class="language-html"><code>
		&lt;input type=range>
	</code></pre>
</html-demo>
```

Content-first:

```html {demo}
<html-demo id=foo>
	<input type=range>
</html-demo>
```

### Adjusters

Only `font-size` for now:

```html {demo}
<html-demo adjust="font-size">
	<button>Click me</button>
</html-demo>
```

Use `--font-size-min` and `--font-size-max` to set the range (default: `50%` to `300%`).

### Style isolation

By default the demo is rendered in the light DOM, and thus inherits the normal page styles.
In most cases, this is what you want.
If not, you can use the `isolate` attribute to render the demo in a shadow tree, with the UA’s default styles.
This works with both modes:

<table>
<thead>
	<tr>
		<th>Content-first</th>
		<th>Code-first</th>
	</tr>
</thead>
<tr>
<td>

```html {demo}
<html-demo isolate>
	<button>Click me</button>
</html-demo>
```
</td>
<td>

```html {demo}
<html-demo isolate>
	<pre class="language-html"><code>
		&lt;button>Click me&lt;/button>
	</code></pre>
</html-demo>
```
</td>
</tr>
</table>

#### Isolating in an iframe { #isolate-iframe }

Use `isolate="iframe"` to render the demo as its own document, in an `<iframe>`.
This gives you full isolation: styles, ids, `document` and `window` all behave as they would in a standalone page,
and (in code-first mode) so do scripts, without any of the [shadow tree caveats](#script-isolate).
Relative URLs resolve against the current page, so you can reference local assets and scripts as usual:

```html {demo}
<html-demo isolate="iframe">
	<pre class="language-html"><code>
		&lt;img src="../../logo.svg" alt="Nude UI logo" width="100">
		&lt;script>
			document.currentScript.replaceWith("Hi from iframe script!");
		&lt;/script>
	</code></pre>
</html-demo>
```

The iframe is exposed as the `iframe` part.
In browsers that support [responsive iframes](https://developer.chrome.com/blog/responsive-iframes) it grows to fit its content
(but not below the default iframe height of `150px`).
Elsewhere, set its height yourself.
Do that conditionally, since any explicit height turns content sizing off:

```css
@supports not (frame-sizing: content-block-size) {
	html-demo::part(iframe) {
		height: 20em;
	}
}
```

Adjusters do not currently affect iframe demos.

### Demo-only content

Children with `slot="demo"` are rendered in the demo but left out of the code.
This is useful for helper styles or setup that would clutter the snippet.
Works in both modes, and in isolated mode they go into the shadow tree or iframe along with the demo:

```html {demo}
<html-demo isolate>
	<style slot="demo">
		.fancy {
			background: rebeccapurple;
			color: white;
			font-weight: bold;
		}
	</style>
	<button class="fancy">Click me</button>
</html-demo>
```

### Execute script

In code-first mode, any `<script>` elements will also be executed:

```html {demo}
<html-demo>
	<pre class="language-html"><code>
		&lt;button>Click me&lt;/button>
		&lt;script>{
			let button = document.currentScript.previousElementSibling;
			// button.onclick = e =>
			button.textContent = "Hi from script!";
		}&lt;/script>
	</code></pre>
</html-demo>
```

#### Executing scripts in isolated mode { #script-isolate }

Do note that there is **limited utility in doing this in shadow tree isolation** (plain `isolate`), since
there is no (easy) way to get a reference to any of the other elements in the demo
(none of this applies to [`isolate="iframe"`](#isolate-iframe)):
- [`document.currentScript` is `null` in shadow trees](https://html.spec.whatwg.org/multipage/dom.html#dom-document-currentscript-dev)
- All `document.querySelector*()` or `document.getElementBy*()` calls will query the light DOM
- Ids will not create variables
- `this` will be the global `window` object or `undefined` in module scripts.


```html {demo}
<html-demo isolate>
	<pre id="isolated-demo" class="language-html"><code>
		&lt;p>This demo has no actual content, but scroll down a bit 👇🏼 &lt;/p>
		&lt;script>{
			let pre = document.getElementById("isolated-demo");
			let container = pre.closest("body > *");
			container.after("Hi from shadow tree script!");
		}&lt;/script>
	</code></pre>
</html-demo>
```

## Auto-wrapping HTML code snippets on a whole page

The element class provides two helper methods for this very thing:

```js
import HTMLDemoElement from "https://nudeui.com/components/html-demo/html-demo.js";

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

