# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 26/26 scénario(s) audité(s), 0 erreur(s), 333 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `a0a18c9697b9`

## Résultats incomplets à revoir (333)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9810/societe/list.php
  - `tr[data-rowid="1"] > .tdoverflowmax200.tdlineheightsmall[data-key="ref"] > .lineheightsmall.inline-block > .classforajaxtooltip.refurl[title="tocomplete"]`
  - `tr[data-rowid="1"] > .nowraponall:nth-child(3)`
  - `tr[data-rowid="1"] > td:nth-child(4)`
  - `tr[data-rowid="1"] > .nowraponall:nth-child(6) > .paddingright`
  - `a[href="/comm/card.php?socid=1"]`
  - `tr[data-rowid="2"] > .tdoverflowmax200.tdlineheightsmall[data-key="ref"] > .lineheightsmall.inline-block > .classforajaxtooltip.refurl[title="tocomplete"]`
  - `tr[data-rowid="2"] > .nowraponall:nth-child(3)`
  - `tr[data-rowid="2"] > td:nth-child(4)`
  - `tr[data-rowid="2"] > .nowraponall:nth-child(6) > .paddingright`
  - `a[href="/comm/card.php?socid=2"]`
  - … +6 autres
- http://localhost:9810/societe/card.php?socid=1
  - `.customer-back`
  - `td[colspan="5"] > .opacitymedium`
  - `.nopaddingrightimp.nowraponall > .classforajaxtooltip[href="/comm/action/card.php?id=14"][title="Project A11Y-PJ01 created"]`
  - `.oddeven:nth-child(2) > .celldateheight.nowraponall.center > .center.inline-block`
  - `.oddeven:nth-child(2) > .celldateheight.nowraponall.center > .center.inline-block > .small.opacitymedium`
  - `.oddeven:nth-child(2) > .tdoverflowmax100.nowraponall > .classforajaxtooltip[title="tocomplete"][href="/user/card.php?id=1"] > .usertext.nopadding`
  - `.tdoverflowmax250 > .classforajaxtooltip[href="/comm/action/card.php?id=14"][title="Project A11Y-PJ01 created"]`
  - `.nopaddingrightimp.nowraponall > .classforajaxtooltip[href="/comm/action/card.php?id=11"][title="Invoice IN2610-0001 validated"]`
  - `.oddeven:nth-child(3) > .celldateheight.nowraponall.center > .center.inline-block`
  - `.oddeven:nth-child(3) > .celldateheight.nowraponall.center > .center.inline-block > .small.opacitymedium`
  - … +12 autres
- http://localhost:9810/societe/contact.php?socid=1
  - `.classforajaxtooltip > .valignmiddle`
  - `.tdoverflowmax150.classfortooltip > .paddingright`
  - `a[href="mailto:cmartin@acme.example"]`
- http://localhost:9810/product/list.php
  - `tr[data-rowid="1"] > .tdoverflowmax250 > .classforajaxtooltip.nowraponall[title="tocomplete"] > .aaa`
  - `td[title="Widget standard"] > .spantitle`
  - `tr[data-rowid="1"] > .nowraponall.right:nth-child(4) > .amount`
  - `tr[data-rowid="1"] > .right:nth-child(6)`
  - `tr[data-rowid="1"] > .right:nth-child(7)`
  - `tr[data-rowid="2"] > .tdoverflowmax250 > .classforajaxtooltip.nowraponall[title="tocomplete"] > .aaa`
  - `td[title="Widget premium"] > .spantitle`
  - `tr[data-rowid="2"] > .nowraponall.right:nth-child(4) > .amount`
  - `tr[data-rowid="2"] > .right:nth-child(6)`
  - `tr[data-rowid="2"] > .right:nth-child(7)`
  - … +11 autres
- http://localhost:9810/product/card.php?id=1
  - `td[colspan="5"] > .opacitymedium`
  - `.nopaddingrightimp > .classforajaxtooltip[href="/comm/action/card.php?id=6"][title="Product A11Y-PROD-1 created"]`
  - `.center.inline-block`
  - `.small.opacitymedium`
  - `.usertext`
  - `.tdoverflowmax250 > .classforajaxtooltip[href="/comm/action/card.php?id=6"][title="Product A11Y-PROD-1 created"]`
- http://localhost:9810/compta/facture/list.php
  - `.status1 > .nowraponall:nth-child(2) > table > tbody > .nocellnopadd > .nobordernopadding.nowraponall > .classforajaxtooltip[title="tocomplete"]`
  - `.status1 > .nowraponall[align="center"]:nth-child(3)`
  - `.status1 > .nowraponall[align="center"]:nth-child(4)`
  - `.status1 > .tdoverflowmax150 > .refurl.classforajaxtooltip[title="tocomplete"]`
  - `.status1 > .right.nowraponall:nth-child(7) > .amount`
  - `.status1 > .amount.right.nowraponall`
  - `.status2 > .nowraponall:nth-child(2) > table > tbody > .nocellnopadd > .nobordernopadding.nowraponall > .classforajaxtooltip[title="tocomplete"]`
  - `.status2 > .nowraponall[align="center"]:nth-child(3)`
  - `.status2 > .nowraponall[align="center"]:nth-child(4)`
  - `.status2 > .tdoverflowmax150 > .refurl.classforajaxtooltip[title="tocomplete"]`
  - … +9 autres
- http://localhost:9810/compta/facture/card.php?facid=1
  - `tr:nth-child(2) > .right[colspan="5"] > .opacitymedium`
  - `.paymenttable > tbody > tr:nth-child(2) > .right:nth-child(2)`
  - `tr:nth-child(3) > .right[colspan="5"] > .opacitymedium`
  - `.paymenttable > tbody > tr:nth-child(3) > .right:nth-child(2)`
  - `tr:nth-child(4) > .right[colspan="5"] > .opacitymedium`
  - `.amountremaintopay`
  - `#row-1 > .minwidth300imp.linecoldescription`
  - `a[href="/product/card.php?id=4"] > .aaa`
  - `#row-1 > .linecolvat.nowrap.right > .classfortooltip`
  - `#row-1 > .linecoluht.nowraponall.right`
  - … +18 autres
- http://localhost:9810/compta/facture/card.php?facid=3
  - `tr:nth-child(2) > .right[colspan="5"] > .opacitymedium`
  - `.paymenttable > tbody > tr:nth-child(2) > .right:nth-child(2)`
  - `tr:nth-child(3) > .right[colspan="5"] > .opacitymedium`
  - `.paymenttable > tbody > tr:nth-child(3) > .right:nth-child(2)`
  - `tr:nth-child(4) > .right[colspan="5"] > .opacitymedium`
  - `.amountremaintopay`
  - `#row-5 > .minwidth300imp.linecoldescription`
  - `a[href="/product/card.php?id=4"] > .aaa`
  - `#row-5 > .linecolvat.nowrap.right > .classfortooltip`
  - `#row-5 > .linecoluht.nowraponall.right`
  - … +17 autres
- http://localhost:9810/comm/propal/card.php?id=1
  - `.minwidth300imp`
  - `.aaa`
  - `.linecolvat.nowrap.right > .classfortooltip`
  - `#row-1 > .linecoluht.nowraponall.right`
  - `#row-1 > .linecoluttc.nowraponall.right`
  - `.linecolqty.nowraponall.right`
  - `.linecolht.nowrap.right > .classfortooltip`
  - `#cke_12_text`
  - `#cke_13_text`
  - `#cke_38_label`
  - … +4 autres
- http://localhost:9810/commande/card.php?id=1
  - `.minwidth300imp`
  - `.aaa`
  - `.linecolvat.nowrap.right > .classfortooltip`
  - `#row-1 > .linecoluht.nowraponall.right`
  - `#row-1 > .linecoluttc.nowraponall.right`
  - `.linecolqty.nowraponall.right`
  - `.linecolht.nowrap.right > .classfortooltip`
  - `#cke_12_text`
  - `#cke_13_text`
  - `#cke_38_label`
  - … +4 autres
- http://localhost:9810/projet/card.php?id=1
  - `#builddoc_generatebutton`
  - `td[colspan="5"] > .opacitymedium`
  - `.nopaddingrightimp > .classforajaxtooltip[href="/comm/action/card.php?id=14"][title="Project A11Y-PJ01 created"]`
  - `.center.inline-block`
  - `.small.opacitymedium`
  - `.usertext`
  - `.tdoverflowmax250 > .classforajaxtooltip[href="/comm/action/card.php?id=14"][title="Project A11Y-PJ01 created"]`
- http://localhost:9810/contact/card.php?id=1
  - `.nopaddingrightimp > .classforajaxtooltip[href="/comm/action/card.php?id=5"][title="Contact Claire Martin created"]`
  - `.center.inline-block`
  - `.small.opacitymedium`
  - `.usertext`
  - `.tdoverflowmax250 > .classforajaxtooltip[href="/comm/action/card.php?id=5"][title="Contact Claire Martin created"]`
- http://localhost:9810/user/card.php?id=1
  - `.button`
  - `td[colspan="2"] > .opacitymedium`
  - `td[colspan="5"] > .opacitymedium`
  - `.nopaddingrightimp.nowraponall > .classforajaxtooltip[href="/comm/action/card.php?id=14"][title="Project A11Y-PJ01 created"]`
  - `.oddeven:nth-child(2) > .celldateheight.nowraponall.center > .center.inline-block`
  - `.oddeven:nth-child(2) > .celldateheight.nowraponall.center > .center.inline-block > .small.opacitymedium`
  - `.oddeven:nth-child(2) > .tdoverflowmax100.nowraponall > .classforajaxtooltip[title="tocomplete"][href="/user/card.php?id=1"] > .usertext.nopadding`
  - `.tdoverflowmax250 > .classforajaxtooltip[href="/comm/action/card.php?id=14"][title="Project A11Y-PJ01 created"]`
  - `.nopaddingrightimp.nowraponall > .classforajaxtooltip[href="/comm/action/card.php?id=13"]`
  - `.oddeven:nth-child(3) > .celldateheight.nowraponall.center > .center.inline-block`
  - … +44 autres
- http://localhost:9810/user/list.php
  - `tr[data-rowid="1"] > .nowraponall.tdoverflowmax150 > .classforajaxtooltip[title="tocomplete"] > .usertext.nopadding`
  - `.tdoverflowmax150[title="SuperAdmin"]:nth-child(3)`
  - `tr[data-rowid="1"] > .tdoverflowmax150:nth-child(9) > .opacitymedium`
  - `tr[data-rowid="1"] > .nowraponall.center`
  - `tr[data-rowid="2"] > .nowraponall.tdoverflowmax150 > .classforajaxtooltip[title="tocomplete"] > .usertext.nopadding`
  - `.tdoverflowmax150[title="Dupont"]:nth-child(3)`
  - `.tdoverflowmax150[title="Dupont"]:nth-child(4)`
  - `a[href="mailto:jdupont@example.com"]`
  - `tr[data-rowid="2"] > .tdoverflowmax150:nth-child(9) > .opacitymedium`
- http://localhost:9810/admin/menus.php
  - `.oddeven:nth-child(2) > td:nth-child(1)`
  - `.oddeven:nth-child(3) > td:nth-child(1)`
- http://localhost:9810/index.php [state:dropdown-user]
  - `.fiche`
  - `b:nth-child(4)`
- http://localhost:9810/societe/contact.php?socid=1 [state:fiche-tab-contacts]
  - `.classforajaxtooltip > .valignmiddle`
  - `.tdoverflowmax150.classfortooltip > .paddingright`
  - `a[href="mailto:cmartin@acme.example"]`
- http://localhost:9810/compta/facture/card.php?facid=1 [state:facture-validee]
  - `tr:nth-child(2) > .right[colspan="5"] > .opacitymedium`
  - `.paymenttable > tbody > tr:nth-child(2) > .right:nth-child(2)`
  - `tr:nth-child(3) > .right[colspan="5"] > .opacitymedium`
  - `.paymenttable > tbody > tr:nth-child(3) > .right:nth-child(2)`
  - `tr:nth-child(4) > .right[colspan="5"] > .opacitymedium`
  - `.amountremaintopay`
  - `#row-1 > .minwidth300imp.linecoldescription`
  - `a[href="/product/card.php?id=4"] > .aaa`
  - `#row-1 > .linecolvat.nowrap.right > .classfortooltip`
  - `#row-1 > .linecoluht.nowraponall.right`
  - … +18 autres
- http://localhost:9810/compta/facture/card.php?facid=3 [state:modal-validate-facture]
  - `tr:nth-child(2) > .right[colspan="5"] > .opacitymedium`
  - `.paymenttable > tbody > tr:nth-child(2) > .right:nth-child(2)`
  - `tr:nth-child(3) > .right[colspan="5"] > .opacitymedium`
  - `.paymenttable > tbody > tr:nth-child(3) > .right:nth-child(2)`
  - `tr:nth-child(4) > .right[colspan="5"] > .opacitymedium`
  - `.amountremaintopay`
  - `#row-5 > .minwidth300imp.linecoldescription`
  - `a[href="/product/card.php?id=4"] > .aaa`
  - `#row-5 > .linecolvat.nowrap.right > .classfortooltip`
  - `#row-5 > .linecoluht.nowraponall.right`
  - … +15 autres
- http://localhost:9810/societe/card.php?action=create [state:select2-combo]
  - `a[title="My Dashboard"]`
  - `a[title="Setup"]`

### target-size — All touch targets must be 24px large, or leave sufficient space

- http://localhost:9810/societe/list.php
  - `.select2-selection--multiple`
  - `.select2-search__field`
- http://localhost:9810/societe/contact.php?socid=1
  - `.select2-search__field`
- http://localhost:9810/compta/facture/list.php
  - `.select2-search__field`
- http://localhost:9810/societe/contact.php?socid=1 [state:fiche-tab-contacts]
  - `.select2-search__field`
- http://localhost:9810/index.php [state:mobile-390]
  - `.menuhider[title="Menu"][aria-label="Menu"]`

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:9810/societe/card.php?action=create
  - `.hideonsmartphone[href="#"]`
- http://localhost:9810/compta/facture/card.php?facid=1
  - `a[href="/product/card.php?id=4"]`
  - `a[href="/product/card.php?id=1"]`
- http://localhost:9810/compta/facture/card.php?facid=3
  - `a[href="/product/card.php?id=4"]`
  - `a[href="/product/card.php?id=3"]`
- http://localhost:9810/comm/propal/card.php?id=1
  - `a[href="/product/card.php?id=1"]`
- http://localhost:9810/commande/card.php?id=1
  - `a[href="/product/card.php?id=1"]`
- http://localhost:9810/compta/facture/card.php?facid=1 [state:facture-validee]
  - `a[href="/product/card.php?id=4"]`
  - `a[href="/product/card.php?id=1"]`
- http://localhost:9810/compta/facture/card.php?facid=3 [state:modal-validate-facture]
  - `a[href="/product/card.php?id=4"]`
  - `a[href="/product/card.php?id=3"]`
- http://localhost:9810/societe/card.php?action=create [state:select2-combo]
  - `.hideonsmartphone[href="#"]`

### frame-tested — Frames should be tested with axe-core

- http://localhost:9810/product/card.php?action=create
  - `iframe`
- http://localhost:9810/compta/facture/card.php?facid=3
  - `iframe`
- http://localhost:9810/comm/propal/card.php?id=1
  - `iframe`
- http://localhost:9810/commande/card.php?id=1
  - `iframe`

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:9810/admin/company.php
  - `#phone`
  - `#use_vat`
  - `#no_vat`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9810/societe/card.php?action=create [state:select2-combo]
  - `.selection > .searchselectcombo.vmenusearchselectcombo[title="Keyboard shortcut ALT + s"]`

