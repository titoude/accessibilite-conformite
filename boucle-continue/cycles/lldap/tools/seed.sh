#!/usr/bin/env bash
# Seed déterministe pour l'audit a11y de lldap (cycle 26).
# Prérequis : container `docker run -d --name lldap -p 17170:17170
#   -e LLDAP_LDAP_BASE_DN=dc=example,dc=com -e LLDAP_JWT_SECRET=test
#   -e LLDAP_LDAP_USER_PASS=admin123 lldap/lldap@sha256:bb6e509b4a44e8e9985acfd95d83a85e252ed81879254d9751b9926e3ac26c62`
# Sur DB vierge : groupes internes 1=lldap_admin 2=lldap_password_manager
#   3=lldap_strict_readonly, donc "Test Users" => id 4 (utilisé par le manifest).
# Idempotent : chaque mutation ignore l'erreur "already exists".
set -euo pipefail
BASE="${LLDAP_URL:-http://localhost:17170}"
TOKEN=$(curl -sf -X POST "$BASE/auth/simple/login" -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])')
gql() { curl -sf -X POST "$BASE/api/graphql" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "$1"; }

# 2 utilisateurs littéraux
gql '{"query":"mutation{createUser(user:{id:\"jdoe\",email:\"john.doe@example.com\",displayName:\"John Doe\",attributes:[{name:\"first_name\",value:[\"John\"]},{name:\"last_name\",value:[\"Doe\"]}]}){id}}"}' || true
gql '{"query":"mutation{createUser(user:{id:\"asmith\",email:\"alice.smith@example.com\",displayName:\"Alice Smith\",attributes:[{name:\"first_name\",value:[\"Alice\"]},{name:\"last_name\",value:[\"Smith\"]}]}){id}}"}' || true
# 1 groupe littéral
gql '{"query":"mutation{createGroup(name:\"Test Users\"){id}}"}' || true
# Résolution de l'id du groupe par son nom (4 sur DB vierge)
GID=$(gql '{"query":"{groups{id displayName}}"}' | python3 -c 'import sys,json;print([g["id"] for g in json.load(sys.stdin)["data"]["groups"] if g["displayName"]=="Test Users"][0])')
echo "GID=$GID"
gql "{\"query\":\"mutation{addUserToGroup(userId:\\\"jdoe\\\",groupId:$GID){__typename}}\"}" || true
gql "{\"query\":\"mutation{addUserToGroup(userId:\\\"asmith\\\",groupId:$GID){__typename}}\"}" || true
# 1 attribut user + 1 attribut groupe littéraux, puis valeurs renseignées
gql '{"query":"mutation{addUserAttribute(name:\"department\",attributeType:STRING,isList:false,isVisible:true,isEditable:true){__typename}}"}' || true
gql '{"query":"mutation{addGroupAttribute(name:\"description\",attributeType:STRING,isList:false,isVisible:true,isEditable:true){__typename}}"}' || true
gql '{"query":"mutation{updateUser(user:{id:\"jdoe\",insertAttributes:[{name:\"department\",value:[\"Engineering\"]}]}){__typename}}"}' || true
gql "{\"query\":\"mutation{updateGroup(group:{id:$GID,insertAttributes:[{name:\\\"description\\\",value:[\\\"Seed group for a11y audit\\\"]}]}){__typename}}\"}" || true
echo "seed ok (GID=$GID attendu 4 sur DB vierge)"
