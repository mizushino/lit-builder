# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

lit-builder is a library that provides a builder API for programmatically constructing Lit templates using object notation. It allows developers to build DOM structures dynamically from JavaScript objects instead of writing template literals.

## Project Structure

```
lit-builder/
├── src/
│   ├── builder.ts          # Main build function and BuildElement interface
│   └── index.ts            # Public API exports
├── examples/
│   └── lit-builder-examples.ts  # Live examples demonstrating all features
├── dist/                   # Compiled output (generated)
├── index.html              # Dev server entry point
├── package.json
├── tsconfig.json           # Main TypeScript config
└── README.md
```

## Core Concepts

### BuildElement Interface

The `BuildElement` interface represents a DOM element with these properties:

- `name?: string` - Tag name. If omitted, acts as a fragment
- `attributes?: Record<string, string>` - HTML attributes (e.g., `class`, `href`)
- `properties?: Record<string, unknown>` - DOM properties (e.g., `.value`)
- `events?: Record<string, (e: Event) => void>` - Event handlers (e.g., `click`)
- `directives?: DirectiveResult[]` - Element-level directives (e.g., `ref()`)
- `children?: (BuildElement | TemplateResult | string)[]` - Child content

### Template Building Process

1. `build()` accepts single or array of `BuildElement`
2. `_build()` recursively processes elements, building template strings and values arrays
3. The function constructs a valid `TemplateStringsArray` structure
4. Returns a Lit `TemplateResult` via `html(strings, ...values)`

## Development Commands

### Build
```bash
npm run build
```
Compiles TypeScript from `src/` to `dist/` using `tsc`. Generates:
- JavaScript files (`.js`)
- Type declaration files (`.d.ts`)
- Source maps (`.js.map`, `.d.ts.map`)

### Development Server
```bash
npm run dev
# or specify port:
PORT=3001 npm run dev
```
Starts Web Dev Server (default port 3000) with:
- Hot module reloading
- TypeScript compilation via esbuild
- Serves `index.html` which loads the examples component

Access examples at `http://localhost:3000` (or your specified port).

### Publishing

Before publishing to npm:
1. Update version in `package.json`
2. Run `npm run build` to verify build succeeds
3. Run `npm publish` (`prepublishOnly` script automatically runs build)

The `files` field in `package.json` specifies what gets published: `dist/`, `src/`, `README.md`, and `LICENSE`.

## Key Implementation Details

### String Sanitization
Tag and attribute names are sanitized via `sanitize()` to only allow `[a-zA-Z0-9\-_]` characters.

### Attribute vs Property vs Event Binding
- Attributes: `key="value"` (strings only, HTML escaped)
- Properties: `.key=${value}` (any value, no quotes)
- Events: `@key=${handler}` (function handlers, no quotes)

### Template Literal Construction
The builder manually constructs the `strings` and `values` arrays that Lit's `html` tag function expects:
- `strings` must always have length = `values.length + 1`
- Each value position creates a binding point in the template

### JSON Support Limitations
When using JSON to define templates:
- ✅ `name`, `attributes`, `children` work fully
- ⚠️ `properties` only supports JSON-serializable values
- ❌ `events`, `directives` cannot be serialized

### Directive Limitations
Directives like `live()` cannot be used as property/attribute values due to how Lit's template literal parsing works. Only element-level directives (via `directives` field) work reliably.

## TypeScript Configuration

Main `tsconfig.json` uses:
- `experimentalDecorators: true` - For Lit decorators in examples
- `useDefineForClassFields: false` - Required for Lit's decorator behavior
- Includes both `src/**/*.ts` and `examples/**/*.ts`

## Common Tasks

### Adding a New Feature
1. Update `BuildElement` interface in `src/builder.ts`
2. Add processing logic in `_build()` function
3. Add example in `examples/lit-builder-examples.ts`
4. Document in `README.md`

### Testing Changes
1. Run `npm run dev`
2. Open browser to examples page
3. Verify the feature works as expected
4. Check browser console for errors

## Code Style

- Simple, clear comments explaining "what" each section does
- Use JSDoc for public API (`build()`, `BuildElement`)
- Inline comments for complex logic
- No emojis unless user requests them
