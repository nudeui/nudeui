---
title: Nude UI
layout: landing
hero:
  image: /logo.svg
  imageAlt: Nude UI logo
  actions:
    - text: Browse components
      href: /elements/
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

{% include "components-table.njk" %}

## Wanna use them all?

This includes all components marked as mature:

```js
import "https://nudeui.com/elements/index.js";
```

Components still being incubated will need to be included individually.

## Failed experiments

Do not use. These have serious flaws and are likely incomplete.
They are included here only in case someone else wants to look into fixing their issues,
as well as a warning for other wanderers going down the same path.

{% include "failed-experiments.njk" %}
