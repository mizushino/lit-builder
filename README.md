# Lit-Builder

[![npm version](https://badge.fury.io/js/lit-builder.svg)](https://www.npmjs.com/package/lit-builder)
[![npm downloads](https://img.shields.io/npm/dm/lit-builder.svg)](https://www.npmjs.com/package/lit-builder)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Tree Shakeable](https://img.shields.io/badge/Tree%20Shakeable-Yes-brightgreen)

A builder API for programmatically constructing Lit templates using object notation.

**✨ Key Features:**
- **Type-safe template construction** - Build Lit templates with full TypeScript support
- **Declarative API** - Define DOM structures using simple JavaScript objects
- **Full Lit integration** - Supports attributes, properties, events, and directives
- **Flexible composition** - Mix BuildElements, TemplateResults, and strings seamlessly

## Installation

```sh
npm install lit-builder
```

## Usage

### `build`

Builds a Lit `TemplateResult` from one or more `BuildElement` objects.

```ts
build(elements: BuildElement | BuildElement[]): TemplateResult
```

#### Basic Example

```ts
import { build } from 'lit-builder';
import { html, LitElement } from 'lit';

class MyElement extends LitElement {
  render() {
    return html`
      <div>
        ${build({
          name: 'button',
          attributes: { class: 'primary' },
          children: ['Click me!']
        })}
      </div>
    `;
  }
}
```

### `BuildElement`

An object representing a DOM element with the following properties:

```ts
interface BuildElement {
  name?: string;                              // Tag name (e.g., 'div', 'button')
  attributes?: Record<string, string>;        // HTML attributes
  properties?: Record<string, unknown>;       // DOM properties
  events?: Record<string, (e: Event) => void>; // Event handlers
  directives?: DirectiveResult[];             // Lit directives (e.g., ref)
  children?: (BuildElement | TemplateResult | string)[]; // Child content
}
```

#### Single Element

```ts
build({
  name: 'div',
  children: ['Hello, World!']
})
```

#### Element Array

```ts
build([
  { name: 'p', children: ['First paragraph'] },
  { name: 'p', children: ['Second paragraph'] }
])
```

#### Attributes

```ts
build({
  name: 'a',
  attributes: {
    href: 'https://lit.dev',
    target: '_blank'
  },
  children: ['Visit Lit']
})
```

#### Properties

```ts
build({
  name: 'input',
  attributes: { type: 'text' },
  properties: {
    value: 'Default value'
  }
})
```

#### Events

```ts
build({
  name: 'button',
  events: {
    click: () => console.log('Clicked!')
  },
  children: ['Click me']
})
```

#### Directives

```ts
import { createRef, ref } from 'lit/directives/ref.js';

const inputRef = createRef();

build({
  name: 'input',
  directives: [ref(inputRef)]
})
```

#### Nested Elements

```ts
build({
  name: 'ul',
  children: [
    {
      name: 'li',
      children: ['Item 1']
    },
    {
      name: 'li',
      children: [
        'Item 2 with ',
        { name: 'strong', children: ['bold text'] }
      ]
    }
  ]
})
```

#### Fragments (Elements without name)

```ts
build({
  children: [
    { name: 'span', children: ['First'] },
    ' - ',
    { name: 'span', children: ['Second'] }
  ]
})
```

#### Mixed Content

```ts
import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

build({
  name: 'div',
  children: [
    'Plain text',
    { name: 'strong', children: ['Bold text'] },
    html`<span class=${classMap({ active: true })}>With directive</span>`
  ]
})
```

#### Dynamic Lists

```ts
const items = ['Apple', 'Banana', 'Cherry'];

build(
  items.map(item => ({
    name: 'li',
    children: [item]
  }))
)
```

#### Conditional Rendering

```ts
const isLoggedIn = true;

build([
  { name: 'h1', children: ['Welcome'] },
  ...(isLoggedIn ? [{
    name: 'button',
    children: ['Logout']
  }] : [{
    name: 'button',
    children: ['Login']
  }])
])
```

#### Programmatic Component Generation

```ts
function createCard(title: string, content: string) {
  return build({
    name: 'div',
    attributes: { class: 'card' },
    children: [
      { name: 'h3', children: [title] },
      { name: 'p', children: [content] }
    ]
  });
}
```

#### Rendering from JSON

```ts
// Parse JSON string and render
const jsonTemplate = '[{"name": "div", "children": ["Hello from JSON"]}]';
const elements = JSON.parse(jsonTemplate);

build(elements);
```

**Note:** JSON only supports serializable values:
- ✅ `name`, `attributes`, `children`
- ⚠️ `properties` (plain objects/arrays only, no functions or special objects)
- ❌ `events`, `directives`

## Limitations

**Directive values**: Directives like `live()` cannot be used as property/attribute values due to Lit's template literal design. Use the `directives` field for element-level directives like `ref()`.

**Static template optimization**: Dynamic template construction doesn't benefit from Lit's static template caching.

## License

MIT

