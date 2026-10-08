# seed.rb — cycle 56 chatwoot (rails runner, idempotent, rejouable).
# Crée LES données de l'audit : compte "Cycle 56 Support", admin, agents,
# inbox web widget, contacts, conversations avec messages réels, labels,
# équipe. Écrit /tmp/c56-seed-info.json (lu par seed.sh → tools/seed-info.json
# — source unique des ids, leçons 44/46).
require 'json'

# signup publique activée en DB (InstallationConfig écrase l'env upstream) —
# nécessaire pour auditer /app/auth/signup sans session.
sig = InstallationConfig.find_or_initialize_by(name: 'ENABLE_ACCOUNT_SIGNUP')
sig.value = 'true'; sig.locked = false; sig.save!

ACCOUNT_NAME = 'Cycle 56 Support'
ADMIN_EMAIL  = 'admin@cycle56.local'
ADMIN_PASS   = 'C56audit!Pwd'
AGENTS       = [{ 'name' => 'Maya Kernel', 'email' => 'maya.kernel@cycle56.local' },
                { 'name' => 'Omar Fuseau', 'email' => 'omar.fuseau@cycle56.local' }]
INBOX_NAME   = 'Site web'
CONTACTS     = [{ 'name' => 'Lina Parment', 'email' => 'lina.parment@example.test' },
                { 'name' => 'Theo Mareschal', 'email' => 'theo.mareschal@example.test' },
                { 'name' => 'Sonia Kervel', 'email' => 'sonia.kervel@example.test' }]

account = Account.find_or_create_by!(name: ACCOUNT_NAME)

admin = User.find_or_create_by!(email: ADMIN_EMAIL) do |u|
  u.name = 'Admin Cycle56'
  u.password = ADMIN_PASS
  u.password_confirmation = ADMIN_PASS
  u.confirmed_at = Time.current
end
admin.update!(password: ADMIN_PASS, password_confirmation: ADMIN_PASS, confirmed_at: Time.current) unless admin.confirmed?
AccountUser.find_or_create_by!(account: account, user: admin, role: :administrator)

agents = AGENTS.map do |a|
  u = User.find_or_create_by!(email: a['email']) do |x|
    x.name = a['name']; x.password = ADMIN_PASS; x.password_confirmation = ADMIN_PASS
    x.confirmed_at = Time.current
  end
  AccountUser.find_or_create_by!(account: account, user: u, role: :agent)
  u
end

channel = Channel::WebWidget.find_or_create_by!(account: account, website_url: 'https://cycle56.example.test') do |c|
  c.website_token = nil # auto-généré
end
inbox = Inbox.find_or_create_by!(account: account, name: INBOX_NAME, channel: channel)
# couleur widget conforme WCAG (>= 4.5:1 sur blanc) — le seed produit une UI a11y
channel.update!(widget_color: '#1E6DE0') if channel.widget_color != '#1E6DE0'

labels = %w[urgent billing bug].map do |t|
  Label.find_or_create_by!(account: account, title: t) do |l|
    l.description = "Label #{t} cycle56"; l.color = '#C0392B'
  end
end
team = Team.find_or_create_by!(account: account, name: 'equipe cycle56') { |t| t.description = 'Equipe de test a11y' }
TeamMember.find_or_create_by!(team: team, user: agents.first)

convs = []
CONTACTS.each_with_index do |c, i|
  contact = Contact.find_or_create_by!(account: account, email: c['email']) do |x|
    x.name = c['name']; x.inbox_id = inbox.id if x.respond_to?(:inbox_id=)
  end
  contact.update!(name: c['name']) if contact.name != c['name']
  ci = contact.contact_inboxes.find_or_create_by!(inbox: inbox) { |x| x.source_id = SecureRandom.uuid }
  status = %i[open pending resolved][i % 3]
  conv = Conversation.where(account: account, inbox: inbox, contact: contact)
                     .first_or_create!(status: status, contact_inbox: ci, assignee: agents[i % agents.size])
  conv.update!(status: status)
  if conv.messages.count == 0
    Message.create!(account: account, inbox: inbox, conversation: conv, sender: contact,
                    message_type: :incoming, content: "Bonjour, j'ai une question sur **ma facture** — voici le détail : https://example.test/facture-#{i + 1}. Pouvez-vous regarder ?")
    Message.create!(account: account, inbox: inbox, conversation: conv, sender: agents.first,
                    message_type: :outgoing, content: "Bonjour #{contact.name}, nous regardons votre dossier et revenons vers vous rapidement.")
    Message.create!(account: account, inbox: inbox, conversation: conv, sender: contact,
                    message_type: :incoming, content: 'Merci, je reste en ligne.')
  end
  conv.update_labels([labels[i % labels.size].title])
  convs << conv
end

info = {
  'account_id' => account.id,
  'admin' => { 'email' => ADMIN_EMAIL, 'password' => ADMIN_PASS },
  'agents' => agents.map { |a| { 'email' => a.email, 'id' => a.id } },
  'inbox_id' => inbox.id,
  'inbox_name' => inbox.name,
  'website_token' => channel.website_token,
  'contacts' => Contact.where(account: account).pluck(:id, :email).map { |id, e| { 'id' => id, 'email' => e } },
  'conversations' => convs.map { |c| { 'id' => c.id, 'display_id' => c.display_id, 'status' => c.status, 'contact' => c.contact.name } },
  'labels' => labels.map(&:title),
  'team_id' => team.id
}
File.write('/tmp/c56-seed-info.json', JSON.pretty_generate(info))
puts "[seed] account=#{account.id} inbox=#{inbox.id} convs=#{convs.map(&:display_id).inspect}"
