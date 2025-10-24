import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { build } from '../src/builder.js';

@customElement('lit-builder-examples')
export class LitBuilderExamples extends LitElement {
  @state()
  private count = 0;

  private inputRef = createRef<HTMLInputElement>();

  render() {
    return html`
      <style>
        :host {
          display: block;
          padding: 20px;
          font-family: sans-serif;
        }
        h1 {
          color: #333;
        }
        h2 {
          color: #666;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
          margin-top: 30px;
        }
        h3 {
          color: #888;
          margin-top: 20px;
        }
        .example {
          margin: 10px 0;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .active {
          color: green;
          font-weight: bold;
        }
        .button {
          padding: 8px 16px;
          margin: 5px;
          border: none;
          border-radius: 4px;
          background: #007bff;
          color: white;
          cursor: pointer;
        }
        .button:hover {
          background: #0056b3;
        }
      </style>

      <h1>Lit Builder Examples</h1>
      <p>Demonstrating all features of the lit-builder library</p>

      <h2>1. Basic Usage</h2>

      <h3>Single Element</h3>
      <div class="example">
        ${build({
          name: 'div',
          children: ['Simple div element']
        })}
      </div>

      <h3>Element Array</h3>
      <div class="example">
        ${build([
          { name: 'p', children: ['First paragraph'] },
          { name: 'p', children: ['Second paragraph'] }
        ])}
      </div>

      <h2>2. Attributes</h2>
      <div class="example">
        ${build({
          name: 'a',
          attributes: {
            href: 'https://lit.dev',
            target: '_blank',
            title: 'Visit Lit website'
          },
          children: ['Click me!']
        })}
      </div>

      <h2>3. Properties</h2>
      <div class="example">
        ${build({
          name: 'input',
          attributes: { type: 'text', placeholder: 'Type something...' },
          properties: {
            value: 'Default value'
          }
        })}
        <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
          Input with default value set via property binding
        </p>
      </div>

      <h2>4. Events</h2>
      <div class="example">
        <p>Count: ${this.count}</p>
        ${build({
          name: 'button',
          attributes: { class: 'button' },
          events: {
            click: () => this.count++
          },
          children: ['Increment']
        })}
        ${build({
          name: 'button',
          attributes: { class: 'button' },
          events: {
            click: () => this.count = 0
          },
          children: ['Reset']
        })}
      </div>

      <h2>5. Directives</h2>

      <h3>ref Directive</h3>
      <div class="example">
        ${build({
          name: 'input',
          attributes: { type: 'text', placeholder: 'Input with ref' },
          directives: [ref(this.inputRef)]
        })}
        ${build({
          name: 'button',
          attributes: { class: 'button' },
          events: {
            click: () => this.inputRef.value?.focus()
          },
          children: ['Focus Input']
        })}
      </div>

      <h3>classMap and styleMap in children</h3>
      <div class="example">
        ${build({
          name: 'div',
          children: [
            html`<span class=${classMap({ active: true })}>Active with classMap</span>`,
            ' ',
            html`<span style=${styleMap({ color: 'blue', fontWeight: 'bold' })}>Styled with styleMap</span>`
          ]
        })}
      </div>

      <h2>6. Nested Elements</h2>
      <div class="example">
        ${build({
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
            },
            {
              name: 'li',
              children: ['Item 3']
            }
          ]
        })}
      </div>

      <h2>7. Fragment (Element without name)</h2>
      <div class="example">
        ${build({
          children: [
            { name: 'span', children: ['First'] },
            ' - ',
            { name: 'span', children: ['Second'] },
            ' - ',
            { name: 'span', children: ['Third'] }
          ]
        })}
      </div>

      <h2>8. Mixed Content</h2>
      <div class="example">
        ${build({
          name: 'article',
          children: [
            { name: 'h4', children: ['Article Title'] },
            'This is plain text. ',
            { name: 'strong', children: ['This is bold.'] },
            ' More plain text. ',
            html`<em>This is from a TemplateResult.</em>`,
            {
              name: 'p',
              children: ['A paragraph with nested content.']
            }
          ]
        })}
      </div>

      <h2>9. Complex Example</h2>
      <div class="example">
        ${build({
          name: 'div',
          attributes: { class: 'card' },
          children: [
            {
              name: 'h3',
              children: ['User Card']
            },
            {
              name: 'div',
              children: [
                { name: 'strong', children: ['Name: '] },
                'John Doe'
              ]
            },
            {
              name: 'div',
              children: [
                { name: 'strong', children: ['Email: '] },
                {
                  name: 'a',
                  attributes: { href: 'mailto:john@example.com' },
                  children: ['john@example.com']
                }
              ]
            },
            {
              name: 'button',
              attributes: { class: 'button' },
              events: {
                click: () => alert('Button clicked!')
              },
              children: ['Contact']
            }
          ]
        })}
      </div>

      <h2>10. Rendering from JSON</h2>
      <div class="example">
        ${build(JSON.parse('[{"name": "div", "attributes": {"class": "json-example"}, "children": [{"name": "h4", "children": ["From JSON"]}, "This element was parsed from a JSON string!", {"name": "p", "children": ["Only name, attributes, and children (strings/objects) work in JSON."]}]}]'))}
      </div>
    `;
  }
}
