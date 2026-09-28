// Minimal static file server for the task-pilot evaluator.
// Serves a target directory at / and (optionally) a fixtures directory at
// /__fixtures__/. No external dependencies — used instead of http-server so
// evaluation never relies on uncommitted tooling.
// Usage: node serve.mjs <dir> <port> [fixtureDir]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { statSync } from "node:fs";
import { join, normalize, extname, resolve, relative } from "node:path";

const [dirArg, portArg, fixtureDir] = process.argv.slice(2);
if (!dirArg || !portArg) {
  console.error("usage: node serve.mjs <dir> <port> [fixtureDir]");
  process.exit(2);
}
const ROOT = resolve(dirArg);
const FIXTURES = fixtureDir ? resolve(fixtureDir) : null;
const PORT = Number(portArg);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

function safePath(root, urlPath) {
  const p = normalize(join(root, decodeURIComponent(urlPath)));
  // path.relative containment — a sibling like /srv/app-evil whose name
  // shares the /srv/app prefix must NOT be accepted by a startsWith check.
  const rel = relative(root, p);
  if (rel === "") return root;
  if (rel === ".." || rel.startsWith(".." + "/") || resolve(rel) === rel) return null;
  return p;
}

const server = createServer(async (req, res) => {
  try {
    const u = new URL(req.url, "http://127.0.0.1");
    let filePath;
    if (FIXTURES && u.pathname.startsWith("/__fixtures__/")) {
      filePath = safePath(FIXTURES, u.pathname.slice("/__fixtures__".length));
    } else {
      filePath = safePath(ROOT, u.pathname);
    }
    if (!filePath) { res.writeHead(403); return res.end(); }
    let p = filePath;
    try { if (statSync(p).isDirectory()) p = join(p, "index.html"); } catch {}
    const body = await readFile(p);
    res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404); res.end();
  }
});

server.on("error", (err) => {
  console.error(`serve: port ${PORT} unavailable: ${err.code || err.message}`);
  process.exit(3); // occupied port must be fatal — never silently scan another server
});
server.listen(PORT, "127.0.0.1", () => {
  // Announce our PID + port so the caller can verify ownership.
  console.log(`serve pid=${process.pid} port=${PORT} root=${ROOT}`);
});
