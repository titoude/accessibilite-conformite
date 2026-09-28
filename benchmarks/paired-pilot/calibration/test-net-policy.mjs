#!/usr/bin/env node
/**
 * test-net-policy.mjs — regression tests for the calibration runner's
 * local-only network policy. Run: node --test calibration/test-net-policy.mjs
 *
 * Guards the "offline replay" claim: a fixture that reaches out to the
 * network must be recorded as an attempt AND classified unsupported — never
 * silently replayed with missing bytes, never called faithful.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isLocalRequest, fetchExternalRefs } from './net-policy.mjs';

test('local fixture-server requests are allowed', () => {
  assert.equal(isLocalRequest('http://127.0.0.1:8871/case.html', 8871), true);
  assert.equal(isLocalRequest('http://127.0.0.1:8871/WAI/content-assets/x.png', 8871), true);
});

test('non-network schemes a page legitimately emits are allowed', () => {
  for (const u of ['about:blank', 'data:image/png;base64,xx', 'blob:http://127.0.0.1/x',
                   'javascript:void(0)'])
    assert.equal(isLocalRequest(u, 8871), true, u);
});

test('external hosts and wrong ports are NOT local', () => {
  for (const u of ['https://github.com/x/y.png',
                   'http://127.0.0.1:9999/other',   // right host, wrong port
                   'https://evil.example/127.0.0.1:8871',  // host-in-path trick
                   'wss://tracker.example/ws'])
    assert.equal(isLocalRequest(u, 8871), false, u);
});

test('img/iframe/script/link are FETCHEd external deps', () => {
  const { fetched, inert } = fetchExternalRefs(
    '<img src="https://github.com/a/b.png">' +
    '<iframe src="https://x.test/f.html"></iframe>' +
    '<script src="https://cdn.test/j.js"></script>' +
    '<link href="https://cdn.test/s.css" rel="stylesheet">');
  assert.equal(fetched.length, 4);
  assert.equal(inert.length, 0);
});

test('a href and form action are INERT (never fetched by the browser)', () => {
  const { fetched, inert } = fetchExternalRefs(
    '<a href="https://www.w3.org/WAI">WAI</a>' +
    '<form action="https://submit.test/x"><input></form>');
  assert.equal(fetched.length, 0);
  assert.deepEqual(inert, ['https://www.w3.org/WAI']);
});

test('the real corpus has exactly one fetched external dep and no surprises', async () => {
  const { readFileSync, readdirSync, statSync } = await import('node:fs');
  const { join, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const HERE = dirname(fileURLToPath(import.meta.url));
  const fixtures = [];
  const walk = d => { for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p); else if (/\.html?$/i.test(f)) fixtures.push(p);
  }};
  walk(join(HERE, 'testcases'));
  const fetchedRefs = [];
  for (const f of fixtures)
    for (const u of fetchExternalRefs(readFileSync(f, 'utf8')).fetched)
      fetchedRefs.push(`${u} :: ${f.split('/').pop()}`);
  // c487ae/7b3b94c0 references github.com .../act-logo.png via img src — the
  // ONLY fetched external dep in the corpus. If a future refresh adds more,
  // this test fails loudly instead of silently weakening the offline claim.
  assert.deepEqual(fetchedRefs.sort(),
    ['https://github.com/act-rules/act-rules.github.io/blob/develop/test-assets/shared/act-logo.png :: 7b3b94c0e39bed9d432f379efa77ba9f54c81c6d.html']);
});
