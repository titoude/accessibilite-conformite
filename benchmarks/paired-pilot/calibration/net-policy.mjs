/**
 * net-policy.mjs — local-only request policy for the calibration runner.
 *
 * The calibration claims to replay fixtures OFFLINE: every byte the browser
 * loads must come from the local fixture server. This module defines that
 * policy so both the runner and its regression test use the same rule:
 *
 *   allowed   — requests to the local fixture server (127.0.0.1:<port>) and
 *               non-network schemes a page legitimately produces
 *               (about:, data:, blob:, chrome:, javascript:).
 *   aborted   — anything else (http(s) to another host, ws:, etc.). Aborted
 *               URLs are recorded per case as evidence, never silently
 *               dropped: a fixture that needs an external resource was NOT
 *               faithfully replayed offline.
 *
 * Static HTML classification (fetchExternalRefs): a fixture's fetched
 * external dependencies are tags/attributes the browser dereferences at load:
 *   - src= on any element (img, script, iframe, audio, video, source, ...)
 *   - href= ONLY on <link> (stylesheet/icon preloads are fetched)
 * Inert by contrast: href= on <a>/<area> (navigation only — clicking is never
 * simulated), action= on <form> (not submitted). Inert refs are recorded as
 * external_references (context), NOT dependencies.
 */
const EXT_TAG_ATTR = /<(\w+)[^>]*?\b(src|href)\s*=\s*"(https?:\/\/[^"]+)"/gi;

export function isLocalRequest(url, port) {
  const u = url.split('#')[0];
  if (/^(about|data|blob|chrome|javascript|file):/i.test(u)) return true;
  try {
    const p = new URL(u);
    return (p.hostname === '127.0.0.1' || p.hostname === 'localhost')
        && Number(p.port || 80) === Number(port);
  } catch { return false; }
}

export function fetchExternalRefs(html) {
  const fetched = [], inert = [];
  for (const m of html.matchAll(EXT_TAG_ATTR)) {
    const [, tag, attr, url] = m;
    const t = tag.toLowerCase();
    const isFetched = attr === 'src' || (attr === 'href' && t === 'link');
    (isFetched ? fetched : inert).push(url);
  }
  return { fetched: [...new Set(fetched)], inert: [...new Set(inert)] };
}
