---
id: img-input
---

<header>

# `<img-input>`

Form control for image linking and uploading.

</header>

<main>

## Features

- Paste, drag & drop, upload, or provide a URL, all with the same unified API!
- Inline preview (`nopreview` attribute to disable)
- Uses [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) to work like a built-in form element
- Ultra light

## TODO

- `multiple` attribute?
- Regargeting of input attributes (`autofocus`, `placeholder` etc)


## Examples

Basic

```html
<img-input></img-input>
```

No preview

```html
<img-input nopreview></img-input>
```

## CSS parts

- `input`, `location` - The input element used for URL or filename
- `dropzone` The drop zone
- `button`, `browse-button` - The button used to open the file browser
- `preview` - The preview image

</main>