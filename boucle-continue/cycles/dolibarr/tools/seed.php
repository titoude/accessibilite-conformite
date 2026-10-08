<?php
/**
 * seed.php — cycle 57 dolibarr. Seed REJOUABLE via les classes Dolibarr
 * (vrai code métier, pas des inserts SQL directs). Exécuté dans le conteneur :
 *   docker exec -w /var/www/html/htdocs doli57-web php /tools/seed.php
 * Sortie : JSON seed-info sur stdout (capturé -> tools/seed-info.json côté host).
 * Idempotent-défensif : refuse de tourner si des entités seed existent déjà.
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
$admin->getRights();

// ---------- activation des modules (idempotent : skip si MAIN_MODULE_* déjà on) ----------
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

// garde anti-double-seed
$chk = $db->query("SELECT rowid FROM llx_societe WHERE nom LIKE 'A11Y %' LIMIT 1");
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

// ---------- factures : 1 brouillon par tiers + 1 validée sur le 1er ----------
$factIds = []; $factureValidee = 0;
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
// valider la 1re facture (PROV -> ref réelle via le module de numérotation)
if (!empty($factIds[0])) {
  $fv = new Facture($db);
  if ($fv->fetch($factIds[0]) > 0) {
    $fv->force_number = 'FA2410-0001';
    $rv = $fv->validate($admin);
    if ($rv > 0) { $factureValidee = $factIds[0]; $out['facture_validated_ref'] = $fv->ref; }
    else { $out['errors'][] = 'validate facture: '.$fv->error; }
  }
}
$out['facture_ids'] = $factIds;
$out['facture_validee_id'] = $factureValidee;

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
  $db->query("DELETE FROM llx_const WHERE name='".$db->escape($k)."' AND entity=1");
  $db->query("INSERT INTO llx_const (name,value,type,visible,entity) VALUES ('".$db->escape($k)."','".$db->escape($v)."','chaine',0,1)");
}

function emit($o) { echo json_encode($o, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES), "\n"; exit(empty($o['errors']) ? 0 : 1); }
emit($out);
