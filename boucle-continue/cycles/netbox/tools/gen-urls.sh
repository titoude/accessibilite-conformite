#!/usr/bin/env bash
# gen-urls.sh — cycle 52 netbox. Résout les ids réels du seed EN BASE
# (auto-incrément non prédictif — leçons 44/46) et régénère les artefacts
# dérivés : seed-info.json + urls-auth.resolved.txt.
# Usage : bash tools/gen-urls.sh <db-container>   ex. netbox52-db | netbox52-db-i
set -euo pipefail

DB="${1:?nom du conteneur postgres requis (ex. netbox52-db)}"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

q() { docker exec "$DB" psql -U netbox -d netbox -tAc "$1" | tr -d '[:space:]'; }
req() { local v; v="$(q "$1")"; [ -z "$v" ] && { echo "[gen-urls] ERREUR : $2 non résolu — seed présent dans $DB ?" >&2; exit 1; }; echo "$v"; }

SITE_ID=$(req "SELECT id FROM dcim_site WHERE slug='dc-bench-paris' LIMIT 1" site)
RACK_ID=$(req "SELECT id FROM dcim_rack WHERE name='R01' AND site_id=$SITE_ID LIMIT 1" rack)
DEVICE_ID=$(req "SELECT id FROM dcim_device WHERE name='bench-srv-01' LIMIT 1" device)
DEVTYPE_ID=$(req "SELECT id FROM dcim_devicetype WHERE slug='bx-4200' LIMIT 1" devtype)
VLAN_ID=$(req "SELECT id FROM ipam_vlan WHERE vid=10 LIMIT 1" vlan)
VLANGROUP_ID=$(req "SELECT id FROM ipam_vlangroup WHERE slug='bench-vlans' LIMIT 1" vlangroup)
PREFIX_ID=$(req "SELECT id FROM ipam_prefix WHERE prefix='10.52.0.0/16' LIMIT 1" prefix)
IP_ID=$(req "SELECT id FROM ipam_ipaddress WHERE address='10.52.1.1/24' LIMIT 1" ip)
IPRANGE_ID=$(req "SELECT id FROM ipam_iprange WHERE description LIKE 'Plage DHCP%' LIMIT 1" iprange)
TENANT_ID=$(req "SELECT id FROM tenancy_tenant WHERE slug='acme-bench' LIMIT 1" tenant)
CLUSTER_ID=$(req "SELECT id FROM virtualization_cluster WHERE name='bench-cluster-01' LIMIT 1" cluster)
VM_ID=$(req "SELECT id FROM virtualization_virtualmachine WHERE name='bench-vm-01' LIMIT 1" vm)
WLAN_ID=$(req "SELECT id FROM wireless_wirelesslan WHERE ssid='bench-corp' LIMIT 1" wlan)
CIRCUIT_ID=$(req "SELECT id FROM circuits_circuit WHERE cid='BENCH-CID-001' LIMIT 1" circuit)
PROVIDER_ID=$(req "SELECT id FROM circuits_provider WHERE slug='bench-carrier' LIMIT 1" provider)
TUNNEL_ID=$(req "SELECT id FROM vpn_tunnel WHERE name='bench-tun-01' LIMIT 1" tunnel)
TAG_ID=$(req "SELECT id FROM extras_tag WHERE slug='bench-critical' LIMIT 1" tag)
TOKEN=$(req "SELECT key FROM users_token WHERE user_id=(SELECT id FROM users_user WHERE username='bench-admin') LIMIT 1" token)

cat > "$TOOLS_DIR/seed-info.json" <<EOF
{
 "admin": {"username": "bench-admin", "password": "AuditC52-Pass-Seed!"},
 "api_token": "$TOKEN",
 "ids": {
  "site": $SITE_ID, "rack": $RACK_ID, "device": $DEVICE_ID, "device_type": $DEVTYPE_ID,
  "vlan": $VLAN_ID, "vlan_group": $VLANGROUP_ID, "prefix": $PREFIX_ID,
  "ip": $IP_ID, "iprange": $IPRANGE_ID, "tenant": $TENANT_ID,
  "cluster": $CLUSTER_ID, "vm": $VM_ID, "wlan": $WLAN_ID,
  "circuit": $CIRCUIT_ID, "provider": $PROVIDER_ID, "tunnel": $TUNNEL_ID, "tag": $TAG_ID
 }
}
EOF

sed -e "s/@SITE_ID@/$SITE_ID/g" -e "s/@RACK_ID@/$RACK_ID/g" -e "s/@DEVICE_ID@/$DEVICE_ID/g" \
    -e "s/@DEVTYPE_ID@/$DEVTYPE_ID/g" -e "s/@VLAN_ID@/$VLAN_ID/g" -e "s/@VLANGROUP_ID@/$VLANGROUP_ID/g" \
    -e "s/@PREFIX_ID@/$PREFIX_ID/g" -e "s/@IP_ID@/$IP_ID/g" -e "s/@IPRANGE_ID@/$IPRANGE_ID/g" \
    -e "s/@TENANT_ID@/$TENANT_ID/g" -e "s/@CLUSTER_ID@/$CLUSTER_ID/g" -e "s/@VM_ID@/$VM_ID/g" \
    -e "s/@WLAN_ID@/$WLAN_ID/g" -e "s/@CIRCUIT_ID@/$CIRCUIT_ID/g" -e "s/@PROVIDER_ID@/$PROVIDER_ID/g" \
    -e "s/@TUNNEL_ID@/$TUNNEL_ID/g" -e "s/@TAG_ID@/$TAG_ID/g" \
    "$TOOLS_DIR/urls-auth.txt" > "$TOOLS_DIR/urls-auth.resolved.txt"

echo "[gen-urls] OK — seed-info.json + urls-auth.resolved.txt (site=$SITE_ID device=$DEVICE_ID prefix=$PREFIX_ID vm=$VM_ID, db=$DB)"
