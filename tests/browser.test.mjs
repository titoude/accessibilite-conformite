import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { accNameMatches } from '../tests-validateurs/assertions.mjs';

const clean = '<!doctype html><html lang="en"><head><title>Test form</title></head>'
  + '<body><main><h1>Contact</h1><label for="name">Name</label><input id="name">'
  + '<button>Save</button></main></body></html>';
let server, origin, output, browser;

before(async () => {
  await mkdir('test-results', { recursive: true });
  output = await mkdtemp(resolve('test-results/browser-'));
  server = createServer((request, response) => {
    if (request.url === '/redirect') {
      response.writeHead(302, { Location: '/clean' }).end();
      return;
    }
    response.writeHead(request.url === '/error' ? 500 : 200,
      { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.url === '/broken' ? clean.replace('<button>Save</button>', '<button></button>') : clean);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
});

after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
});

async function audit(name, args) {
  const directory = join(output, name);
  const result = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['audit.mjs', ...args, '--out', directory],
      { cwd: process.cwd(), windowsHide: true });
    let log = '';
    child.stdout.on('data', data => { log += data; });
    child.stderr.on('data', data => { log += data; });
    child.on('error', reject);
    child.on('close', code => resolve({ code, log }));
  });
  return { ...result, directory };
}

test('a real clean page exits 0 and records one audited scenario', async () => {
  const result = await audit('clean', [origin + '/clean', '--states', 'none', '--depth', '0']);
  assert.equal(result.code, 0, result.log);
  const scope = JSON.parse(await readFile(join(result.directory, 'scope.json'), 'utf8'));
  assert.equal(scope.audited, 1);
  assert.equal(scope.errored, 0);
});

test('a real unnamed button exits 1', async () => {
  const result = await audit('broken', [origin + '/broken', '--states', 'none', '--depth', '0']);
  assert.equal(result.code, 1, result.log);
});

test('HTTP errors and redirects to a different document cannot produce zero-error scans', async () => {
  for (const path of ['/error', '/redirect']) {
    const result = await audit(path.slice(1), [origin + path, '--states', 'none', '--depth', '0']);
    assert.equal(result.code, 2, result.log);
  }
});

test('invalid limits and absent state declarations cannot produce a PASS', async () => {
  for (const [index, args] of [
    [origin + '/clean', '--states', 'none', '--max', '0'],
    [origin + '/clean', '--states', 'none', '--depth', '-1'],
    [origin + '/clean', '--states', 'none', '--wait', 'NaN'],
    [origin + '/clean', '--states', 'none', '--unknown-option'],
    [origin + '/clean', '--depth', '0'],
  ].entries()) {
    const result = await audit('invalid-' + index, args);
    assert.equal(result.code, 2, result.log);
  }
});

test('missing URL overwrites stale evidence with an error report', async () => {
  const directory = join(output, 'stale');
  await mkdir(directory);
  await writeFile(join(directory, 'report.json'), JSON.stringify({ runId: 'stale', pages: [] }));
  const result = await audit('stale', ['--states', 'none']);
  assert.equal(result.code, 2, result.log);
  const report = JSON.parse(await readFile(join(directory, 'report.json'), 'utf8'));
  assert.notEqual(report.runId, 'stale');
  assert.ok(report.configErrors.length > 0);
});

test('accessible name belongs to the requested element, not a descendant', async () => {
  const page = await browser.newPage();
  try {
    await page.setContent('<div role="group"><button>Save</button></div>');
    assert.equal(await accNameMatches(page.getByRole('group'), 'Save'), false);
    assert.equal(await accNameMatches(page.getByRole('button'), 'Save'), true);
    await page.setContent('<button>Save</button><button>Save</button>');
    assert.equal(await accNameMatches(page.getByRole('button'), 'Save'), false);
  } finally {
    await page.close();
  }
});

test('an image referenced directly by aria-labelledby can provide its alt', async () => {
  const page = await browser.newPage();
  try {
    await page.setContent('<img id="label" alt="Save"><button aria-labelledby="label"></button>');
    assert.equal(await accNameMatches(page.getByRole('button'), 'Save'), true);
  } finally {
    await page.close();
  }
});
