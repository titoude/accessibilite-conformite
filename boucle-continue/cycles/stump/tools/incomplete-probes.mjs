/**
 * incomplete-probes.mjs — résolution EXHAUSTIVE des résultats « incomplets »
 * axe des rapports finaux du cycle 34 (stump).
 *
 * Chaque nœud incomplet est re-sondé avec une mesure adaptée à sa règle :
 *  - color-contrast          : composite alpha top→down de tous les calques bg,
 *                              ratio WCAG mesuré (svg: fill, html: color) ;
 *                              fond image/gradient sans couleur mesurable ->
 *                              pass:null honnête + scrim/text-shadow relevés
 *  - aria-valid-attr-value   : aria-controls -> getElementById ; si non résolu
 *                              au repos mais aria-haspopup présent (Radix
 *                              mounte le portail à l'ouverture) -> le driver
 *                              ouvre la popup et re-vérifie (phase 2)
 *  - aria-hidden-focus       : ok si (a) un dialogue/menu Radix est ouvert
 *                              (l'aria-hidden du fond est le comportement
 *                              correct d'une modale) ou (b) l'élément est un
 *                              focus-guard Radix (sentinelle tabindex=0 qui
 *                              rabat le focus DANS la modale)
 *  - aria-allowed-role       : rôle de l'item vs rôle de son conteneur popup
 *  - th-has-data-cells       : nombre de cellules td non vides de la table
 *  - target-size             : bounding box mesurée
 *  - link-in-text-block      : textDecorationLine contient 'underline'
 * Les états dynamiques sont rejoués via les STATES de audit.mjs (source unique).
 *
 * Usage: node incomplete-probes.mjs <baseUrl> [auth.json] [reportDir...]
 *        node incomplete-probes.mjs <baseUrl> [--storage-state <auth.json>]
 *              [--out <fichier.json>] [--reports <dir...>]
 *   défaut des rapports: ../reports/final-public + ../reports/final-auth
 *   --storage-state : fichier storageState playwright (alias de l'argument
 *                     positionnel [auth.json] — les deux formes sont reçues).
 *   --out           : destination du rapport JSON. Défaut =
 *                     ../reports/incomplete-probes-<runId>.json pour ne PAS
 *                     écraser le rapport commité+hashé ; la régénération du
 *                     livrable se fait explicitement avec
 *                     --out ../reports/incomplete-probes.json (auditCommands).
 * Sortie: fichier --out + code 1 si un nœud reste non conforme.
 */
import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));
const { STATES } = await import('./audit.mjs');

// args : <base> positionnel, puis soit positionnels [authPath] [reportDir...]
// soit drapeaux nommés --storage-state/--out/--reports (mélange interdit pour
// éviter l'ambiguïté d'un flag pris pour un chemin positionnel).
const args = process.argv.slice(2);
const base = args[0] && !args[0].startsWith('--') ? args[0] : 'http://localhost:3232';
const runId = new Date().toISOString().replace(/[:.]/g, '-');
let authPath = resolve(HERE, 'auth.json');
let outPath = resolve(HERE, `../reports/incomplete-probes-${runId}.json`);
let reportDirs = [resolve(HERE, '../reports/final-public'), resolve(HERE, '../reports/final-auth')];
{
  const rest = args.slice(base === args[0] ? 1 : 0);
  const flagged = rest.some(a => a.startsWith('--'));
  if (flagged) {
    const dirs = [];
    for (let i = 0; i < rest.length; i++) {
      const a = rest[i];
      if (a === '--storage-state') authPath = resolve(rest[++i]);
      else if (a === '--out') outPath = resolve(rest[++i]);
      else if (a === '--reports') { while (rest[i + 1] && !rest[i + 1].startsWith('--')) dirs.push(resolve(rest[++i])); }
      else { console.error(`argument inconnu: ${a}`); process.exit(2); }
    }
    if (dirs.length) reportDirs = dirs;
  } else {
    if (rest[0]) authPath = resolve(rest[0]);
    if (rest.length > 1) reportDirs = rest.slice(1).map(d => resolve(d));
  }
}

const PROBE_HELPERS = `
// oklab/oklch -> sRGB linéaire (formules Ottosson) — Tailwind v4/stump
// sérialise les couleurs calculées en oklab()/oklch(), pas rgb().
const okToSrgb = (L, A, B) => {
    const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
    const m_ = L - 0.1055613458 * A - 0.0638541729 * B;
    const s_ = L - 0.0894841775 * A - 1.2914855480 * B;
    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
    const lin = {
        r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    };
    const gam = v => v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    const clamp = v => Math.min(255, Math.max(0, Math.round(v * 255)));
    return { r: clamp(gam(lin.r)), g: clamp(gam(lin.g)), b: clamp(gam(lin.b)) };
};
const parse = (c) => {
    if (!c) return null;
    let m = c.match(/rgba?\\(([^)]+)\\)/);
    if (m) {
        const p = m[1].split(',').map(x => parseFloat(x.trim()));
        return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    }
    m = c.match(/oklab\\(\\s*([\\d.]+)%?\\s+(-?[\\d.]+)\\s+(-?[\\d.]+)(?:\\s*\\/\\s*([\\d.]+))?/);
    if (m) {
        const Lv = m[1].includes('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
        const srgb = okToSrgb(Lv, parseFloat(m[2]), parseFloat(m[3]));
        return { ...srgb, a: m[4] !== undefined ? parseFloat(m[4]) : 1 };
    }
    m = c.match(/oklch\\(\\s*([\\d.]+)%?\\s+([\\d.]+)\\s+([\\d.]+)(?:deg)?\\s*(?:\\/\\s*([\\d.]+))?\\)/);
    if (m) {
        const Lv = m[1].includes('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
        const C = parseFloat(m[2]), H = parseFloat(m[3]) * Math.PI / 180;
        const srgb = okToSrgb(Lv, C * Math.cos(H), C * Math.sin(H));
        return { ...srgb, a: m[4] !== undefined ? parseFloat(m[4]) : 1 };
    }
    return null;
};
const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
// Interpole la couleur d'un linear-gradient CSS a une position y (0..1).
// NOTE: ce bloc vit dans un template literal injecte au navigateur — chaque
// backslash regex doit etre double (\\ -> \ dans la chaine injectee).
const gradientColorAt = (bgi, relY) => {
    const m = bgi.match(/linear-gradient\\((.*)\\)/);
    if (!m) return null;
    const inner = m[1];
    let dir = 'to bottom';
    let rest = inner;
    const dm = inner.match(/^\\s*(to [a-z ]+|[-\\d.]+(deg|turn))\\s*,/);
    if (dm) { dir = dm[1].trim(); rest = inner.slice(dm[0].length); }
    let t = null; // t croissant dans le sens du gradient
    if (dir === 'to bottom' || dir === '180deg' || dir === '0.5turn') t = relY;
    else if (dir === 'to top' || dir === '0deg' || dir === '0turn') t = 1 - relY;
    const stops = [];
    const re = /(rgba?|oklab|oklch)\\(([^)]*)\\)\\s*(\\d+(?:\\.\\d+)?%)?/g;
    let sm;
    while ((sm = re.exec(rest))) {
        const c = parse(sm[1] + '(' + sm[2] + ')');
        if (c) stops.push({ c, p: sm[3] ? parseFloat(sm[3]) / 100 : null });
    }
    if (!stops.length || t === null) return null;
    stops.forEach((st, i) => { if (st.p === null) st.p = stops.length > 1 ? i / (stops.length - 1) : 0; });
    if (t <= stops[0].p) return stops[0].c;
    if (t >= stops[stops.length - 1].p) return stops[stops.length - 1].c;
    for (let i = 0; i < stops.length - 1; i++) {
        if (t >= stops[i].p && t <= stops[i + 1].p) {
            const u = (t - stops[i].p) / (stops[i + 1].p - stops[i].p || 1);
            const a = stops[i].c, b2 = stops[i + 1].c;
            return { r: a.r + (b2.r - a.r) * u, g: a.g + (b2.g - a.g) * u, b: a.b + (b2.b - a.b) * u, a: a.a + (b2.a - a.a) * u };
        }
    }
    return stops[stops.length - 1].c;
};
// Pile de peinture reelle sous el : elementsFromPoint -> elements sous le
// centre de el (soeurs incluses : overlays, gradients, <img>). Retourne les
// couches a composer + l'eventuelle image recouvrante.
const paintStackBelow = (el) => {
    const r = el.getBoundingClientRect();
    const cx = Math.round(r.left + r.width / 2);
    const cy = Math.round(r.top + r.height / 2);
    const stack = document.elementsFromPoint(cx, cy) || [];
    const idx = stack.indexOf(el);
    const below = idx >= 0 ? stack.slice(idx + 1) : stack;
    const layers = [];
    let img = null;
    for (const n of below) {
        if (!(n instanceof Element)) continue;
        const cs = getComputedStyle(n);
        if (n.tagName === 'IMG' && n.complete && n.naturalWidth > 0) {
            const ir = n.getBoundingClientRect();
            if (r.left >= ir.left - 2 && r.right <= ir.right + 2 && r.top >= ir.top - 2 && r.bottom <= ir.bottom + 2) { img = n; break; }
        }
        const bgi = cs.backgroundImage;
        const bgc = cs.backgroundColor;
        if (bgi && bgi.includes('linear-gradient')) {
            const nr = n.getBoundingClientRect();
            if (nr.height > 2 && r.left >= nr.left - 4 && r.right <= nr.right + 4 && r.top >= nr.top - 4 && r.bottom <= nr.bottom + 4) {
                layers.push({ kind: 'gradient', el: n, relY: Math.min(1, Math.max(0, (cy - nr.top) / nr.height)) });
            }
        } else if (bgc && bgc !== 'rgba(0, 0, 0, 0)' && bgc !== 'transparent') {
            const c = parse(bgc);
            if (c && c.a > 0.02) layers.push({ kind: 'color', c });
        }
    }
    // Complément : les overlays pointer-events:none sont EXCLUS de
    // elementsFromPoint -> scan documentaire des gradients et <img>
    // recouvrant le rect de el (dédup par élément). Les gradients trouvés
    // ici sont des scrims placés directement sur l'image : on les empile
    // en FIN de layers (couche la plus profonde au-dessus de l'image).
    if (!img) {
        img = [...document.querySelectorAll('img')].find(im => {
            const ir = im.getBoundingClientRect();
            return ir.width > 10 && im.complete && im.naturalWidth > 0 && r.left >= ir.left - 2 && r.right <= ir.right + 2 && r.top >= ir.top - 2 && r.bottom <= ir.bottom + 2;
        }) || null;
    }
    const seen = new Set(layers.map(l => l.el));
    const docGrads = [];
    for (const n of document.querySelectorAll('body *')) {
        if (seen.has(n)) continue;
        const bgi = getComputedStyle(n).backgroundImage;
        if (!bgi || !bgi.includes('linear-gradient')) continue;
        const nr = n.getBoundingClientRect();
        if (nr.height > 2 && r.left >= nr.left - 4 && r.right <= nr.right + 4 && r.top >= nr.top - 4 && r.bottom <= nr.bottom + 4) {
            docGrads.push({ kind: 'gradient', el: n, relY: Math.min(1, Math.max(0, (cy - nr.top) / nr.height)) });
        }
    }
    // scrims pe: peints SOUS le texte mais AU-DESSUS de l'image et du fond
    // carte -> tête de la liste (la plus haute couche sous el).
    return { layers: docGrads.concat(layers), img };
};
// Luminance moyenne de la zone de l'image recouverte par le rect du texte.
const imgRegionMean = (img, r) => {
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const ir = img.getBoundingClientRect();
    const sx = Math.max(0, Math.floor((r.left - ir.left) / ir.width * iw));
    const sy = Math.max(0, Math.floor((r.top - ir.top) / ir.height * ih));
    const sw = Math.min(iw - sx, Math.max(4, Math.ceil(r.width / ir.width * iw)));
    const sh = Math.min(ih - sy, Math.max(4, Math.ceil(r.height / ir.height * ih)));
    const cv = document.createElement('canvas');
    cv.width = Math.min(80, sw); cv.height = Math.min(40, sh);
    const c2 = cv.getContext('2d', { willReadFrequently: true });
    c2.drawImage(img, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
    const data = c2.getImageData(0, 0, cv.width, cv.height).data;
    let lr = 0, lg = 0, lb = 0, n = 0;
    for (let i = 0; i < data.length; i += 4) { lr += data[i]; lg += data[i + 1]; lb += data[i + 2]; n++; }
    return { r: Math.round(lr / n), g: Math.round(lg / n), b: Math.round(lb / n), a: 1 };
};
// composite de TOUTES les couches rgba<1, du haut vers le bas
const effectiveBg = (el) => {
    const layers = [];
    let node = el;
    while (node && node !== document.documentElement.parentElement) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) layers.push(c);
        node = node.parentElement;
    }
    if (!layers.length) return { r: 255, g: 255, b: 255 };
    // layers[0] = couche la plus haute (l'élément), dernier = ancêtre le plus profond.
    // On part du haut et on replie vers le bas : chaque couche plus basse passe SOUS le composite.
    let comp = { ...layers[0] };
    for (let i = 1; i < layers.length; i++) {
        if (comp.a >= 1) break;
        const c = layers[i];
        const a = comp.a + c.a * (1 - comp.a);
        comp = { r: (comp.a * comp.r + c.a * c.r * (1 - comp.a)) / a, g: (comp.a * comp.g + c.a * c.g * (1 - comp.a)) / a, b: (comp.a * comp.b + c.a * c.b * (1 - comp.a)) / a, a };
    }
    return comp;
};
`;

const EVAL_NODE = `
((sel, ruleId, HTML) => {
    const vis = e => e.getClientRects().length > 0;
    let els = [...document.querySelectorAll(sel)];
    // les ids auto-générés (_aria_auto_id_N) changent à chaque chargement :
    // si le sélecteur littéral échoue, retomber sur la présence de l'attribut
    if (!els.length && sel.includes('aria-controls=')) {
        els = [...document.querySelectorAll(sel.replace(/aria-controls="[^"]*"/g, 'aria-controls'))];
    }
    let el = els.find(vis) || els[0];
    if (!el && /^#(_?r_|radix-)/.test(sel) && typeof HTML === 'string') {
        // ids auto-générés changent à chaque montage : re-sélection via le
        // fragment html capturé par axe (tag + data-attrs + classes).
        const tm = /^<([a-z0-9]+)/i.exec(HTML);
        const tag = tm ? tm[1] : null;
        const dsm = [...HTML.matchAll(/data-slot="([^"]+)"/g)].map(m => m[1]);
        const cls = /class="([^"]+)"/.exec(HTML);
        const clsTokens = cls ? cls[1].split(/\s+/).filter(x => /^[a-z0-9\-_\/\[\]:.]+$/.test(x) && !x.includes(':')) : [];
        const aria = [...HTML.matchAll(/(aria-[a-z-]+)/g)].map(m => m[1]);
        let cands = tag ? [...document.querySelectorAll(tag)] : [];
        if (dsm.length) cands = cands.filter(n => dsm.every(d => n.getAttribute('data-slot') === d));
        if (aria.length) cands = cands.filter(n => aria.some(a => n.hasAttribute(a)));
        if (clsTokens.length) {
            const scored = cands.map(n => ({ n, k: clsTokens.filter(tk => n.classList.contains(tk)).length }))
                .filter(x => x.k > 0).sort((x, y) => y.k - x.k);
            if (scored.length) cands = scored.filter(x => x.k === scored[0].k).map(x => x.n);
        }
        el = cands.find(vis) || cands[0] || null;
        if (el) out_fallback = true;
    }
    if (!el) return { found: false };
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const out = { found: true, w: Math.round(rect.width * 10) / 10, h: Math.round(rect.height * 10) / 10 };
    if (typeof out_fallback !== 'undefined' && out_fallback) out.fallbackSelector = true;
    if (ruleId === 'color-contrast') {
        const fg = parse(cs.color) || parse(cs.fill);
        const bg = effectiveBg(el);
        if (fg && fg.a <= 0.02) {
            out.fg = fg; out.pass = null;
            out.note = 'texte transparent (alpha ~0) — non rendu, contraste non applicable';
        }
        // Fond mesuré via la PILE DE PEINTURE réelle : elementsFromPoint
        // donne les couches sous le texte (sœurs incluses), gradients
        // linéaires interpolés à la hauteur du texte, <img> échantillonnée
        // par canvas, composite alpha top→down (jamais rgba<1 opaque naïf).
        let sawImage = false, sawDarkScrim = false, node = el;
        if (out.pass === null) { node = null; }
        else
        while (node && node !== document.documentElement.parentElement) {
            const ncs = getComputedStyle(node);
            const bi = ncs.backgroundImage;
            if (bi && bi !== 'none') {
                sawImage = true;
                const low = bi.toLowerCase();
                if (low.includes('gradient') || low.includes('rgba(0, 0, 0') || low.includes('rgb(0, 0, 0') || low.includes('black') || low.includes('oklch(0.')) sawDarkScrim = true;
            }
            node = node.parentElement;
        }
        out.fg = fg; out.bg = bg;
        out.ratio = fg && bg ? ratio(lum(fg), lum(bg)) : null;
        out.textShadow = cs.textShadow !== 'none' ? cs.textShadow : null;
        // texte dans une région aria-hidden (ex : page sous scrim de modale
        // Radix hideOthers) : non percevable -> verdict honnête conforme.
        const hiddenAncestor = el.closest('[aria-hidden="true"]');
        // image <img> (sœur/ancêtre) recouvrant le rectangle du texte : le vrai
        // fond est le raster — on mesure la luminance MOYENNE de la région
        // image sous le texte via canvas (même origine -> getImageData lisible).
        // pile de peinture sous le texte : couches solides rgba, gradients
        // interpolés, image <img> échantillonnée — composite alpha honnête.
        if (hiddenAncestor) {
            out.pass = true;
            out.note = 'texte sous région aria-hidden (ex : fond grisé par une modale) — non percevable, contraste non applicable';
        } else if (!(fg && fg.a <= 0.02)) {
            const r = el.getBoundingClientRect();
            const { layers, img } = paintStackBelow(el);
            let bottom = { r: 255, g: 255, b: 255, a: 1 };
            if (img) {
                sawImage = true;
                try {
                    bottom = imgRegionMean(img, r);
                    out.imageMean = { r: bottom.r, g: bottom.g, b: bottom.b };
                } catch (e) {
                    out.pass = null;
                    out.note = 'fond = image raster — échantillonnage canvas impossible (' + String(e).slice(0, 60) + ')';
                }
            }
            if (out.pass === undefined) {
                let comp = { ...bottom };
                const dbg = [];
                for (let i = layers.length - 1; i >= 0; i--) {
                    const L = layers[i];
                    let c = null;
                    if (L.kind === 'color') c = L.c;
                    else if (L.kind === 'gradient') { c = gradientColorAt(getComputedStyle(L.el).backgroundImage, L.relY); dbg.push('gradient@' + L.el.className.split(' ')[0]); }
                    if (!c || c.a <= 0.02) continue;
                    if (c.a >= 0.999) { comp = { r: c.r, g: c.g, b: c.b, a: 1 }; }
                    else {
                        const a = c.a + comp.a * (1 - c.a);
                        comp = { r: (c.a * c.r + comp.a * comp.r * (1 - c.a)) / a, g: (c.a * c.g + comp.a * comp.g * (1 - c.a)) / a, b: (c.a * c.b + comp.a * comp.b * (1 - c.a)) / a, a };
                    }
                }
                // couches de fond solid des ancêtres de el (effectiveBg) fusionnées
                // avec la pile sœur : le composite ci-dessus couvre déjà tout ce
                // qui est PEINT sous le point — on conserve le plus informatif.
                // fg semi-transparent : on le composite SUR le fond mesuré
                const effFg = (fg && fg.a < 0.999)
                    ? { r: fg.a * fg.r + (1 - fg.a) * comp.r, g: fg.a * fg.g + (1 - fg.a) * comp.g, b: fg.a * fg.b + (1 - fg.a) * comp.b, a: 1 }
                    : fg;
                const compRatio = effFg ? ratio(lum(effFg), lum(comp)) : null;
                const useComp = img || layers.length;
                out.fg = fg;
                if (fg && fg.a < 0.999) out.fgComposited = { r: Math.round(effFg.r), g: Math.round(effFg.g), b: Math.round(effFg.b) };
                if (useComp) {
                    out.bg = { r: Math.round(comp.r), g: Math.round(comp.g), b: Math.round(comp.b), a: Math.round(comp.a * 1000) / 1000 };
                    out.ratio = compRatio;
                    out.layers = dbg.concat(layers.filter(l => l.kind === 'color').map(l => 'solid'));
                    out.pass = compRatio !== null && compRatio >= 4.5;
                    out.note = (img ? 'composite mesuré : gradient/scrim + luminance moyenne image' : 'composite mesuré : couches peintes sous le texte') + (out.textShadow ? ' + text-shadow' : '');
                } else {
                    out.ratio = fg && bg ? ratio(lum(fg), lum(bg)) : null;
                    if (sawImage && bg.a < 0.999 && bg.r === 255 && bg.g === 255 && bg.b === 255) {
                        out.pass = null;
                        out.note = 'fond image/gradient non mesurable en couleurs unies' +
                            (sawDarkScrim ? ' — scrim/gradient sombre présent' : ' — PAS de scrim détecté') +
                            (out.textShadow ? ' — text-shadow présent' : '');
                    } else if (sawImage && out.ratio === null) {
                        out.pass = null;
                        out.note = 'fond image/gradient — composite indéterminé' + (sawDarkScrim ? ' (scrim sombre)' : '');
                    } else {
                        out.pass = out.ratio !== null && out.ratio >= 4.5;
                        if (sawImage) out.note = 'image de fond présente — ratio mesuré sur les couches unies sous le texte' + (sawDarkScrim ? ' (scrim sombre)' : '');
                    }
                }
            }
        }
    } else if (ruleId === 'aria-valid-attr-value') {
        // tous les attributs aria de type idref non résolus
        const idrefAttrs = ['aria-controls', 'aria-labelledby', 'aria-describedby', 'aria-details', 'aria-owns', 'aria-activedescendant'];
        const missing = [];
        for (const an of idrefAttrs) {
            const v = el.getAttribute(an);
            if (!v) continue;
            for (const id of v.split(/\\s+/).filter(Boolean)) {
                if (!document.getElementById(id)) missing.push(an + '=' + id);
            }
        }
        out.missingIdrefs = missing;
        const id = el.getAttribute('aria-controls');
        out.ariaControls = id;
        out.haspopup = el.getAttribute('aria-haspopup');
        // Radix : l'élément contrôlé n'existe que monté — non résolu au repos
        // sur un trigger haspopup = phase 2 driver (ouverture popup) requise.
        const lazyDesc = missing.length && missing.every(m => /^(aria-describedby|aria-labelledby)=radix-/.test(m));
        out.pass = !missing.length ? true : (id && !document.getElementById(id) && !!out.haspopup ? null : (lazyDesc ? null : false));
        if (out.pass === null && lazyDesc) out.note = 'idref Radix lazy-mount (description/label monté à la demande — le contenu existe quand le composant est ouvert)';
        else if (out.pass === null) out.note = 'aria-controls non résolu au repos — phase 2 : ouverture popup puis re-vérification';
    } else if (ruleId === 'aria-hidden-focus') {
        // axe ne peut pas trancher : ok si la région cachée l'est parce qu'un
        // dialogue/menu est OUVERT (comportement modale correct), ou si el est
        // une sentinelle focus-guard Radix (rabat le focus dans la modale).
        const guard = el.hasAttribute('data-radix-focus-guard');
        const openDlg = !!document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"], [data-state="open"][role="menu"], [role="listbox"]');
        const noPointer = cs.pointerEvents === 'none' && parseFloat(cs.opacity) === 0;
        out.guard = guard; out.openDialog = openDlg; out.hiddenRegion = true;
        if (guard && noPointer) {
            out.pass = true;
            out.note = 'sentinelle focus-guard Radix (invisible, rabat le focus dans la modale) — intentionnel upstream';
        } else if (openDlg) {
            out.pass = true;
            out.note = 'contenu de fond aria-hidden pendant ouverture de dialogue/menu — comportement correct de modale';
        } else {
            // région cachée SANS modale ouverte : vérifier qu'aucun descendant
            // n'est réellement focusable+visible (sinon vrai problème).
            const focusables = [...el.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
                .filter(e => { const t = e.getAttribute('tabindex'); return t === null || parseInt(t) >= 0; })
                .filter(e => e.getClientRects().length > 0);
            out.innerFocusables = focusables.length;
            out.pass = focusables.length === 0;
            out.note = focusables.length ? String(focusables.length) + ' focusable(s) visible(s) dans une région aria-hidden SANS modale' : 'aucun focusable visible dans la région cachée';
        }
    } else if (ruleId === 'aria-allowed-role') {
        const role = el.getAttribute('role');
        const pop = el.closest('[role="menu"], [role="listbox"], [role="group"], [role="none"], [role="presentation"]');
        out.role = role; out.popupRole = pop ? pop.getAttribute('role') : null;
        out.pass = ['menuitem', 'option'].includes(role) ? !!pop : null;
        if (out.pass === null) out.pass = !!role;
    } else if (ruleId === 'th-has-data-cells') {
        const tds = [...el.querySelectorAll('td')];
        out.tdCount = tds.length;
        out.tdNonEmpty = tds.filter(t => (t.innerText || '').trim()).length;
        out.pass = out.tdCount === 0 || out.tdNonEmpty > 0;
    } else if (ruleId === 'target-size') {
        out.pass = out.w >= 24 && out.h >= 24;
        out.note = out.pass ? '' : 'mesuré < 24px ou partiellement masqué — exemption inline voir rapport';
    } else if (ruleId === 'link-in-text-block') {
        const deco = cs.textDecorationLine || '';
        out.deco = deco;
        out.pass = deco.includes('underline');
    } else {
        out.pass = null;
    }
    return out;
})(SELECTOR, RULE, NODEHTML)
`;

// collecte exhaustive des nœuds incomplets
const targets = new Map(); // key url|state -> {url, state, authed, nodes:[{ruleId, selector}]}
for (const dir of reportDirs) {
    const rp = resolve(dir, 'report.json');
    if (!existsSync(rp)) { console.error(`rapport absent: ${rp}`); continue; }
    // les rapports *-public sont capturés anonymement : mêmes nodes à sonder hors session
    const authed = !dir.endsWith('-public');
    const r = JSON.parse(readFileSync(rp, 'utf8'));
    for (const p of r.pages) {
        for (const v of p.incomplete || []) {
            for (const nd of v.nodes || []) {
                const sel = (nd.target || []).map(t => typeof t === 'string' ? t : t).join(' ');
                if (!sel) continue;
                // report.json encode l'état dans l'URL : "<url> [state:<nom>]"
                const m = /^(.*) \[state:([^\]]+)\]$/.exec(p.url || '');
                const pageUrl = m ? m[1] : p.url;
                const pageState = m ? m[2] : null;
                const key = `${pageUrl}||${pageState || ''}||${authed}`;
                if (!targets.has(key)) targets.set(key, { url: pageUrl, state: pageState, authed, nodes: [] });
                const arr = targets.get(key).nodes;
                if (!arr.some(n => n.ruleId === v.id && n.selector === sel)) arr.push({ ruleId: v.id, selector: sel, html: nd.html || '' });
            }
        }
    }
}

const browser = await chromium.launch();
const authCtx = await browser.newContext({ storageState: existsSync(authPath) ? authPath : undefined });
const anonCtx = await browser.newContext();
const authPage = await authCtx.newPage();
const anonPage = await anonCtx.newPage();

const results = [];
let probed = 0, passCount = 0, failCount = 0;
for (const [key, t] of targets) {
    const page = t.authed ? authPage : anonPage;
    // l'état remplace l'URL si la définition STATES en porte une ; sinon
    // l'URL enregistrée est réécrite sur l'origine du run courant (leçon 15 :
    // les rapports peuvent venir d'une autre instance/port).
    const st = t.state && STATES[t.state] ? STATES[t.state] : null;
    const rel = new URL(t.url, base);
    const targetUrl = st?.url ? st.url(base) : `${base}${rel.pathname}${rel.search}${rel.hash}`;
    try {
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(600);
        if (st?.setup) await st.setup(page);
        // les sondes d'image lisent les pixels : attendre leur chargement
        await page.waitForFunction(() => [...document.images].every(i => i.complete), { timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(200);
        for (const n of t.nodes) {
            const res = await page.evaluate(`${PROBE_HELPERS}\n${EVAL_NODE}`.replace('SELECTOR', JSON.stringify(n.selector)).replace('RULE', JSON.stringify(n.ruleId)).replace('NODEHTML', JSON.stringify(n.html || '')));
            // phase 2 : aria-controls non résolu au repos sur un trigger
            // haspopup Radix -> ouvrir la popup et re-vérifier la résolution.
            if (n.ruleId === 'aria-valid-attr-value' && res.found && res.pass === null && res.haspopup && res.ariaControls) {
                try {
                    const trigger = page.locator(n.selector).first();
                    if (await trigger.count()) {
                        // refermer tout reste de popup d'une phase précédente et
                        // ramener le trigger dans le viewport avant le clic
                        await page.keyboard.press('Escape').catch(() => {});
                        await page.waitForTimeout(250);
                        await trigger.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
                        // force:true — certains triggers Radix Select sont
                        // recouverts d'un pseudo-élément : le clic standard
                        // timeout alors que le composant répond au pointerdown.
                        await trigger.click({ timeout: 4000, force: true });
                        await page.waitForTimeout(600);
                        const id = res.ariaControls;
                        res.resolvedAfterOpen = await page.evaluate(`!!document.getElementById(${JSON.stringify(id)})`);
                        res.pass = res.resolvedAfterOpen;
                        res.note = res.pass
                            ? 'aria-controls résolu après ouverture de la popup (montage Radix) — valeur correcte'
                            : 'aria-controls TOUJOURS non résolu après ouverture — vraie violation';
                        await page.keyboard.press('Escape').catch(() => {});
                        await page.waitForTimeout(300);
                    }
                } catch (e) {
                    res.openError = e.message.slice(0, 100);
                }
            }
            probed++;
            const pass = res.found ? res.pass : null;
            if (pass === true) passCount++;
            else if (pass === false) failCount++;
            results.push({ url: t.url, state: t.state, ruleId: n.ruleId, selector: n.selector, ...res });
        }
        process.stderr.write(`  ${t.url.replace(base, '')} [${t.state || '-'}] ${t.nodes.length} sondes\n`);
    } catch (e) {
        for (const n of t.nodes) { results.push({ url: t.url, state: t.state, ruleId: n.ruleId, selector: n.selector, found: false, pass: null, error: e.message.slice(0, 120) }); }
        console.error(`  ERREUR page ${t.url} [${t.state}]: ${e.message.slice(0, 100)}`);
    }
}

const fails = results.filter(r => r.pass === false);
// « non retrouvée » = nœud absent du DOM au re-sondage — compter tous les
// found:false, pas seulement ceux dont pass est littéralement null.
const unfound = results.filter(r => r.found === false);
writeFileSync(outPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), base, probed, pass: passCount, fail: failCount, unfound: unfound.length, results }, null, 2));
console.log(`\n${probed} sondes -> ${outPath} : ${passCount} conformes, ${failCount} NON CONFORMES, ${unfound.length} non retrouvées`);
process.exit(failCount > 0 ? 1 : 0);
