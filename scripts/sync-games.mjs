// SPDX-License-Identifier: CPAL-1.0
// Copyright 2026 Sylvaris. See ../LICENSE and ../SOURCE_NOTICE.md.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const sourceDirectory = resolve(process.argv[2] ?? '');
const outputDirectory = resolve(import.meta.dirname, '..');
const games = [
  'mumbai-2047',
  'mumbai-doobega-kya',
  'gdp-massager-pro',
  'grand-media-heist',
  'permissions-raj-pro',
  'what-will-jnanu-do',
  'can-you-pm-the-country',
  'delhi-breathes',
];

if (!process.argv[2]) {
  throw new Error('Usage: node scripts/sync-games.mjs <source-public-directory>');
}

const credit = '<p class="sylvaris-attribution"><a href="https://getsylvaris.com/explore" target="_blank" rel="noopener noreferrer">A Sylvaris initiative</a></p>';
const style = `<style>
.sylvaris-attribution{width:100%;margin:0 0 12px;padding:9px 12px;border:1px solid rgba(255,255,255,.35);border-radius:4px;background:#082c2c;color:#fff;text-align:center;font:600 14px/1.4 system-ui,-apple-system,sans-serif}
.sylvaris-attribution a{color:inherit;text-decoration:underline;text-underline-offset:3px}
.sylvaris-attribution a:focus-visible{outline:2px solid #fff;outline-offset:3px}
</style>`;

for (const game of games) {
  const source = await readFile(join(sourceDirectory, `${game}.html`), 'utf8');
  const container = /(<main class="app">|<div class="app-container">)/;
  if (!container.test(source) || !source.includes('</head>')) {
    throw new Error(`Unexpected HTML structure in ${game}.html`);
  }
  const notice = `<!--
SPDX-License-Identifier: CPAL-1.0
The contents of this file are subject to the Common Public Attribution License
Version 1.0 (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy in LICENSE or at
https://opensource.org/license/CPAL-1.0. The License is based on Mozilla Public
License 1.1, with attribution and network-use terms in Sections 14 and 15.
Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND. See the License for rights and limitations.
The Original Code is ${game}.html. The Original Developer and Initial Developer
are Sylvaris / Aditya Kshirsagar. Copyright 2026 Sylvaris. All Rights Reserved.
Exhibit B: "A Sylvaris initiative" and https://getsylvaris.com/explore.
Display of this attribution is required in Larger Works. No alternative
license is offered. See LICENSE and SOURCE_NOTICE.md for the full terms.
-->
`;
  const output = source
    .replace(/^(<!doctype html>)/i, `$1\n${notice}`)
    .replace('</head>', `${style}</head>`)
    .replace(container, `$1${credit}`);
  await writeFile(join(outputDirectory, `${game}.html`), output, 'utf8');
}
