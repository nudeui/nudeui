---
id: nd-calendar
---

<header>

# `<nd-calendar>`

Display dates, date ranges, or date/time ranges by day or hour.

</header>

<main>

## Features

- Weekly rows or entire months
- TODO: Custom colors per date

## Examples

No attributes

```html
<nd-calendar>
	<time datetime="2022-09-05T00:00"></time> <!-- Times are ignored -->
	<time datetime="2022-09-07"></time>
	<time datetime="2022-09-11"></time>
</nd-calendar>
```

Custom max
```html
<nd-calendar max="2022-09-15">
	<time datetime="2022-09-05"></time>
	<time datetime="2022-09-07"></time>
	<time datetime="2022-09-11"></time>
</nd-calendar>
```

Custom min
```html
<nd-calendar min="2022-09-01">
	<time datetime="2022-09-05"></time>
	<time datetime="2022-09-07"></time>
	<time datetime="2022-09-11"></time>
</nd-calendar>
```

Custom min and max
```html
<nd-calendar min="2022-08-01" max="2022-09-30">
	<time datetime="2022-09-05"></time>
	<time datetime="2022-09-07"></time>
	<time datetime="2022-09-11"></time>
</nd-calendar>
```

By months:

```html
<nd-calendar rows="months">
	<time datetime="2022-05-02"></time>
	<time datetime="2022-05-12"></time>
	<time datetime="2022-06-13T15:00"></time> <!-- Times are ignored -->
	<time datetime="2022-07-12"></time>
	<time datetime="2022-08-22"></time>
	<time datetime="2022-09-05"></time>
	<time datetime="2022-09-07"></time>
	<time datetime="2022-09-11"></time>
</nd-calendar>
```


## Installation

Just include the component's JS file and you're good:

```html
<script src="https://nudeui.com/nd-calendar/nd-calendar.js" type="module"></script>
```

In case you want to link to local files: CSS is fetched automatically, and assumed to be in the same directory as the JS file.

</main>