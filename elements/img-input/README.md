---
id: img-input
---

<header>

# `<img-input>`

Form control for image linking and uploading.

</header>



## Features

- Paste, drag & drop, upload, or provide a URL, all with the same unified API!
- Inline preview (`nopreview` attribute to disable)
- Uses [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) to work like a built-in form element
- Ultra light

## TODO

- `multiple` attribute?
- Retargeting of input attributes (`autofocus`, `placeholder` etc)


## Examples

Basic

```html
<img-input></img-input>
```

## Customizing the preview

By default, the preview is shown in the same element as the input.
There are two ways to customize this: using the `preview` slot, or the `preview` attribute.

You can set the `preview` attribute to `none` for no preview:

```html
<img-input preview="none"></img-input>
```

You can also set it to a CSS selector pointing to another element:

```html
<img-input preview="#preview"></img-input>
<img id="preview">
```

Alternatively, you can use the `preview` slot to provide your own `<img>` element:

```html
<img-input>
  <img slot="preview">
</img-input>
```

Please note that if the `preview` attribute is set, the `preview` slot will be ignored.

The attribute can be dynamic as well:

```html
<img-input></img-input>
<button onclick="this.previousElementSibling.preview =
  this.previousElementSibling.preview === 'none' ? '' : 'none'">
	Toggle preview
</button>
```

## CSS parts

- `input`, `location` - The input element used for URL or filename
- `dropzone` The drop zone
- `button`, `browse-button` - The button used to open the file browser
- `preview` - The preview image

## Slots

- `input` to replace the default input element
- `browse` to replace the default “Browse…” button
- `preview` to replace the default preview image

