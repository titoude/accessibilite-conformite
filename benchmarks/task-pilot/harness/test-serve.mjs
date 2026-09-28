// Local synthetic sentinels verify the static server's directory boundary.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { get } from "node:http";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { once } from "node:events";

test("static server serves its root and rejects encoded traversal", { timeout: 10000 }, async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "task-server-"));
  const root = join(dir, "public");
  await mkdir(root);
  await writeFile(join(root, "index.html"), "PUBLIC_CONTROL");
  await writeFile(join(dir, "outside.txt"), "OUTSIDE_SENTINEL");
  const server = spawn(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), "serve.mjs"), root, "0"], { stdio: ["ignore", "pipe", "pipe"] });
  t.after(async () => {
    if (server.exitCode === null) {
      const exited = once(server, "exit");
      server.kill();
      await exited;
    }
    assert.equal(dirname(dir), tmpdir(), "cleanup stays inside the temporary directory");
    await rm(dir, { recursive: true, force: true });
  });
  const port = await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.once("exit", (code) => reject(new Error(`server exited before listening: ${code}`)));
    server.stdout.once("data", (data) => {
      const match = data.toString().match(/port=(\d+)/);
      if (!match) reject(new Error("missing listening port"));
      else resolve(Number(match[1]));
    });
  });
  const request = (urlPath) => new Promise((resolve, reject) => {
    get({ hostname: "127.0.0.1", port, path: urlPath }, (res) => {
      let body = "";
      res.on("data", (data) => { body += data; });
      res.on("end", () => resolve({ status: res.statusCode, body }));
    }).on("error", reject);
  });
  assert.deepEqual(await request("/"), { status: 200, body: "PUBLIC_CONTROL" });
  for (const urlPath of ["/..%2foutside.txt", "/..%5coutside.txt"]) {
    const result = await request(urlPath);
    assert.ok([403, 404].includes(result.status), `${urlPath}: ${JSON.stringify(result)}`);
    assert.ok(!result.body.includes("OUTSIDE_SENTINEL"));
  }
});
