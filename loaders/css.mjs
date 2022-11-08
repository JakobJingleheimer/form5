// https://github.com/JakobJingleheimer/demo-css-loader

import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import parseCSS from 'css-parse';


export async function resolve(specifier, ctx, next) {
  const nextResult = await next(specifier, ctx);

  if (!specifier.endsWith('.css')) return nextResult;

  return {
    format: 'css',
    shortCircuit: true,
    url: nextResult.url,
  };
}

export async function load(url, ctx, next) {
  if (ctx.format !== 'css') return next(url, ctx);

  const rawSource = '' + await fs.readFile(fileURLToPath(url));
  const parsed = parseCssToObject(rawSource);

  return {
    format: 'json',
    shortCircuit: true,
    source: JSON.stringify(parsed),
  };
}

function parseCssToObject(rawSource) {
  const output = {};

  for (const rule of parseCSS(rawSource).stylesheet.rules) {
    if (rule.type !== 'rule') continue;

    let selector = rule['selectors'].at(-1); // Get right-most in the selector rule: `.Bar` in `.Foo > .Bar {…}`
    if (selector[0] !== '.') break; // only care about classes (not ids)

    selector = selector
      .substr(1) // Skip the initial `.`
      .match(/(\w+)/)[1]; // Get only the classname: `Qux` in `.Qux[type="number"]`

    output[selector] = selector;
  }

  return output;
}
