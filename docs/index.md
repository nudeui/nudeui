---
title: Nude UI
layout: landing
hero:
  image: /logo.svg
  imageAlt: Nude UI logo
  actions:
    - text: Browse components
      href: /components/
    - text: GitHub
      href: https://github.com/leaverou/nudeui
      icon: github
features:
  - icon: 🐣
    title: Nude by design
    description: Using built-in controls whenever possible, web components only when JS and/or extra elements are needed
  - icon: 🎨
    title: Highly customizable
    description: Style with regular CSS, using custom properties and parts
  - icon: 🪶
    title: Ultra-light
    description: Most components are ~1KB minified & compressed
---

A work in progress. Try them out and [provide feedback](https://github.com/leaverou/nudeui) or move along and check back later.

## Components

<table>
<thead>
<tr>
	<th>Name</th>
	<th>Tag</th>
	<th>Description</th>
	<th>Type(s)</th>
	<th>Status</th>
</tr>
</thead>
<tbody>
{%- for item in collections.components %}{% if item.data.status != "Failed" %}
<tr>
	<td><a href="{{ root }}{{ item.url }}">{{ item.data.title }}</a></td>
	<td><code>&lt;{{ item.data.id }}&gt;</code></td>
	<td>{{ item.data.description }}</td>
	<td>{{ "CSS-only" if item.data.css_only else "JS" }}</td>
	<td>{{ item.data.status }}</td>
</tr>
{%- endif %}{% endfor %}
</tbody>
</table>

## Wanna use them all?

This includes all components marked as mature:

```js
import "https://nudeui.com/components/index.js";
```

Components still being incubated will need to be included individually.

## Failed experiments

Do not use. These have serious flaws and are likely incomplete.
They are included here only in case someone else wants to look into fixing their issues,
as well as a warning for other wanderers going down the same path.

{% for item in collections.components %}{% if item.data.status == "Failed" -%}
- [{{ item.data.title }}]({{ root }}{{ item.url }}) — {{ item.data.description }}
{% endif %}{% endfor %}
