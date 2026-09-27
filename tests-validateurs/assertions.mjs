/**
 * assertions.mjs — helpers d'assertions d'accessibilité DURCIES.
 *
 * Partagés par les scripts de vérification (verify.mjs, eval-final.mjs,
 * tests-validateurs/validateurs.mjs). Chaque helper applique les règles
 * SKILL.md 13-17 : effet observable (pas action), nom accessible CALCULÉ,
 * visibilité réelle (opacity incluse), élément requis absent = échec.
 */

/**
 * Nom accessible calculé d'un élément, via ariaSnapshot Playwright.
 * Retourne '' si l'élément n'existe pas ou n'a pas de nom.
 */
export async function accName(locator) {
  const snap = await locator.first().ariaSnapshot().catch(() => '');
  // Format "role \"name\"" ou "- role \"name\"" ; les guillemets échappés sont
  // décodés. Un élément sans nom produit juste "role" → ''.
  const m = snap.match(/"((?:[^"\\]|\\.)*)"/);
  return m ? m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\') : '';
}

/**
 * Nom accessible == attendu, sur LE locator fourni (pas la page entière —
 * un leurre portant le même nom ailleurs ne doit pas faire passer le test).
 * Si aria-labelledby est déclaré, chaque cible référencée doit exister ET
 * apporter du contenu accessible (texte, aria-label, ou alt d'image) :
 * une référence morte ou vide n'est pas un nom.
 */
export async function accNameMatches(locator, expected) {
  const el = locator.first();
  if (await el.count() === 0) return false;
  const name = await accName(el);
  if (name !== expected) return false;
  return el.evaluate((e) => {
    const ref = e.getAttribute('aria-labelledby');
    if (!ref) return true;
    return ref.trim().split(/\s+/).every((id) => {
      const t = document.getElementById(id);
      if (!t) return false;
      const accText = (t.getAttribute('aria-label') || '').trim()
        || Array.from(t.querySelectorAll('img')).map((i) => i.alt || '').join(' ').trim()
        || (t.textContent || '').trim();
      return accText.length > 0;
    });
  }).catch(() => false);
}

/**
 * Visibilité réelle : Playwright isVisible() ignore opacity:0 — une appli
 * rendue transparente passerait. On vérifie display/visibility/opacity
 * calculés + boîte englobante non vide.
 */
export async function isTrulyVisible(locator) {
  const el = locator.first();
  if (await el.count() === 0) return false;
  const visible = await el.isVisible().catch(() => false);
  if (!visible) return false;
  return el.evaluate((e) => {
    // opacity/visibility peuvent être posés sur un ancêtre — la computed style
    // de l'enfant ne les reflète pas (opacity n'est pas héritée). On remonte
    // toute la chaîne.
    for (let n = e; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.visibility === 'hidden' || cs.visibility === 'collapse') return false;
      if (parseFloat(cs.opacity) === 0) return false;
    }
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }).catch(() => false);
}

/**
 * Effet métier : une action a été exécutée ET a produit l'effet attendu.
 * `act` effectue l'action (click, selectOption…) ; `probe` mesure l'état
 * observable APRÈS coup. Jamais de catch muet : une exception = échec.
 *
 *   await effectObserved(page,
 *     (p) => p.selectOption('#filter', 'a'),
 *     (p) => p.$$eval('.res', els => els.filter(e => e.offsetParent).length === 1));
 */
export async function effectObserved(page, act, probe) {
  await act(page);            // lève si l'élément requis est absent
  return !!(await probe(page));
}
