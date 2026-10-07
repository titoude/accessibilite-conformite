# seed.rb — cycle 40 redmine : contenu réaliste pour l'audit a11y.
# Exécuté via : docker cp seed.rb redmine40:/tmp/seed.rb && docker exec -e SECRET_KEY_BASE=... redmine40 bundle exec rails runner /tmp/seed.rb
# Idempotent : tout est trouvé-ou-créé par des clés stables.

puts "[seed] cycle 40"

# Les callbacks Redmine (journaux, reschedule_following_issues, watchers)
# incrémentent lock_version en base sans rafraîchir l'objet en mémoire →
# StaleObjectError au prochain save. Le seed n'a pas besoin de locking.
ActiveRecord::Base.lock_optimistically = false

# ---------- comptes ----------
admin = User.find_by_login!('admin')
admin.password = 'redmine40-pw'
admin.password_confirmation = 'redmine40-pw'
admin.must_change_passwd = false
admin.language = 'en'
admin.mail = 'admin@example.net'
admin.firstname = 'Admin'
admin.lastname = 'Redmine'
admin.save!

jsmith = User.find_or_create_by!(login: 'jsmith') do |u|
  u.firstname = 'John'
  u.lastname = 'Smith'
  u.mail = 'jsmith@example.net'
  u.language = 'en'
end
jsmith.password = 'redmine40-jsmith'
jsmith.password_confirmation = 'redmine40-jsmith'
jsmith.must_change_passwd = false
jsmith.status = User::STATUS_ACTIVE
jsmith.save!

jdoe = User.find_or_create_by!(login: 'jdoe') do |u|
  u.firstname = 'Jane'
  u.lastname = 'Doe'
  u.mail = 'jdoe@example.net'
  u.language = 'en'
end
jdoe.password = 'redmine40-jdoe'
jdoe.password_confirmation = 'redmine40-jdoe'
jdoe.must_change_passwd = false
jdoe.status = User::STATUS_ACTIVE
jdoe.save!

# 4e utilisateur, non watcher : cible de l'état « autocomplete add watcher »
pleblanc = User.find_or_create_by!(login: 'pleblanc') do |u|
  u.firstname = 'Pierre'
  u.lastname = 'Leblanc'
  u.mail = 'pleblanc@example.net'
  u.language = 'en'
end
pleblanc.password = 'redmine40-pleblanc'
pleblanc.password_confirmation = 'redmine40-pleblanc'
pleblanc.must_change_passwd = false
pleblanc.status = User::STATUS_ACTIVE
pleblanc.save!

# ---------- projet ----------
dev_role = Role.find_by!(name: 'Developer')
mgr_role = Role.find_by!(name: 'Manager')
rep_role = Role.find_by!(name: 'Reporter')

project = Project.find_or_create_by!(identifier: 'office-website') do |p|
  p.name = 'Office Website'
  p.description = "Refonte du site vitrine — **migration** vers le nouveau CMS. Voir [la page d'accueil du projet](https://www.redmine.org/) pour le contexte."
  p.homepage = 'https://www.example.net/'
  p.is_public = true
  p.inherit_members = false
end
project.enabled_module_names = %w[issue_tracking time_tracking news documents files wiki boards calendar gantt]
project.save!

# 2e projet privé (couverture navigation/droits)
project2 = Project.find_or_create_by!(identifier: 'internal-tools') do |p|
  p.name = 'Internal Tools'
  p.description = 'Outils internes (privé).'
  p.is_public = false
end
project2.enabled_module_names = %w[issue_tracking time_tracking wiki]
project2.save!

Member.find_or_create_by!(project: project, user: admin)  { |m| m.role_ids = [mgr_role.id] }
Member.find_or_create_by!(project: project, user: jsmith) { |m| m.role_ids = [dev_role.id] }
Member.find_or_create_by!(project: project, user: jdoe)   { |m| m.role_ids = [rep_role.id] }
Member.find_or_create_by!(project: project, user: pleblanc) { |m| m.role_ids = [rep_role.id] }
Member.find_or_create_by!(project: project2, user: admin) { |m| m.role_ids = [mgr_role.id] }
Member.find_or_create_by!(project: project2, user: jsmith){ |m| m.role_ids = [dev_role.id] }

# catégories + versions
cat_design = IssueCategory.find_or_create_by!(project: project, name: 'Design')
cat_dev    = IssueCategory.find_or_create_by!(project: project, name: 'Development')
cat_qa     = IssueCategory.find_or_create_by!(project: project, name: 'QA')

v10 = project.versions.find_or_create_by!(name: 'v1.0') { |v| v.effective_date = Date.today - 30; v.status = 'closed'; v.description = 'Première version livrée' }
v20 = project.versions.find_or_create_by!(name: 'v2.0') { |v| v.effective_date = Date.today + 45; v.status = 'open'; v.description = 'Version en cours — refonte UI' }

bug     = Tracker.find_by!(name: 'Bug')
feature = Tracker.find_by!(name: 'Feature')
support = Tracker.find_by!(name: 'Support')
st_new  = IssueStatus.find_by!(name: 'New')
st_prog = IssueStatus.find_by!(name: 'In Progress')
st_res  = IssueStatus.find_by!(name: 'Resolved')
st_fb   = IssueStatus.find_by!(name: 'Feedback')
st_clo  = IssueStatus.find_by!(name: 'Closed')
st_rej  = IssueStatus.find_by!(name: 'Rejected')

prios = {}
%w[Low Normal High Urgent Immediate].each { |n| prios[n] = IssuePriority.find_by(name: n) || IssuePriority.find_or_create_by!(name: n) }

today = Date.today
# ---------- issues (sujets/descriptions littéraux — rejouables) ----------
issues_spec = [
  ['Corriger le débordement du menu mobile', bug, st_prog, 'High', jsmith, cat_dev, v20, today - 12, today + 2, 60,
   "Sur mobile 390px le menu déborde de l'écran.\n\nÉtapes :\n1. Ouvrir la page d'accueil\n2. Cliquer sur le menu\n\nVoir [le ticket amont #43012](https://www.redmine.org/issues/43012) pour le contexte."],
  ['Ajouter un export CSV des feuilles de temps', feature, st_new, 'Normal', admin, cat_dev, v20, today - 5, today + 20, 0,
   "Besoin d'un export CSV depuis **Feuilles de temps**.\n\n- colonnes : date, utilisateur, heures\n- lien utile : [spec CSV](https://www.ietf.org/rfc/rfc4180.txt)"],
  ['Mettre à jour la page tarifs', support, st_fb, 'Low', jdoe, cat_design, nil, today - 30, today - 10, 100,
   "La page /pricing affiche encore les anciens tarifs 2025."],
  ['Accessibilité : labels des champs de recherche', feature, st_new, 'Urgent', jsmith, cat_qa, v20, today - 3, today + 14, 25,
   "Audit RGAA : le champ de recherche n'a pas de label visible.\n\nCritère **11.1** — chaque champ de formulaire a une étiquette. Référence : [RGAA 4.1](https://accessibilite.numerique.gouv.fr/)."],
  ['Refonte de la page d\'accueil', feature, st_prog, 'High', admin, cat_design, v20, today - 20, today + 30, 40,
   "Maquettes validées. Reste :\n* section héros\n* bandeau témoignages\n* pied de page dynamique"],
  ['Erreur 500 sur le formulaire contact', bug, st_new, 'Immediate', jsmith, cat_dev, v20, today - 1, today + 1, 0,
   "POST /contact lève une 500 quand le champ email est vide.\n\n```\nNoMethodError: undefined method 'blank?'\n```"],
  ['Traduction espagnole des pages légales', support, st_res, 'Normal', jdoe, nil, nil, today - 40, today - 15, 100,
   "Pages mentions-legales et CGV traduites, en attente de relecture."],
  ['Optimiser les images du portfolio', feature, st_new, 'Low', jsmith, cat_dev, v20, today + 10, today + 40, 0,
   "Convertir les PNG en WebP, budget : 3 jours."],
  ['Configurer les redirections 301', feature, st_prog, 'Normal', admin, cat_dev, v20, today - 8, today + 5, 70,
   "Anciennes URLs /old/* → nouvelles. Liste dans le wiki."],
  ['Bug calendrier : événements sur plusieurs jours', bug, st_new, 'High', jdoe, cat_qa, v20, today - 2, today + 12, 10,
   "Un événement du 10 au 15 n'apparaît que le 10."],
  ['Migration base de données v1 → v2', feature, st_prog, 'Urgent', jsmith, cat_dev, v20, today - 15, today + 8, 55,
   "Script de migration à relire. Jeu de test de 10k lignes OK."],
  ['Newsletter septembre — liste des abonnés', support, st_clo, 'Low', jdoe, nil, nil, today - 60, today - 35, 100,
   "Export Mailchimp fait et archivé."],
  ['Cache HTTP sur les assets statiques', feature, st_rej, 'Low', admin, cat_dev, nil, today - 50, today - 40, 100,
   "Rejeté : déjà couvert par le CDN."],
  ['Revue accessibilité du contraste des badges', support, st_new, 'Normal', jsmith, cat_qa, v20, today - 4, today + 18, 15,
   "Badge « draft » gris sur blanc = 3.2:1, sous le seuil 4.5:1."],
  ['Planifier la recette client v2.0', support, st_new, 'High', admin, cat_qa, v20, today + 15, today + 35, 0,
   "Session de recette avec le client avant release."],
]

made = {}
issues_spec.each do |subject, tracker, status, prio, assignee, cat, ver, sd, dd, ratio, desc|
  i = Issue.find_or_initialize_by(project: project, subject: subject)
  if i.new_record?
    i.tracker = tracker; i.status = status; i.priority = prios[prio]
    i.author = admin; i.assigned_to = assignee
    i.category = cat; i.fixed_version = ver
    i.start_date = sd; i.due_date = dd; i.done_ratio = ratio
    i.description = desc
    i.save!
  end
  made[subject] = i
end

# hiérarchie parent/enfant + relation « precedes » (visible dans le Gantt)
if (parent = made['Refonte de la page d\'accueil']) && (child = made['Accessibilité : labels des champs de recherche'])
  child.update(parent_issue_id: parent.id) if child.parent_issue_id != parent.id
end
i1 = made['Configurer les redirections 301']; i2 = made['Migration base de données v1 → v2']
if i1 && i2 && !IssueRelation.exists?(issue_from: i1, issue_to: i2)
  IssueRelation.create!(issue_from: i1, issue_to: i2, relation_type: 'precedes')
end
# watchers + journaux (notes avec markdown + lien = contenu rendu réel)
[i1, i2, made['Erreur 500 sur le formulaire contact']].compact.each do |i|
  i.add_watcher(jsmith) unless i.watched_by?(jsmith)
  i.add_watcher(jdoe) unless i.watched_by?(jdoe)
end
i500 = made['Erreur 500 sur le formulaire contact']
if i500.journals.where(notes: nil).count == i500.journals.count || i500.journals.none?
  i500.init_journal(jsmith, "Confirmé en staging : l'exception vient du validateur.\n\nJe propose un fix dans la branche `fix/contact-500` — voir [le diff](https://github.com/redmine/redmine/commit/10d61f8).")
  i500.save!
end
if made['Bug calendrier : événements sur plusieurs jours'].journals.none?
  ic = made['Bug calendrier : événements sur plusieurs jours']
  ic.init_journal(jdoe, "Reproduit sur la vue mois ET la vue semaine.")
  ic.save!
end

# ---------- wiki ----------
wiki = project.wiki || Wiki.create!(project: project, start_page: 'Wiki')
wpage = wiki.pages.find_by(title: 'Wiki') || wiki.pages.new(title: 'Wiki')
if wpage.new_record? || wpage.content.nil? || wpage.content.text !~ /déroulement de la recette/
  wcontent = wpage.content || wpage.build_content(version: 0)
  wcontent.text = <<~MD
    h1. Wiki Office Website

    Bienvenue sur le wiki du projet. Ce wiki documente le périmètre de la *refonte v2.0*.

    h2. Ressources

    * "Documentation Redmine":https://www.redmine.org/guide
    * [Charte graphique (PDF interne)](https://www.example.net/charte.pdf)
    * [[Planning]] — le calendrier partagé

    h2. Points d'attention

    1. Accessibilité RGAA obligatoire sur toutes les pages publiques.
    2. Performance : budget 1,5 s LCP mobile.
    3. Le **déroulement de la recette** est décrit dans la section ci-dessus.
  MD
  wcontent.author = admin
  wpage.content = wcontent
  wpage.save!
end

# ---------- news ----------
News.find_or_create_by!(project: project, title: 'Lancement du chantier v2.0') do |n|
  n.summary = 'Kickoff effectué, planning validé'
  n.description = "La v2.0 démarre cette semaine. L'équipe est complète.\n\nPlus de détails sur [le wiki du projet](https://www.example.net/wiki)."
  n.author = admin
end

# ---------- forum ----------
board = Board.find_or_create_by!(project: project, name: 'General discussion') do |b|
  b.description = 'Discussions générales sur le projet'
end
msg = board.topics.find_by(subject: 'Où documenter les choix techniques ?')
unless msg
  msg = board.messages.create!(subject: 'Où documenter les choix techniques ?', author: jsmith,
    content: "Je propose de centraliser les ADR dans le wiki. Un exemple : [ADR-0001](https://adr.github.io/).")
end
unless msg.children.exists?(subject: 'Re: Où documenter les choix techniques ?')
  msg.children.create!(board: board, subject: 'Re: Où documenter les choix techniques ?', author: admin,
    content: 'OK pour moi — créer la section ADR sous le wiki racine.')
end

# ---------- documents ----------
doccat = DocumentCategory.find_or_create_by!(name: 'Specifications')
Document.find_or_create_by!(project: project, title: 'Spécifications fonctionnelles v2.0') do |d|
  d.category = doccat
  d.description = "Périmètre fonctionnel complet de la refonte — voir [le wiki](https://www.example.net/) pour les annexes."
end

# ---------- temps passé ----------
activity = TimeEntryActivity.find_by(name: 'Development') || TimeEntryActivity.first || TimeEntryActivity.create!(name: 'Development', active: true)
[[i2, jsmith, 6.5, today - 2], [i500, jsmith, 2.0, today - 1], [made['Refonte de la page d\'accueil'], admin, 4.0, today - 3]].each do |iss, usr, h, d|
  next unless iss
  TimeEntry.find_or_create_by!(project: project, issue: iss, user: usr, spent_on: d, hours: h, activity: activity)
end

# ---------- requête personnalisée publique ----------
unless IssueQuery.exists?(project: project, name: 'Open bugs')
  IssueQuery.create!(name: 'Open bugs', user: admin, project: project, visibility: 2,
    column_names: [:tracker, :status, :priority, :subject, :assigned_to, :updated_on, :done_ratio],
    filters: { 'status_id' => { operator: 'o', values: [''] }, 'tracker_id' => { operator: '=', values: [bug.id.to_s] } })
end

# ---------- réglages ----------
Setting.self_registration = '3'      # /account/register public
Setting.app_title = 'Redmine — cycle 40'
Setting.welcome_text = "Bienvenue sur l'instance de démonstration Redmine (cycle 40).\n\nProjet principal : [Office Website](https://www.example.net/)."
Setting.text_formatting = 'common_mark'
Setting.gravatar_enabled = '0'
Setting.display_subprojects_issues = '1'
# tout utilisateur voit les issues publiques : Anonymous/Non member lisent le projet public déjà

puts "[seed] OK : #{Issue.where(project: project).count} issues, wiki=#{wiki.pages.count} page(s), #{Message.count} messages"
puts "[seed] admin login: admin / redmine40-pw ; jsmith / redmine40-jsmith"
