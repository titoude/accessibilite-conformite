/**
 * net-policy.mjs — local-only request policy for the calibration runner.
 *
 * The calibration claims to replay fixtures OFFLINE: every byte the browser
 * loads must come from the exact local fixture origin. This module defines
 * that policy so both the runner and its regression test use the same rule:
 *
 *   allowed   — requests to the exact fixture origin
 *               http://127.0.0.1:<port>/... — nothing else over the network
 *               (no localhost alias, no other port, no ws:, no file:),
 *               plus the non-network schemes a page legitimately produces:
 *               about: (about:blank), data:, blob:.
 *   aborted   — anything else. Aborted URLs are recorded per case as
 *               evidence AND gate the case to unsupported_external_dependency
 *               in the runner: a fixture that attempted to reach the network
 *               was NOT faithfully replayed offline, whether or not a static
 *               regex saw the reference first.
 *
 * Static HTML classification (fetchExternalRefs): a fixture's fetched
 * external dependencies are tags/attributes the browser dereferences at load:
 *   - src= on any element (img, script, iframe, audio, video, source, ...)
 *   - href= ONLY on <link> (stylesheet/icon preloads are fetched)
 * Inert by contrast: href= on <a>/<area> (navigation only — clicking is never
 * simulated), action= on <form> (not submitted). Inert refs are recorded as
 * external_references_inert (context), NOT dependencies. Static regexes are a
 * pre-filter only — the route interceptor is the authoritative gate, because
 * CSS url(), dynamic scripts and inline handlers can miss the regex.
 */
const EXT_TAG_ATTR = /<(\w+)[^>]*?\b(src|href)\s*=\s*"(https?:\/\/[^"]+)"/gi;
const NON_NETWORK = /^(about|data|blob):/i;

export function isLocalRequest(url, port) {
  if (NON_NETWORK.test(url)) return true;
  let p;
  try { p = new URL(url); } catch { return false; }
  return p.protocol === 'http:' && p.hostname === '127.0.0.1'
      && Number(p.port || 80) === Number(port);
}

export function fetchExternalRefs(html) {
  const fetched = [], inert = [];
  for (const m of html.matchAll(EXT_TAG_ATTR)) {
    const [, tag, attr, url] = m;
    const isFetched = attr === 'src' || (attr === 'href' && tag.toLowerCase() === 'link');
    (isFetched ? fetched : inert).push(url);
  }
  return { fetched: [...new Set(fetched)], inert: [...new Set(inert)] };
}
