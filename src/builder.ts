import type { TemplateResult } from 'lit';
import type { DirectiveResult } from 'lit/directive.js';

import { html } from 'lit';

/**
 * Represents a DOM element that can be built into a Lit template.
 */
export interface BuildElement {
  /** Tag name (e.g., 'div', 'button'). If omitted, acts as a fragment. */
  name?: string;
  /** HTML attributes */
  attributes?: Record<string, string>;
  /** DOM properties (e.g., .value) */
  properties?: Record<string, unknown>;
  /** Event handlers (e.g., click, input) */
  events?: Record<string, (e: Event) => void>;
  /** Element-level directives (e.g., ref) */
  directives?: DirectiveResult[];
  /** Child content: strings, nested BuildElements, or TemplateResults */
  children?: (BuildElement | TemplateResult | string)[];
}

/**
 * Sanitizes a string to only allow safe characters for tag/attribute names.
 */
function sanitize(str: string): string {
  return str.replace(/[^a-zA-Z0-9\-_]/g, '');
}

/**
 * Recursively builds template strings and values from elements.
 */
function _build(element: BuildElement | TemplateResult | string, strings: string[], values: unknown[]): void {
  // Handle string content
  if (typeof element === 'string') {
    strings[strings.length - 1] += element;
    return;
  }

  // Handle TemplateResult (html`...`)
  if (typeof element === 'object' && 'strings' in element && 'values' in element) {
    values.push(element);
    strings.push('');
    return;
  }

  // Handle fragment (no name)
  if (!element.name) {
    if (element.children) {
      for (const child of element.children) {
        _build(child, strings, values);
      }
    }
    return;
  }

  const tagName = sanitize(element.name);

  // Start opening tag
  strings[strings.length - 1] += `<${tagName}`;

  // Add attributes (key="value")
  if (element.attributes) {
    for (const key in element.attributes) {
      if (element.attributes[key] !== undefined) {
        const value = element.attributes[key]
          .toString()
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;');
        strings[strings.length - 1] += ` ${sanitize(key)}="${value}"`;
      }
    }
  }

  // Add properties (.key=${value})
  if (element.properties) {
    for (const key in element.properties) {
      if (element.properties[key] !== undefined) {
        const value = element.properties[key];
        strings[strings.length - 1] += ` .${sanitize(key)}=`;
        values.push(value);
        strings.push('');
      }
    }
  }

  // Add event handlers (@key=${handler})
  if (element.events) {
    for (const key in element.events) {
      if (element.events[key] !== undefined) {
        const value = element.events[key];
        strings[strings.length - 1] += ` @${sanitize(key)}=`;
        values.push(value);
        strings.push('');
      }
    }
  }

  // Add directives (e.g., ref)
  if (element.directives) {
    for (const directive of element.directives) {
      strings[strings.length - 1] += ' ';
      values.push(directive);
      strings.push('');
    }
  }

  // Close opening tag
  strings[strings.length - 1] += '>';

  // Add children
  if (element.children) {
    for (const child of element.children) {
      _build(child, strings, values);
    }
  }

  // Add closing tag
  strings[strings.length - 1] += `</${tagName}>`;
}

/**
 * Builds a Lit TemplateResult from BuildElement(s).
 *
 * @param elements - Single BuildElement or array of BuildElements
 * @returns TemplateResult that can be used in Lit templates
 */
export function build(elements: BuildElement | BuildElement[]): TemplateResult {
  const strings: string[] = [''];
  const values: unknown[] = [];

  // Process single element or array
  if (Array.isArray(elements)) {
    for (const element of elements) {
      _build(element, strings, values);
    }
  } else {
    _build(elements, strings, values);
  }

  // Set raw property for TemplateStringsArray compatibility
  (strings as unknown as { raw: string[] }).raw = strings;

  return html(strings as unknown as TemplateStringsArray, ...values);
}