# seed.py — cycle 52 netbox. Seed déterministe exécuté via
#   docker exec -i <app> python manage.py shell < tools/seed.py
# Idempotent (get_or_create partout). Émet sur stdout les ids résolus
# (lignes "SEED_ID <clé>=<pk>") lus par tools/gen-urls.sh — source unique
# des ids (leçons 44/46).
from django.contrib.auth import get_user_model
from users.models import Token
from dcim.models import (
    Region, SiteGroup, Site, Location, RackRole, Rack, Manufacturer,
    DeviceRole, DeviceType, Device, Interface, Platform,
)
from dcim.choices import (
    SiteStatusChoices, DeviceStatusChoices, RackStatusChoices,
    InterfaceTypeChoices, LocationStatusChoices,
)
from ipam.models import VRF, VLANGroup, VLAN, Prefix, IPRange, IPAddress
from ipam.choices import PrefixStatusChoices, IPAddressStatusChoices, VLANStatusChoices
from tenancy.models import TenantGroup, Tenant
from virtualization.models import ClusterType, ClusterGroup, Cluster, VirtualMachine, VMInterface
from virtualization.choices import VirtualMachineStatusChoices
from wireless.models import WirelessLANGroup, WirelessLAN
from wireless.choices import WirelessLANStatusChoices
from circuits.models import Provider, ProviderAccount, CircuitType, Circuit
from circuits.choices import CircuitStatusChoices
from vpn.models import TunnelGroup, Tunnel, IKEPolicy, IKEProposal, IPSecProfile, IPSecProposal
from vpn.choices import TunnelStatusChoices, IKEVersionChoices, EncryptionAlgorithmChoices, AuthenticationAlgorithmChoices, DHGroupChoices
from extras.models import Tag

User = get_user_model()
out = []

def emit(key, pk):
    out.append(f"SEED_ID {key}={pk}")

# ---------- Compte banc ----------
admin, _ = User.objects.get_or_create(username='bench-admin', defaults={
    'email': 'bench-admin@nb52.local', 'is_superuser': True, 'is_active': True,
})
admin.is_superuser = True
admin.is_active = True
admin.set_password('AuditC52-Pass-Seed!')
admin.save()
token, _ = Token.objects.get_or_create(user=admin, defaults={'write_enabled': True, 'description': 'nb52 bench token'})
emit('admin_user', admin.pk)
emit('api_token', token.key)  # clé hex générée serveur — pour requêtes API des outils

# ---------- Organisation DCIM ----------
region, _ = Region.objects.get_or_create(name='Bench Europe', slug='bench-europe', defaults={'description': 'Région du banc de test a11y — contenu réel pour les audits.'})
site_group, _ = SiteGroup.objects.get_or_create(name='Bench Campus', slug='bench-campus', defaults={'description': 'Campus regroupant les sites du banc.'})
site, _ = Site.objects.get_or_create(
    name='DC Bench Paris', slug='dc-bench-paris',
    defaults={'status': SiteStatusChoices.STATUS_ACTIVE, 'region': region, 'group': site_group,
              'description': 'Site principal du banc — héberge racks, devices et VLANs.'})
site2, _ = Site.objects.get_or_create(
    name='DC Bench Lyon', slug='dc-bench-lyon',
    defaults={'status': SiteStatusChoices.STATUS_STAGING, 'region': region, 'group': site_group,
              'description': 'Site secondaire (staging).'})
location, _ = Location.objects.get_or_create(site=site, name='Hall A', slug='hall-a', defaults={'status': LocationStatusChoices.STATUS_ACTIVE})
emit('site', site.pk); emit('site2', site2.pk); emit('region', region.pk); emit('site_group', site_group.pk); emit('location', location.pk)

rack_role, _ = RackRole.objects.get_or_create(name='Compute', slug='compute', defaults={'color': '2196f3'})
rack, _ = Rack.objects.get_or_create(name='R01', site=site, defaults={'status': RackStatusChoices.STATUS_ACTIVE, 'role': rack_role, 'location': location, 'u_height': 42})
rack2, _ = Rack.objects.get_or_create(name='R02', site=site, defaults={'status': RackStatusChoices.STATUS_RESERVED, 'role': rack_role, 'location': location})
emit('rack', rack.pk); emit('rack_role', rack_role.pk)

# ---------- Fabricants / modèles / rôles ----------
mfg, _ = Manufacturer.objects.get_or_create(name='Bench Systems', slug='bench-systems', defaults={'description': 'Fabricant fictif du banc.'})
dtype, _ = DeviceType.objects.get_or_create(
    manufacturer=mfg, model='BX-4200', slug='bx-4200',
    defaults={'u_height': 1, 'is_full_depth': True, 'description': 'Serveur 1U de test.'})
dtype2, _ = DeviceType.objects.get_or_create(
    manufacturer=mfg, model='BX-SW48', slug='bx-sw48',
    defaults={'u_height': 1, 'description': 'Switch 48 ports de test.'})
role, _ = DeviceRole.objects.get_or_create(name='Serveur', slug='serveur', defaults={'color': '4caf50'})
role_sw, _ = DeviceRole.objects.get_or_create(name='Switch', slug='switch', defaults={'color': 'ff9800'})
platform, _ = Platform.objects.get_or_create(name='BenchOS', slug='benchos')
emit('manufacturer', mfg.pk); emit('device_type', dtype.pk); emit('device_role', role.pk); emit('platform', platform.pk)

# ---------- Devices + interfaces ----------
dev1, _ = Device.objects.get_or_create(
    name='bench-srv-01', device_type=dtype, role=role, site=site,
    defaults={'status': DeviceStatusChoices.STATUS_ACTIVE, 'rack': rack, 'position': 1, 'face': 'front',
              'platform': platform, 'serial': 'NB52SRV01',
              'comments': 'Serveur principal du banc. Voir https://example.com/netbox-bench pour la fiche produit.'})
dev2, _ = Device.objects.get_or_create(
    name='bench-sw-01', device_type=dtype2, role=role_sw, site=site,
    defaults={'status': DeviceStatusChoices.STATUS_ACTIVE, 'rack': rack, 'position': 10, 'face': 'front',
              'platform': platform, 'serial': 'NB52SW01'})
dev3, _ = Device.objects.get_or_create(
    device_type=dtype, role=role, site=site2,
    defaults={'status': DeviceStatusChoices.STATUS_PLANNED, 'serial': 'NB52SRV02', 'comments': 'Device anonyme (name=None) sur le site staging.'})
for i in range(1, 5):
    Interface.objects.get_or_create(device=dev1, name=f'eth{i-1}', defaults={'type': InterfaceTypeChoices.TYPE_10GE_FIXED, 'enabled': True})
for i in range(1, 9):
    Interface.objects.get_or_create(device=dev2, name=f'GigabitEthernet1/0/{i}', defaults={'type': InterfaceTypeChoices.TYPE_1GE_FIXED, 'enabled': i <= 6})
emit('device', dev1.pk); emit('device2', dev2.pk); emit('device3', dev3.pk)
emit('interface', dev1.interfaces.first().pk)

# ---------- IPAM ----------
vrf, _ = VRF.objects.get_or_create(name='bench-vrf', defaults={'rd': '65000:52', 'description': 'VRF du banc.'})
vlan_group, _ = VLANGroup.objects.get_or_create(name='Bench VLANs', slug='bench-vlans')
vlan10, _ = VLAN.objects.get_or_create(vid=10, group=vlan_group, defaults={'name': 'users', 'status': VLANStatusChoices.STATUS_ACTIVE, 'tenant': None})
vlan20, _ = VLAN.objects.get_or_create(vid=20, group=vlan_group, defaults={'name': 'servers', 'status': VLANStatusChoices.STATUS_ACTIVE})
vlan30, _ = VLAN.objects.get_or_create(vid=30, group=vlan_group, defaults={'name': 'mgmt', 'status': VLANStatusChoices.STATUS_DEPRECATED})
prefix, _ = Prefix.objects.get_or_create(prefix='10.52.0.0/16', defaults={'status': PrefixStatusChoices.STATUS_ACTIVE, 'vrf': vrf, 'description': 'Plage racine du banc.'})
prefix2, _ = Prefix.objects.get_or_create(prefix='10.52.1.0/24', defaults={'status': PrefixStatusChoices.STATUS_ACTIVE, 'vrf': vrf, 'vlan': vlan20, 'description': 'Sous-réseau serveurs.'})
prefix3, _ = Prefix.objects.get_or_create(prefix='10.52.2.0/24', defaults={'status': PrefixStatusChoices.STATUS_CONTAINER, 'vrf': vrf})
for _p in (prefix, prefix2, prefix3):
    if _p.scope != site:
        _p.scope = site
        _p.save()
from netaddr import IPNetwork
iprange, _ = IPRange.objects.get_or_create(start_address=IPNetwork('10.52.2.100/24'), defaults={'end_address': IPNetwork('10.52.2.149/24'), 'size': 50, 'status': 'active', 'description': 'Plage DHCP de test.'})
ips = []
for i in range(1, 13):
    ip, _ = IPAddress.objects.get_or_create(
        address=f'10.52.1.{i}/24',
        defaults={'status': IPAddressStatusChoices.STATUS_ACTIVE, 'vrf': vrf, 'dns_name': f'host-{i}.bench.local',
                  'description': f'Adresse banc {i} — [doc](https://example.com/ip/{i}).'})
    ips.append(ip)
# Affectation : ip[0] -> dev1.eth0 (couvre « assigned » dans les tables)
iface0 = dev1.interfaces.get(name='eth0')
ip0 = ips[0]
ip0.assigned_object_type = None
if ip0.assigned_object_id != iface0.pk:
    from django.contrib.contenttypes.models import ContentType
    ip0.assigned_object_type = ContentType.objects.get_for_model(iface0)
    ip0.assigned_object_id = iface0.pk
    ip0.save()
dev1.primary_ip4 = ip0
dev1.save()
emit('vrf', vrf.pk); emit('vlan_group', vlan_group.pk); emit('vlan', vlan10.pk); emit('vlan2', vlan20.pk); emit('vlan3', vlan30.pk)
emit('prefix', prefix.pk); emit('prefix2', prefix2.pk); emit('iprange', iprange.pk); emit('ip', ips[0].pk)

# ---------- Tenancy ----------
tgroup, _ = TenantGroup.objects.get_or_create(name='Bench Clients', slug='bench-clients')
tenant, _ = Tenant.objects.get_or_create(name='Acme Bench', slug='acme-bench', defaults={'group': tgroup, 'description': 'Client de démonstration du banc.'})
tenant2, _ = Tenant.objects.get_or_create(name='Globex Bench', slug='globex-bench', defaults={'group': tgroup})
emit('tenant', tenant.pk); emit('tenant_group', tgroup.pk)

# ---------- Virtualisation ----------
ctype, _ = ClusterType.objects.get_or_create(name='Bench VMware', slug='bench-vmware')
cgroup, _ = ClusterGroup.objects.get_or_create(name='Bench Cluster Group', slug='bench-cluster-group')
cluster, _ = Cluster.objects.get_or_create(name='bench-cluster-01', type=ctype, defaults={'group': cgroup})
if getattr(cluster, 'scope', None) != site:
    try:
        cluster.scope = site
        cluster.save()
    except Exception:
        pass
vm1, _ = VirtualMachine.objects.get_or_create(name='bench-vm-01', cluster=cluster, defaults={'status': VirtualMachineStatusChoices.STATUS_ACTIVE, 'vcpus': 4, 'memory': 8192, 'disk': 100})
vm2, _ = VirtualMachine.objects.get_or_create(name='bench-vm-02', cluster=cluster, defaults={'status': VirtualMachineStatusChoices.STATUS_OFFLINE, 'vcpus': 2, 'memory': 4096, 'disk': 50})
VMInterface.objects.get_or_create(virtual_machine=vm1, name='eth0')
VMInterface.objects.get_or_create(virtual_machine=vm1, name='eth1')
emit('cluster', cluster.pk); emit('cluster_type', ctype.pk); emit('vm', vm1.pk)

# ---------- Wireless ----------
wgroup, _ = WirelessLANGroup.objects.get_or_create(name='Bench Wireless', slug='bench-wireless')
wlan, _ = WirelessLAN.objects.get_or_create(ssid='bench-corp', defaults={'group': wgroup, 'status': WirelessLANStatusChoices.STATUS_ACTIVE, 'vlan': vlan10, 'description': 'SSID corporate du banc.'})
wlan2, _ = WirelessLAN.objects.get_or_create(ssid='bench-guest', defaults={'group': wgroup, 'status': WirelessLANStatusChoices.STATUS_DISABLED, 'vlan': vlan30})
emit('wlan', wlan.pk); emit('wlan_group', wgroup.pk)

# ---------- Circuits ----------
provider, _ = Provider.objects.get_or_create(name='Bench Carrier', slug='bench-carrier', defaults={'description': 'Opérateur de test.'})
paccount, _ = ProviderAccount.objects.get_or_create(provider=provider, account='BENCH-ACCT-52', defaults={'name': 'Compte banc'})
ctype_circ, _ = CircuitType.objects.get_or_create(name='Fibre dédiée', slug='fibre-dediee')
circuit, _ = Circuit.objects.get_or_create(provider=provider, cid='BENCH-CID-001', type=ctype_circ, defaults={'status': CircuitStatusChoices.STATUS_ACTIVE, 'tenant': tenant, 'description': 'Lien 10G vers DC Bench Paris.'})
emit('provider', provider.pk); emit('circuit', circuit.pk)

# ---------- VPN ----------
tgroup_vpn, _ = TunnelGroup.objects.get_or_create(name='Bench Tunnels', slug='bench-tunnels')
tunnel, _ = Tunnel.objects.get_or_create(name='bench-tun-01', group=tgroup_vpn, defaults={'status': TunnelStatusChoices.STATUS_ACTIVE, 'encapsulation': 'ipsec-tunnel'})
emit('tunnel', tunnel.pk); emit('tunnel_group', tgroup_vpn.pk)

# ---------- Tags ----------
tag, _ = Tag.objects.get_or_create(name='bench-critical', slug='bench-critical', defaults={'color': 'f44336'})
tag2, _ = Tag.objects.get_or_create(name='bench-monitored', slug='bench-monitored', defaults={'color': '3f51b5'})
dev1.tags.add(tag, tag2)
site.tags.add(tag)
emit('tag', tag.pk)

print('\n'.join(out))
print('SEED_DONE')
