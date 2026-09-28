// Local-only request policy for the task-pilot evaluator.
// Same contract as benchmarks/paired-pilot/calibration/net-policy.mjs:
// only requests to the exact http://127.0.0.1:<port> origin are local;
// about:/data:/blob: are non-network and allowed. Everything else (file:,
// ws:, localhost aliases, any other host/port/scheme) is aborted and
// recorded — the evaluator gates affected checks instead of claiming a
// faithful offline replay.
const NON_NETWORK = /^(about|data|blob):/i;

export function isLocalRequest(url, port) {
  if (NON_NETWORK.test(url)) return true;
  let p;
  try { p = new URL(url); } catch { return false; }
  return p.protocol === "http:" && p.hostname === "127.0.0.1"
      && Number(p.port || 80) === Number(port);
}
