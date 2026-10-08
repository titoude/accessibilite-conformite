<?php
/**
 * seed.php — cycle 57 dolibarr. Seed REJOUABLE via les classes Dolibarr
 * (vrai code métier, pas des inserts SQL directs). Exécuté dans le conteneur :
 *   docker exec -w /var/www/html/htdocs doli57-web php /tools/seed.php
 * Sortie : JSON seed-info sur stdout (capturé -> tools/seed-info.json côté host).
 * Idempotent-défensif : refuse de tourner si des entités seed existent déjà.
 *
 * v2 (fixer cycle 57) :
 *  - getRights() APRES l'activation des modules + setValues() : sinon user 1
 *    n'a pas facture->creer et validate() échoue « Permission denied ».
 *  - Les statuts critiques sont RE-LUS en base (fk_statut), pas crus sur le
 *    code retour — un échec de validate/setPaid = erreur + exit != 0.
 *  - Ids émis explicitement : facture_validee_id / facture_payee_id /
 *    facture_draft_ids — fini la déduction « celui qui n'est pas validé ».
 */
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
define('NOCSRFCHECK', 1);
define('NOTOKENRENEWAL', 1);
define('NOREQUIREMENU', 1);
define('NOREQUIREHTML', 1);
define('NOREQUIREAJAX', 1);
require 'master.inc.php';
require_once DOL_DOCUMENT_ROOT.'/user/class/user.class.php';
require_once DOL_DOCUMENT_ROOT.'/societe/class/societe.class.php';
require_once DOL_DOCUMENT_ROOT.'/product/class/product.class.php';
require_once DOL_DOCUMENT_ROOT.'/compta/facture/class/facture.class.php';
require_once DOL_DOCUMENT_ROOT.'/comm/propal/class/propal.class.php';
require_once DOL_DOCUMENT_ROOT.'/commande/class/commande.class.php';
require_once DOL_DOCUMENT_ROOT.'/contact/class/contact.class.php';
require_once DOL_DOCUMENT_ROOT.'/projet/class/project.class.php';
require_once DOL_DOCUMENT_ROOT.'/projet/class/task.class.php';

$out = ['ok' => true, 'errors' => []];
$admin = new User($db);
if ($admin->fetch(1) <= 0) { $out['errors'][] = 'admin fetch KO'; emit($out); }

// ---------- activation des modules AVANT getRights (leçon cycle 57 : les
// droits dépendent des modules actifs — getRights trop tôt = validate KO) ----------
$mods = ['Societe','User','Product','Service','Propale','Commande','Facture','Projet',
         'Agenda','Banque','Expedition','Export','Import','Fournisseur','Stock','Ticket','Fckeditor'];
foreach ($mods as $m) {
  $const = 'MAIN_MODULE_'.strtoupper($m);
  if (getDolGlobalString($const)) continue;
  $file = DOL_DOCUMENT_ROOT.'/core/modules/mod'.$m.'.class.php';
  if (!file_exists($file)) { $out['errors'][] = "module $m : fichier absent"; continue; }
  require_once $file;
  $cls = 'mod'.$m;
  if (!class_exists($cls)) { $out['errors'][] = "module $m : classe absente"; continue; }
  $obj = new $cls($db);
  $r = $obj->init(0);
  if ($r <= 0) { $out['errors'][] = "module $m init KO ($r)"; }
}
$conf->setValues($db); // recharge les confs/modules activés
$admin->getRights(); // APRÈS activation — sinon validate facture : « Permission denied »

// garde anti-double-seed
$chk = $db->query("SELECT rowid FROM ".$db->prefix()."societe WHERE nom LIKE 'A11Y %' LIMIT 1");
if ($chk && $db->num_rows($chk) > 0) { $out['errors'][] = 'seed déjà appliqué (llx_societe A11Y % présent)'; emit($out); }

// ---------- utilisateur non-admin ----------
$u = new User($db);
$u->login = 'jdupont'; $u->lastname = 'Dupont'; $u->firstname = 'Jean';
$u->email = 'jdupont@example.com'; $u->admin = 0; $u->statut = 1;
$u->pass = 'Doli57-User-2026';
$r = $u->create($admin);
if ($r <= 0) { $out['errors'][] = 'user jdupont: '.$u->error; } else { $out['user_ids'][] = $r; }

// ---------- tiers (clients + 1 fournisseur) ----------
$socs = [
  ['A11Y Acme Industries', 1, 0, 'contact@acme.example', '21 rue des Lilas', '75011', 'Paris'],
  ['A11Y Beta Services', 1, 0, 'hello@beta.example', '8 av. Victor Hugo', '69002', 'Lyon'],
  ['A11Y Gamma Fournitures', 1, 1, 'achat@gamma.example', '3 bd Haussmann', '33000', 'Bordeaux'],
];
$socIds = [];
foreach ($socs as $sd) {
  $s = new Societe($db);
  $s->name = $sd[0]; $s->client = $sd[1]; $s->fournisseur = $sd[2];
  $s->email = $sd[3]; $s->address = $sd[4]; $s->zip = $sd[5]; $s->town = $sd[6];
  $s->code_client = -1; $s->code_fournisseur = -1;
  $s->phone = '0102030405'; $s->url = 'https://example.com';
  $s->note_public = 'Compte seed a11y — données de bench reproductibles.';
  $r = $s->create($admin);
  if ($r <= 0) { $out['errors'][] = 'societe '.$sd[0].': '.$s->error; continue; }
  $socIds[] = $r;
}
$out['societe_ids'] = $socIds;

// contact sur le 1er tiers
if (!empty($socIds[0])) {
  $c = new Contact($db);
  $c->lastname = 'Martin'; $c->firstname = 'Claire'; $c->socid = $socIds[0];
  $c->email = 'cmartin@acme.example'; $c->phone_pro = '0612345678';
  $r = $c->create($admin);
  if ($r > 0) { $out['contact_ids'][] = $r; } else { $out['errors'][] = 'contact: '.$c->error; }
}

// ---------- produits (3 physiques + 2 services) ----------
$prods = [
  ['A11Y-PROD-1', 'Widget standard', 0, 120.00, 20],
  ['A11Y-PROD-2', 'Widget premium', 0, 450.50, 20],
  ['A11Y-PROD-3', 'Accessoire C', 0, 19.90, 20],
  ['A11Y-SERV-1', 'Heure de conseil', 1, 95.00, 20],
  ['A11Y-SERV-2', 'Formation initiale', 1, 890.00, 20],
];
$prodIds = [];
foreach ($prods as $pd) {
  $p = new Product($db);
  $p->ref = $pd[0]; $p->label = $pd[1]; $p->type = $pd[2];
  $p->price = $pd[3]; $p->price_base_type = 'HT'; $p->tva_tx = $pd[4];
  $p->status = 1; $p->status_buy = 1;
  $p->description = 'Description '.$pd[1].' — seed a11y reproductible.';
  $r = $p->create($admin);
  if ($r <= 0) { $out['errors'][] = 'product '.$pd[0].': '.$p->error; continue; }
  $prodIds[] = $r;
}
$out['product_ids'] = $prodIds;

// ---------- propales ----------
$propIds = [];
foreach ([[$socIds[0] ?? 0, 'DraftPropal1'], [$socIds[1] ?? 0, 'DraftPropal2']] as $i => $ps) {
  if (empty($ps[0])) continue;
  $pr = new Propal($db);
  $pr->socid = $ps[0]; $pr->ref_client = 'REF-CLI-'.($i+1);
  $pr->date = dol_now(); $pr->fin_validite = dol_now() + 30*86400;
  $r = $pr->create($admin);
  if ($r <= 0) { $out['errors'][] = 'propal: '.$pr->error; continue; }
  if (!empty($prodIds[0])) $pr->addline('Ligne propale '.($i+1), 100.0, 2, 20, 0, 0, $prodIds[0]);
  $propIds[] = $r;
}
$out['propal_ids'] = $propIds;

// ---------- commandes ----------
$cmdIds = [];
foreach ([$socIds[0] ?? 0, $socIds[1] ?? 0] as $i => $sid) {
  if (empty($sid)) continue;
  $o = new Commande($db);
  $o->socid = $sid; $o->ref_client = 'CMD-CLI-'.($i+1); $o->date = dol_now();
  $r = $o->create($admin);
  if ($r <= 0) { $out['errors'][] = 'commande: '.$o->error; continue; }
  if (!empty($prodIds[0])) $o->addline('Ligne commande '.($i+1), 75.0, 3, 20, 0, 0, $prodIds[0]);
  $cmdIds[] = $r;
}
$out['commande_ids'] = $cmdIds;

// ---------- factures : 1 par tiers — #1 VALIDÉE, #2 VALIDÉE+PAYÉE, #3 brouillon ----------
$factIds = []; $factureValidee = 0; $facturePayee = 0;
foreach ($socIds as $i => $sid) {
  $f = new Facture($db);
  $f->socid = $sid; $f->ref_client = 'FA-CLI-'.($i+1);
  $f->date = dol_now() - ($i * 5 * 86400);
  $f->note_public = 'Facture seed a11y '.($i+1);
  $r = $f->create($admin);
  if ($r <= 0) { $out['errors'][] = 'facture soc '.$sid.': '.$f->error; continue; }
  $factIds[] = $r;
  $f->addline('Prestation '.($i+1).' — consulting', 500.0 + $i * 100, 1, 20, 0, 0, $prodIds[3] ?? 0);
  $f->addline('Produit '.($i+1), $prods[$i % count($prods)][3], 2, 20, 0, 0, $prodIds[$i % count($prodIds)] ?? 0);
}
// vérification DURE du statut en base — le code retour seul ne suffit pas
$fkStatut = function ($facid) use ($db) {
  $q = $db->query("SELECT fk_statut, ref, paye FROM ".$db->prefix()."facture WHERE rowid=".(int) $facid);
  $row = $q ? $db->fetch_object($q) : null;
  return $row ? ['statut' => (int) $row->fk_statut, 'ref' => $row->ref, 'paye' => (int) $row->paye] : null;
};
// #1 : validée (PROV -> ref réelle via le module de numérotation)
if (!empty($factIds[0])) {
  $fv = new Facture($db);
  if ($fv->fetch($factIds[0]) > 0) {
    $rv = $fv->validate($admin);
    $st = $fkStatut($factIds[0]);
    if ($rv <= 0 || !$st || $st['statut'] !== 1) {
      $out['errors'][] = 'validate facture '.$factIds[0].' KO: ret='.$rv.' err='.($fv->error ?: '-').' fk_statut='.($st ? $st['statut'] : 'NULL');
    } else {
      $factureValidee = $factIds[0];
      $out['facture_validated_ref'] = $st['ref'];
    }
  } else { $out['errors'][] = 'fetch facture '.$factIds[0].' KO'; }
}
// #2 : validée + payée (exerce le badge « Paid » en liste)
if (!empty($factIds[1])) {
  $fp = new Facture($db);
  if ($fp->fetch($factIds[1]) > 0) {
    $rv = $fp->validate($admin);
    if ($rv <= 0) {
      $out['errors'][] = 'validate facture '.$factIds[1].' KO: ret='.$rv.' err='.($fp->error ?: '-');
    } else {
      $rp = $fp->setPaid($admin);
      $st = $fkStatut($factIds[1]);
      if ($rp <= 0 || !$st || $st['statut'] !== 2 || $st['paye'] !== 1) {
        $out['errors'][] = 'setPaid facture '.$factIds[1].' KO: ret='.$rp.' err='.($fp->error ?: '-').' fk_statut='.($st ? $st['statut'] : 'NULL').' paye='.($st ? $st['paye'] : 'NULL');
      } else {
        $facturePayee = $factIds[1];
        $out['facture_paid_ref'] = $st['ref'];
      }
    }
  } else { $out['errors'][] = 'fetch facture '.$factIds[1].' KO'; }
}
$factureDrafts = array_values(array_diff($factIds, [$factureValidee, $facturePayee]));
$out['facture_ids'] = $factIds;
$out['facture_validee_id'] = $factureValidee;
$out['facture_payee_id'] = $facturePayee;
$out['facture_draft_ids'] = $factureDrafts;
$out['facture_draft_id'] = $factureDrafts[0] ?? 0;

// ---------- projet + tâche ----------
$pj = new Project($db);
$pj->ref = 'A11Y-PJ01';
$pj->title = 'A11Y Projet Demo'; $pj->socid = $socIds[0] ?? 0;
$pj->description = 'Projet seed a11y.';
$rpj = $pj->create($admin);
if ($rpj > 0) {
  $out['project_id'] = $rpj;
  $tk = new Task($db);
  $tk->fk_project = $rpj; $tk->ref = 'TK01'; $tk->label = 'Tâche de démonstration';
  $rtk = $tk->create($admin);
  if ($rtk > 0) $out['task_id'] = $rtk; else $out['errors'][] = 'task: '.$tk->error;
} else { $out['errors'][] = 'project: '.$pj->error; }

// ---------- paramètres de confort : company info FR pour éviter les warnings ----------
$sets = [
  'MAIN_INFO_SOCIETE_NOM' => 'A11Y Bench SARL',
  'MAIN_INFO_SOCIETE_ADDRESS' => '1 rue du Bench',
  'MAIN_INFO_SOCIETE_ZIP' => '75001',
  'MAIN_INFO_SOCIETE_TOWN' => 'Paris',
  'MAIN_INFO_SOCIETE_COUNTRY' => '1',
  'MAIN_LANG_DEFAULT' => 'en_US',
  'MAIN_THEME' => 'eldy',
];
foreach ($sets as $k => $v) {
  $db->query("DELETE FROM ".$db->prefix()."const WHERE name='".$db->escape($k)."' AND entity=1");
  $db->query("INSERT INTO ".$db->prefix()."const (name,value,type,visible,entity) VALUES ('".$db->escape($k)."','".$db->escape($v)."','chaine',0,1)");
}

function emit($o) { $o['ok'] = empty($o['errors']); echo json_encode($o, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES), "\n"; exit(empty($o['errors']) ? 0 : 1); }
emit($out);
