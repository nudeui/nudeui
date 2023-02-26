---
id: nd-timetable
---

<header>

# `<nd-timetable>`

Display dates, date ranges, or date/time ranges by day or hour.

</header>

<main>

## Features

- Weekly rows or entire months
- TODO: Custom colors per date

## Examples

No attributes

```html
<nd-timetable>
	<time datetime="2022-09-05T02:00 / 2022-09-05T12:00"></time>
	<time datetime="2022-09-07T18:30 / 2022-09-08T04:00"></time>
	<time datetime="2022-09-12T00:00 / 2022-09-12T01:00"></time>
</nd-timetable>
```


## Installation

Just include the component's JS file and you're good:

```html
<script src="https://nudeui.com/nd-timetable/nd-timetable.js" type="module"></script>
```

In case you want to link to local files: CSS is fetched automatically, and assumed to be in the same directory as the JS file.

</main>