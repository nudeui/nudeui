<header>

# Nude UI

A collection of accessible, customizable, ultra-light web components

- Using built-in controls whenever possible, web components when JS and/or extra elements are needed
- Highly customizable
- Tiny (most are ~1KB minified & compressed)

A work in progress. Try them out and [provide feedback](https://github.com/leaverou/nudeui) or move along and check back later.

</header>

<main>

<section id="components" class="language-html">

## Components

| Name | Tag | Description | Type(s) | Status |
|------|-----|-------------|-------------------|--------|
| [Switch](elements/nd-switch) | `<nd-switch>` | On/off toggle switch | CSS-only | Mature |
| [Button Group](elements/button-group) | `<button-group>` | Group of buttons for selecting one or more values out of a set of options | JS | Mature |
| [Cycle Toggle](elements/cycle-toggle) | `<cycle-toggle>` | Compact way to select one option from a group, click selects the next option | JS | Mature |
| [Discrete meter](elements/meter-discrete) | `<meter-discrete>` | Meter with discrete values shown as icons | JS | Mature |
| [Rating](elements/nd-rating) | `<nd-rating>` | Like discrete meter, but editable via hovering and clicking | JS | Mature |
| [HTML Demo](elements/html-demo) | `<html-demo>` | Display demos of HTML content alongside their source code | JS | Mature |
| [Image input](elements/img-input) | `<img-input>` | Input an image via URL, file upload, drag-and-drop, or pasting | JS | In incubation |
| [Freeform text with presets](elements/with-presets) | `<with-presets>` | A combination of a text input and a select element | JS | In incubation |
| [Calendar](elements/nd-calendar) | `<nd-calendar>` | Show dates on a calendar | JS | In incubation |
| [Data bind](elements/data-bind) | `<data-bind>` | Declaratively bind data from a source element to a target element | JS | In incubation |

</section>

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

- [Drop down](elements/drop-down)

</main>