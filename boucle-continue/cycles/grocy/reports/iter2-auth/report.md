# Audit accessibilité — 2026-10-07

**15 règle(s) violée(s), 554 occurrence(s), 84/84 scénario(s) audité(s), 0 erreur(s), 702 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `2d13b452fe0e`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:8080/mealplan
  - `.fc-sun.fc-day-header[data-date="2026-10-04"] > .mr-2.btn-group.my-1 > .add-recipe-button.btn-outline-dark[data-original-title="Add recipe"]`
  - `.fc-sun.fc-day-header[data-date="2026-10-04"] > .mr-2.btn-group.my-1 > .dropdown-toggle-split.dropdown-toggle[data-toggle="dropdown"]`
  - `.fc-mon.fc-day-header[data-date="2026-10-05"] > .mr-2.btn-group.my-1 > .add-recipe-button.btn-outline-dark[data-original-title="Add recipe"]`
  - `.fc-mon.fc-day-header[data-date="2026-10-05"] > .mr-2.btn-group.my-1 > .dropdown-toggle-split.dropdown-toggle[data-toggle="dropdown"]`
  - `.fc-tue.fc-day-header[data-date="2026-10-06"] > .mr-2.btn-group.my-1 > .add-recipe-button.btn-outline-dark[data-original-title="Add recipe"]`
  - `.fc-tue.fc-day-header[data-date="2026-10-06"] > .mr-2.btn-group.my-1 > .dropdown-toggle-split.dropdown-toggle[data-toggle="dropdown"]`
  - `.fc-wed.fc-today[data-date="2026-10-07"] > .mr-2.btn-group.my-1 > .add-recipe-button.btn-outline-dark[data-original-title="Add recipe"]`
  - `.fc-wed.fc-today[data-date="2026-10-07"] > .mr-2.btn-group.my-1 > .dropdown-toggle-split.dropdown-toggle[data-toggle="dropdown"]`
  - `.fc-thu.fc-day-header[data-date="2026-10-08"] > .mr-2.btn-group.my-1 > .add-recipe-button.btn-outline-dark[data-original-title="Add recipe"]`
  - `.fc-thu.fc-day-header[data-date="2026-10-08"] > .mr-2.btn-group.my-1 > .dropdown-toggle-split.dropdown-toggle[data-toggle="dropdown"]`
  - … +4 autres
- http://localhost:8080/choresoverview [state:chores-filter-expanded]
  - `.mt-2`
- http://localhost:8080/choresoverview [state:chore-reschedule-modal]
  - `.mt-2`
- http://localhost:8080/stockoverview [state:night-mode]
  - `.mt-2`
- http://localhost:8080/products [state:night-mode-dialog]
  - `button[data-target="#table-filter-row"]`
  - `button[data-target="#related-links"]`
- http://localhost:8080/stockoverview [state:mobile-nav-390]
  - `.mt-2`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:8080/product/1
  - `#product_id_text_input_text_input`
  - `#shopping_location_id_text_input_text_input`
- http://localhost:8080/stockreports/spendings
  - `#daterange-filter`
- http://localhost:8080/userfield/1
  - `#caption`
- http://localhost:8080/userobject/exampleuserentity/1
  - `input[data-userfield-name="customfield1"]`
  - `input[data-userfield-name="customfield2"]`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.13/image-alt?application=axeAPI

- http://localhost:8080/mealplan
  - `.fc-event-container:nth-child(6) > .fc-day-grid-event.fc-h-event.fc-start > .mx-auto.mb-1 > .rounded-circle.img-fluid[loading="lazy"]`
  - `.fc-event-container:nth-child(3) > .fc-day-grid-event.fc-h-event.fc-start > .mx-auto.mb-1 > .rounded-circle.img-fluid[loading="lazy"]`
  - `.fc-event-container:nth-child(4) > .fc-day-grid-event.fc-h-event.fc-start > .mx-auto.mb-1 > .rounded-circle.img-fluid[loading="lazy"]`
  - `.fc-event-container:nth-child(7) > .fc-day-grid-event.fc-h-event.fc-start > .mx-auto.mb-1 > .rounded-circle.img-fluid[loading="lazy"]`
  - `.fc-event-container:nth-child(8) > .fc-day-grid-event.fc-h-event.fc-start > .mx-auto.mb-1 > .rounded-circle.img-fluid[loading="lazy"]`
  - `.fc-event-container:nth-child(2) > .fc-day-grid-event.fc-h-event.fc-start > .mx-auto.mb-1 > .rounded-circle.img-fluid[loading="lazy"]`
  - `.fc-event-container:nth-child(5) > .fc-day-grid-event.fc-h-event.fc-start > .mx-auto.mb-1 > .rounded-circle.img-fluid[loading="lazy"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://localhost:8080/api
  - `.opblock-summary-get.opblock-summary > .opblock-summary-control > .opblock-summary-path-description-wrapper > .opblock-summary-path[data-path="/objects/{entity}"] > .nostyle`
  - `#operations-Generic_entity_interactions-get_objects__entity_ > .opblock-summary-get.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"] > button[type="button"][aria-label="Copy path to clipboard"][title="Copy path to clipboard"]`
  - `.opblock-summary-post.opblock-summary > .opblock-summary-control > .opblock-summary-path-description-wrapper > .opblock-summary-path[data-path="/objects/{entity}"] > .nostyle`
  - `#operations-Generic_entity_interactions-post_objects__entity_ > .opblock-summary-post.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"] > button[type="button"][aria-label="Copy path to clipboard"][title="Copy path to clipboard"]`
  - `.opblock-summary-get.opblock-summary > .opblock-summary-control > .opblock-summary-path-description-wrapper > .opblock-summary-path[data-path="/objects/{entity}/{objectId}"] > .nostyle`
  - `#operations-Generic_entity_interactions-get_objects__entity___objectId_ > .opblock-summary-get.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"] > button[type="button"][aria-label="Copy path to clipboard"][title="Copy path to clipboard"]`
  - `.opblock-summary-put.opblock-summary > .opblock-summary-control > .opblock-summary-path-description-wrapper > .opblock-summary-path[data-path="/objects/{entity}/{objectId}"] > .nostyle`
  - `#operations-Generic_entity_interactions-put_objects__entity___objectId_ > .opblock-summary-put.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"] > button[type="button"][aria-label="Copy path to clipboard"][title="Copy path to clipboard"]`
  - `.opblock-summary-delete.opblock-summary > .opblock-summary-control > .opblock-summary-path-description-wrapper > .opblock-summary-path[data-path="/objects/{entity}/{objectId}"] > .nostyle`
  - `#operations-Generic_entity_interactions-delete_objects__entity___objectId_ > .opblock-summary-delete.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"] > button[type="button"][aria-label="Copy path to clipboard"][title="Copy path to clipboard"]`
  - … +164 autres
- http://localhost:8080/batteries
  - `.navbar-brand`
- http://localhost:8080/chores
  - `.navbar-brand`
- http://localhost:8080/locations
  - `.navbar-brand`
- http://localhost:8080/productgroups
  - `.navbar-brand`
- http://localhost:8080/products
  - `.navbar-brand`
- http://localhost:8080/quantityunits
  - `.navbar-brand`
- http://localhost:8080/shoppinglocations
  - `.navbar-brand`
- http://localhost:8080/taskcategories
  - `.navbar-brand`
- http://localhost:8080/userentities
  - `.navbar-brand`
- http://localhost:8080/userfields
  - `.navbar-brand`
- http://localhost:8080/userobjects/exampleuserentity
  - `.navbar-brand`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://localhost:8080/api
  - `hgroup > .link[target="_blank"][rel="noopener noreferrer"]`
- http://localhost:8080/choresoverview
  - `a[data-chore-name="Mop the kitchen floor"][data-chore-id="2"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Take out the trash"][data-chore-id="3"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Clean the litter box"][data-chore-id="5"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Change towels in the bathroom"][data-chore-id="1"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Vacuum the living room floor"][data-chore-id="4"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Change the bed sheets"][data-chore-id="6"][data-original-title="Track next chore schedule"]`
- http://localhost:8080/mealplan
  - `a[data-recipe-id="-96"][data-recipe-name="2026-40"][data-recipe-type="mealplan-week"]:nth-child(2)`
  - `a[data-recipe-id="-96"][data-recipe-name="2026-40"][data-recipe-type="mealplan-week"]:nth-child(3)`
  - `div[data-section-id="1"] > .fc-view-container > .fc-view.fc-agendaWeek-view.fc-agenda-view > table > .fc-body > tr > td > .fc-day-grid.fc-unselectable > .fc-week.fc-row.table-bordered > .fc-content-skeleton > table > tbody > tr > .fc-event-container:nth-child(3) > .fc-day-grid-event.fc-h-event.fc-start > div > .d-print-none > .btn-outline-info.edit-meal-plan-entry-button[data-original-title="Edit this item"]`
  - `.fc-event-container:nth-child(3) > .fc-day-grid-event.fc-h-event.fc-start > div > .d-print-none > .remove-product-button.btn-outline-danger[data-original-title="Delete this item"]`
  - `a[data-original-title="Consume 1 Glass of Yogurt"]`
  - `a[data-product-name="Yogurt"][data-product-id="9"][data-original-title="Add to shopping list"]`
  - `.mealplan-entry-done-button[data-mealplan-entry-id="10"][data-original-title="Mark this item as done"]`
  - `div[data-section-id="1"] > .fc-view-container > .fc-view.fc-agendaWeek-view.fc-agenda-view > table > .fc-body > tr > td > .fc-day-grid.fc-unselectable > .fc-week.fc-row.table-bordered > .fc-content-skeleton > table > tbody > tr > .fc-event-container:nth-child(4) > .fc-day-grid-event.fc-h-event.fc-start > div > .d-print-none > .btn-outline-info.edit-meal-plan-entry-button[data-original-title="Edit this item"]`
  - `.fc-event-container:nth-child(4) > .fc-day-grid-event.fc-h-event.fc-start > div > .d-print-none > .remove-note-button.btn-outline-danger[data-original-title="Delete this item"]`
  - `a[data-mealplan-entry-id="8"]`
  - … +43 autres
- http://localhost:8080/productgroups
  - `.odd:nth-child(1) > td:nth-child(4) > .btn-link.text-body.btn-sm`
  - `.even:nth-child(2) > td:nth-child(4) > .btn-link.text-body.btn-sm`
  - `.odd:nth-child(3) > td:nth-child(4) > .btn-link.text-body.btn-sm`
  - `.even:nth-child(4) > td:nth-child(4) > .btn-link.text-body.btn-sm`
  - `.odd:nth-child(5) > td:nth-child(4) > .btn-link.text-body.btn-sm`
  - `.even:nth-child(6) > td:nth-child(4) > .btn-link.text-body.btn-sm`
  - `.odd:nth-child(7) > td:nth-child(4) > .btn-link.text-body.btn-sm`
- http://localhost:8080/recipe/1
  - `a[data-product-id="10"]`
  - `a[data-recipe-pos-name="Cheese"]`
  - `a[data-product-id="16"]`
  - `a[data-recipe-pos-name="Pizza dough"]`
  - `a[data-product-id="18"]`
  - `a[data-recipe-pos-name="Salami"]`
  - `a[data-product-id="17"]`
  - `a[data-recipe-pos-name="Sieved tomatoes"]`
- http://localhost:8080/shoppinglist
  - `#shoppinglistitem-5-row > .fit-content.border-right > .shopping-list-stock-add-workflow-list-item-button.btn-primary[data-original-title="Add this item to stock"]`
  - `#shoppinglistitem-4-row > .fit-content.border-right > .shopping-list-stock-add-workflow-list-item-button.btn-primary[data-original-title="Add this item to stock"]`
  - `#shoppinglistitem-3-row > .fit-content.border-right > .shopping-list-stock-add-workflow-list-item-button.btn-primary[data-original-title="Add this item to stock"]`
  - `#shoppinglistitem-2-row > .fit-content.border-right > .shopping-list-stock-add-workflow-list-item-button.btn-primary[data-original-title="Add this item to stock"]`
  - `.disabled.btn-primary.btn-sm`
- http://localhost:8080/choresoverview [state:chores-filter-expanded]
  - `a[href$="#table-filter-row"]`
  - `a[data-chore-name="Mop the kitchen floor"][data-chore-id="2"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Take out the trash"][data-chore-id="3"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Clean the litter box"][data-chore-id="5"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Change towels in the bathroom"][data-chore-id="1"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Vacuum the living room floor"][data-chore-id="4"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Change the bed sheets"][data-chore-id="6"][data-original-title="Track next chore schedule"]`
- http://localhost:8080/choresoverview [state:chore-reschedule-modal]
  - `a[href$="#table-filter-row"]`
  - `a[data-chore-name="Mop the kitchen floor"][data-chore-id="2"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Take out the trash"][data-chore-id="3"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Clean the litter box"][data-chore-id="5"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Change towels in the bathroom"][data-chore-id="1"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Vacuum the living room floor"][data-chore-id="4"][data-original-title="Track next chore schedule"]`
  - `a[data-chore-name="Change the bed sheets"][data-chore-id="6"][data-original-title="Track next chore schedule"]`
- http://localhost:8080/stockoverview [state:night-mode]
  - `a[href$="#table-filter-row"]`
- http://localhost:8080/stockoverview [state:mobile-nav-390]
  - `a[href$="#table-filter-row"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8080/api
  - `small:nth-child(1) > pre`
  - `.version-stamp > pre`
  - `p > a[target="_blank"][rel="noopener noreferrer"]`
  - `a[href$="grocy.info/"]`
  - `.btn > span`
  - `#operations-Generic_entity_interactions-get_objects__entity_ > .opblock-summary-get.opblock-summary > .opblock-summary-control > .opblock-summary-method`
  - `#operations-Generic_entity_interactions-post_objects__entity_ > .opblock-summary-post.opblock-summary > .opblock-summary-control > .opblock-summary-method`
  - `#operations-Generic_entity_interactions-get_objects__entity___objectId_ > .opblock-summary-get.opblock-summary > .opblock-summary-control > .opblock-summary-method`
  - `#operations-Generic_entity_interactions-put_objects__entity___objectId_ > .opblock-summary-put.opblock-summary > .opblock-summary-control > .opblock-summary-method`
  - `#operations-Generic_entity_interactions-delete_objects__entity___objectId_ > .opblock-summary-delete.opblock-summary > .opblock-summary-control > .opblock-summary-method`
  - … +82 autres
- http://localhost:8080/barcodescannertesting
  - `.text-success`
- http://localhost:8080/calendar
  - `.fc-sun.fc-past[data-date="2026-09-27"] > .fc-day-number`
  - `.fc-mon.fc-past[data-date="2026-09-28"] > .fc-day-number`
  - `.fc-tue.fc-past[data-date="2026-09-29"] > .fc-day-number`
  - `.fc-wed.fc-past[data-date="2026-09-30"] > .fc-day-number`
  - `td[rowspan="6"] > .fc-day-grid-event.fc-h-event.fc-event > .fc-content > .fc-title`
  - `tr:nth-child(1) > .fc-event-container:nth-child(3) > .fc-day-grid-event.fc-h-event.fc-event > .fc-content > .fc-title`
  - `.fc-week.fc-row.table-bordered:nth-child(2) > .fc-content-skeleton > table > tbody > tr:nth-child(1) > .fc-event-container:nth-child(4) > .fc-day-grid-event.fc-h-event.fc-event > .fc-content > .fc-title`
  - `.fc-week.fc-row.table-bordered:nth-child(2) > .fc-content-skeleton > table > tbody > tr:nth-child(1) > .fc-event-container:nth-child(6) > .fc-day-grid-event.fc-h-event.fc-event > .fc-content > .fc-title`
  - `.fc-week.fc-row.table-bordered:nth-child(2) > .fc-content-skeleton > table > tbody > tr:nth-child(1) > .fc-event-container:nth-child(7) > .fc-day-grid-event.fc-h-event.fc-event > .fc-content > .fc-title`
  - `.fc-week.fc-row.table-bordered:nth-child(2) > .fc-content-skeleton > table > tbody > tr:nth-child(2) > .fc-event-container:nth-child(2) > .fc-day-grid-event.fc-h-event.fc-event > .fc-content > .fc-title`
  - … +17 autres
- http://localhost:8080/product/1
  - `.btn-info.default-submit-button[data-location="return"]`
  - `.content-wrapper.pt-0[role="main"]:nth-child(93) > .container-fluid.pr-1.pl-md-3 > .mb-3.row > .content-text.fa-width-auto.col > .row:nth-child(3) > .col-lg-6.col-12:nth-child(1) > form > .sticky-form-footer.pt-1 > .btn-info.save-product-button[data-location="return"]`
- http://localhost:8080/quantityunit/1
  - `.btn-info`
- http://localhost:8080/recipe/1
  - `button[data-location="return"]`
- http://localhost:8080/shoppinglist
  - `#save-description-button`
  - `#clear-description-button`
- http://localhost:8080/user/1/sessions
  - `.badge`
- http://localhost:8080/products [state:night-mode-dialog]
  - `.btn-success`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-dialog-name?application=axeAPI

- http://localhost:8080/products [state:delete-confirm]
  - `.bootbox`
- http://localhost:8080/products [state:night-mode-dialog]
  - `.bootbox`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.13/nested-interactive?application=axeAPI

- http://localhost:8080/api
  - `#operations-Generic_entity_interactions-get_objects__entity_ > .opblock-summary-get.opblock-summary > .opblock-summary-control`
  - `#operations-Generic_entity_interactions-post_objects__entity_ > .opblock-summary-post.opblock-summary > .opblock-summary-control`
  - `#operations-Generic_entity_interactions-get_objects__entity___objectId_ > .opblock-summary-get.opblock-summary > .opblock-summary-control`
  - `#operations-Generic_entity_interactions-put_objects__entity___objectId_ > .opblock-summary-put.opblock-summary > .opblock-summary-control`
  - `#operations-Generic_entity_interactions-delete_objects__entity___objectId_ > .opblock-summary-delete.opblock-summary > .opblock-summary-control`
  - `#operations-Generic_entity_interactions-get_userfields__entity___objectId_ > .opblock-summary-get.opblock-summary > .opblock-summary-control`
  - `#operations-Generic_entity_interactions-put_userfields__entity___objectId_ > .opblock-summary-put.opblock-summary > .opblock-summary-control`
  - `#operations-System-get_system_info > .opblock-summary-get.opblock-summary > .opblock-summary-control`
  - `#operations-System-get_system_db_changed_time > .opblock-summary-get.opblock-summary > .opblock-summary-control`
  - `#operations-System-get_system_config > .opblock-summary-get.opblock-summary > .opblock-summary-control`
  - … +77 autres

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://localhost:8080/api
  - `#operations-tag-Generic_entity_interactions`
- http://localhost:8080/mealplan
  - `.fc-center > h4`
- http://localhost:8080/choresoverview [state:chore-reschedule-modal]
  - `#modal-title-c24lja0n3q8`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8080/api
  - `h1`
  - `.info__description`
  - `.info__license`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-no-duplicate-main?application=axeAPI

- http://localhost:8080/product/1
  - `.content-wrapper.pt-0[role="main"]:nth-child(27)`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://localhost:8080/product/1
  - `nav:nth-child(26)`
  - `.content-wrapper.pt-0[role="main"]:nth-child(27)`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:8080/login [state:login-failed]
  - `html`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://localhost:8080/mealplan
  - `div[data-section-id="1"] > .fc-view-container > .fc-view.fc-agendaWeek-view.fc-agenda-view > table > .fc-head > tr > .fc-head-container > .fc-row.table-bordered > table > thead > tr > .fc-axis`
- http://localhost:8080/product/1
  - `.dataTables_scrollHeadInner > .dataTable > thead > tr > .sorting[data-column-index="4"][aria-controls="qu-conversions-table-products"]`
  - `.dataTables_scrollBody.no-force-overflow-visible > .dataTable > thead > tr > .sorting[data-column-index="4"][aria-controls="qu-conversions-table-products"]`
  - `.mt-5.row:nth-child(3) > .col > table > thead > tr > th:nth-child(5)`
- http://localhost:8080/quantityunitconversionsresolved
  - `.dataTables_scrollHeadInner > table > thead > tr > .sorting[data-column-index="4"][aria-controls="qu-conversions-resolved-table"]`
  - `#qu-conversions-resolved-table > thead > tr > .sorting[data-column-index="4"][aria-controls="qu-conversions-resolved-table"]`

## [MINOR] empty-heading — Headings should not be empty

Ensure headings have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-heading?application=axeAPI

- http://localhost:8080/mealplan
  - `#day-summary-2026-10-04`
  - `#day-summary-2026-10-05`
  - `#day-summary-2026-10-06`
  - `#day-summary-2026-10-07`
  - `#day-summary-2026-10-08`
  - `#day-summary-2026-10-09`
  - `#day-summary-2026-10-10`

## Résultats incomplets à revoir (702)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:8080/api
  - `#operations-Generic_entity_interactions-get_objects__entity_ > .opblock-summary-get.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"]`
  - `#operations-Generic_entity_interactions-post_objects__entity_ > .opblock-summary-post.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"]`
  - `#operations-Generic_entity_interactions-get_objects__entity___objectId_ > .opblock-summary-get.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"]`
  - `#operations-Generic_entity_interactions-put_objects__entity___objectId_ > .opblock-summary-put.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"]`
  - `#operations-Generic_entity_interactions-delete_objects__entity___objectId_ > .opblock-summary-delete.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"]`
  - `#operations-Generic_entity_interactions-get_userfields__entity___objectId_ > .opblock-summary-get.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"]`
  - `#operations-Generic_entity_interactions-put_userfields__entity___objectId_ > .opblock-summary-put.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"]`
  - `#operations-System-get_system_info > .opblock-summary-get.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"]`
  - `#operations-System-get_system_db_changed_time > .opblock-summary-get.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"]`
  - `#operations-System-get_system_config > .opblock-summary-get.opblock-summary > .view-line-link.copy-to-clipboard[title="Copy path to clipboard"]`
  - … +77 autres

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8080/barcodescannertesting
  - `#hit-count`
- http://localhost:8080/batteriesjournal
  - `#battery-filter`
  - `#daterange-filter`
- http://localhost:8080/batteriesoverview
  - `#status-filter`
- http://localhost:8080/battery/1
  - `label[for="active"]`
- http://localhost:8080/batterytracking
  - `#batterycard-battery-journal-button`
- http://localhost:8080/calendar
  - `.fc-sun.fc-other-month[data-date="2026-11-01"] > .fc-day-number`
  - `.fc-mon.fc-other-month[data-date="2026-11-02"] > .fc-day-number`
  - `.fc-tue.fc-other-month[data-date="2026-11-03"] > .fc-day-number`
  - `.fc-wed.fc-other-month[data-date="2026-11-04"] > .fc-day-number`
  - `.fc-thu.fc-other-month[data-date="2026-11-05"] > .fc-day-number`
  - `.fc-fri.fc-other-month[data-date="2026-11-06"] > .fc-day-number`
  - `.fc-sat.fc-other-month[data-date="2026-11-07"] > .fc-day-number`
- http://localhost:8080/chore/1
  - `label[for="active"]`
  - `#period_type`
  - `#assignment_type`
- http://localhost:8080/choresjournal
  - `#chore-filter`
  - `#daterange-filter`
- http://localhost:8080/choresoverview
  - `#status-filter`
  - `#user-filter`
- http://localhost:8080/choretracking
  - `#chorecard-chore-journal-button`
- http://localhost:8080/consume
  - `#qu_id`
  - `#location_id`
  - `#productcard-product-journal-button`
  - `#productcard-product-stock-button`
- http://localhost:8080/inventory
  - `#qu_id`
  - `#productcard-product-journal-button`
  - `#productcard-product-stock-button`
- http://localhost:8080/manageapikeys
  - `td:nth-child(8)`
- http://localhost:8080/mealplan
  - `div[data-section-id="1"] > .fc-view-container > .fc-view.fc-agendaWeek-view.fc-agenda-view > table > .fc-body > tr > td > .fc-day-grid.fc-unselectable > .fc-week.fc-row.table-bordered > .fc-bg > table > tbody > tr > .fc-axis > div`
  - `div[data-section-id="2"] > .fc-view-container > .fc-view.fc-agendaWeek-view.fc-agenda-view > table > .fc-body > tr > td > .fc-day-grid.fc-unselectable > .fc-week.fc-row.table-bordered > .fc-bg > table > tbody > tr > .fc-axis > div`
  - `div[data-section-id="3"] > .fc-view-container > .fc-view.fc-agendaWeek-view.fc-agenda-view > table > .fc-body > tr > td > .fc-day-grid.fc-unselectable > .fc-week.fc-row.table-bordered > .fc-bg > table > tbody > tr > .fc-axis > div`
- http://localhost:8080/product/1
  - `nav:nth-child(26) > .navbar-collapse.collapse > .navbar-sidenav.navbar-nav > .nav-item-sidebar[data-original-title="Stock overview"][data-placement="right"] > .nav-link.discrete-link > .nav-link-text`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .navbar-sidenav.navbar-nav > .nav-item-sidebar[data-original-title="Shopping list"][data-placement="right"] > .nav-link.discrete-link > .nav-link-text`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .navbar-sidenav.navbar-nav > .permission-RECIPES.nav-item-sidebar[data-original-title="Recipes"] > .nav-link.discrete-link[href$="recipes"] > .nav-link-text`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .navbar-sidenav.navbar-nav > .permission-RECIPES_MEALPLAN.nav-item-sidebar[data-original-title="Meal plan"] > .nav-link.discrete-link[href$="mealplan"] > .nav-link-text`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .navbar-sidenav.navbar-nav > .nav-item-sidebar[data-original-title="Chores overview"][data-placement="right"] > .nav-link.discrete-link > .nav-link-text`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .navbar-sidenav.navbar-nav > .nav-item-sidebar[data-original-title="Tasks"][data-placement="right"] > .nav-link.discrete-link[href$="tasks"] > .nav-link-text`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .navbar-sidenav.navbar-nav > .nav-item-sidebar[data-original-title="Batteries overview"][data-placement="right"] > .nav-link.discrete-link > .nav-link-text`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .navbar-sidenav.navbar-nav > .permission-EQUIPMENT.nav-item-sidebar[data-original-title="Equipment"] > .nav-link.discrete-link > .nav-link-text`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .navbar-sidenav.navbar-nav > .permission-CALENDAR.nav-item-sidebar[data-original-title="Calendar"] > .nav-link.discrete-link[href$="calendar"] > .nav-link-text`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .navbar-sidenav.navbar-nav > .permission-STOCK_PURCHASE.nav-item-sidebar[data-original-title="Purchase"] > .nav-link.discrete-link[href$="purchase"] > .nav-link-text`
  - … +23 autres
- http://localhost:8080/productbarcodes/1
  - `#qu_id`
  - `#shopping_location_id`
- http://localhost:8080/productgroup/1
  - `label[for="active"]`
- http://localhost:8080/products
  - `#product-group-filter`
  - `#status-filter`
  - `.even:nth-child(2) > td:nth-child(7)`
  - `.even:nth-child(4) > td:nth-child(7)`
  - `.odd:nth-child(9) > td:nth-child(7)`
  - `.even:nth-child(14) > td:nth-child(7)`
  - `.odd:nth-child(17) > td:nth-child(7)`
  - `.even:nth-child(20) > td:nth-child(7)`
  - `.even:nth-child(22) > td:nth-child(7)`
  - `.odd:nth-child(29) > td:nth-child(7)`
- http://localhost:8080/purchase
  - `#qu_id`
  - `label[for="price-type-unit-price"]`
  - `#productcard-product-journal-button`
  - `#productcard-product-stock-button`
- http://localhost:8080/quantityunitconversion/1
  - `#from_qu_id`
  - `#to_qu_id`
- http://localhost:8080/quantityunitconversionsresolved
  - `#quantity-unit-filter`
- http://localhost:8080/quantityunitpluraltesting
  - `#qu_id`
- http://localhost:8080/recipe/1
  - `#recipe-picture-label`
- http://localhost:8080/recipe/1/pos/1
  - `#qu_id`
- http://localhost:8080/recipes
  - `#status-filter`
  - `#recipe-row-5 > .sorting_1`
  - `#recipe-row-5 > td:nth-child(3)`
  - `#recipe-row-5 > td:nth-child(4) > .timeago-contextual`
- http://localhost:8080/shoppinglist
  - `#selected-shopping-list`
  - `#status-filter`
- http://localhost:8080/shoppinglistitem/1
  - `#shopping_list_id`
  - `#qu_id`
- http://localhost:8080/shoppinglocation/1
  - `label[for="active"]`
- http://localhost:8080/stockentries
  - `#location-filter`
  - `#stock-81-purchased-date-timeago`
  - `#stock-36-purchased-date-timeago`
  - `#stock-37-purchased-date-timeago`
  - `#stock-38-purchased-date-timeago`
  - `#stock-39-purchased-date-timeago`
  - `#stock-40-purchased-date-timeago`
  - `#stock-75-purchased-date-timeago`
  - `#stock-84-purchased-date-timeago`
  - `#stock-41-purchased-date-timeago`
  - … +47 autres
- http://localhost:8080/stockjournal
  - `#product-filter`
  - `#transaction-type-filter`
  - `#location-filter`
  - `#user-filter`
  - `#daterange-filter`
- http://localhost:8080/stockjournal/summary
  - `#product-filter`
  - `#transaction-type-filter`
  - `#user-filter`
- http://localhost:8080/stockoverview
  - `#location-filter`
  - `#product-group-filter`
  - `#status-filter`
  - `a[data-original-title="Consume 1 Gram of Flour"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `a[data-original-title="Mark 1 Gram of Flour as open"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
- http://localhost:8080/stockreports/spendings
  - `#daterange-filter`
  - `#product-group-filter`
- http://localhost:8080/stocksettings
  - `#product_presets_location_id`
  - `#product_presets_product_group_id`
  - `#product_presets_qu_id`
- http://localhost:8080/task/2
  - `#category_id`
- http://localhost:8080/taskcategory/1
  - `label[for="active"]`
- http://localhost:8080/tasks
  - `#category-filter`
  - `#user-filter`
- http://localhost:8080/user/1/sessions
  - `#session-3-row > td:nth-child(7)`
  - `#session-2-row > td:nth-child(7)`
- http://localhost:8080/userfield/1
  - `#entity`
  - `#type`
- http://localhost:8080/userfields
  - `#entity-filter`
- http://localhost:8080/usersettings
  - `#locale`
- http://localhost:8080/stockoverview [state:header-user-menu]
  - `#related-links > .m-1.mt-md-0.mb-md-0:nth-child(1)`
  - `.m-1.mt-md-0.mb-md-0:nth-child(2)`
  - `#info-missing-products > .d-md-block.d-none`
  - `#location-filter`
  - `#product-group-filter`
  - `#status-filter`
  - `a[data-original-title="Consume 1 Gram of Flour"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `a[data-original-title="Mark 1 Gram of Flour as open"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
- http://localhost:8080/stockoverview [state:view-settings-menu]
  - `label[for="night-mode-on"]`
  - `label[for="night-mode-off"]`
  - `#related-links > .m-1.mt-md-0.mb-md-0:nth-child(1)`
  - `.m-1.mt-md-0.mb-md-0:nth-child(2)`
  - `#info-missing-products > .d-md-block.d-none`
  - `#location-filter`
  - `label[for="product-group-filter"]`
  - `#product-group-filter`
  - `label[for="status-filter"]`
  - `#status-filter`
  - … +13 autres
- http://localhost:8080/stockoverview [state:settings-menu]
  - `.m-1.mt-md-0.mb-md-0:nth-child(2)`
  - `.dropdown > .m-1.mt-md-0.mb-md-0`
  - `#info-missing-products > .d-md-block.d-none`
  - `#location-filter`
  - `#product-group-filter`
  - `label[for="status-filter"]`
  - `#status-filter`
  - `#product-13-next-due-date-timeago`
  - `#product-15-next-due-date-timeago`
  - `#product-20-next-due-date-timeago`
  - … +5 autres
- http://localhost:8080/stockoverview [state:about-iframe-dialog]
  - `#location-filter`
  - `#product-group-filter`
  - `#status-filter`
  - `a[data-original-title="Consume 1 Gram of Flour"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `a[data-original-title="Mark 1 Gram of Flour as open"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
- http://localhost:8080/products [state:delete-confirm]
  - `#product-group-filter`
  - `#status-filter`
  - `.bootbox-body`
- http://localhost:8080/purchase [state:combobox-open]
  - `div[data-next-input-selector="#display_amount"] > .invalid-feedback`
  - `label[for="display_amount"]`
  - `#display_amount`
  - `#group-display_amount > .input-group > .invalid-feedback`
  - `#qu_id`
  - `label[for="best_before_date_input"]`
  - `#best_before_date_input`
  - `#best_before_date > .invalid-feedback`
  - `label[for="datetimepicker-shortcut"]`
  - `label[for="price"]`
  - … +9 autres
- http://localhost:8080/purchase [state:datepicker-open]
  - `#qu_id`
  - `label[for="price-type-unit-price"]`
  - `#productcard-product-journal-button`
  - `#productcard-product-stock-button`
- http://localhost:8080/choresoverview [state:chores-filter-expanded]
  - `#status-filter`
  - `#user-filter`
  - `#chore-6-next-execution-time`
  - `#chore-6-next-execution-time-timeago`
  - `#chore-6-last-tracked-time`
  - `#chore-6-last-tracked-time-timeago`
- http://localhost:8080/stockoverview [state:night-mode]
  - `#info-duesoon-products > .d-block.d-md-none`
  - `a[data-original-title="Consume 1 Piece of Cucumber"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `a[data-product-name="Cucumber"][data-product-id="13"][data-product-qu-name="Piece"]:nth-child(3) > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `a[data-original-title="Consume 1 Piece of Tomato"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `a[data-original-title="Mark 1 Piece of Tomato as open"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `a[data-original-title="Consume 1 Pack of Minced meat"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `.product-open-button[data-product-name="Minced meat"][data-product-id="20"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `a[data-original-title="Consume 1 Piece of Eggs"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `a[data-original-title="Mark 1 Piece of Eggs as open"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - `a[data-original-title="Consume 1 Piece of Paprika"] > .number-parsing-done.locale-number-quantity-amount.locale-number`
  - … +73 autres
- http://localhost:8080/products [state:night-mode-dialog]
  - `.bootbox-body`
- http://localhost:8080/stockoverview [state:mobile-nav-390]
  - `.nav-item.dropdown:nth-child(1) > .dropdown-toggle.nav-link[data-toggle="dropdown"]`
  - `a[aria-label="View settings"] > .d-lg-none.d-inline`
  - `a[aria-label="Settings"] > .d-lg-none.d-inline`
  - `#product-11-next-due-date`
  - `#product-11-next-due-date-timeago`
  - `#product-9-next-due-date`
  - `#product-9-next-due-date-timeago`
  - `#product-10-next-due-date`
  - `#product-10-next-due-date-timeago`
  - `#product-27-next-due-date`
  - … +29 autres

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://localhost:8080/batteries
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/batteriesjournal
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/batteriesoverview
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/calendar
  - `.fc-row.table-bordered > table`
- http://localhost:8080/chores
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/choresjournal
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/choresoverview
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/equipment
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/locations
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/manageapikeys
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/mealplan
  - `div[data-section-id="1"] > .fc-view-container > .fc-view.fc-agendaWeek-view.fc-agenda-view > table > .fc-head > tr > .fc-head-container > .fc-row.table-bordered > table`
- http://localhost:8080/mealplansections
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/product/1
  - `#barcode-table_wrapper > .row:nth-child(2) > .col-sm-12 > .dataTables_scroll > .dataTables_scrollHead > .dataTables_scrollHeadInner > .dataTable`
  - `#qu-conversions-table-products_wrapper > .row:nth-child(2) > .col-sm-12 > .dataTables_scroll > .dataTables_scrollHead > .dataTables_scrollHeadInner > .dataTable`
  - `.row:nth-child(1) > .col > table`
  - `.mt-5.row:nth-child(3) > .col > table`
- http://localhost:8080/productgroups
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/products
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/quantityunit/1
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/quantityunitconversionsresolved
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/quantityunits
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/recipe/1
  - `#recipes-pos-table_wrapper > .row:nth-child(2) > .col-sm-12 > .dataTables_scroll > .dataTables_scrollHead > .dataTables_scrollHeadInner > table`
  - `#recipes-includes-table_wrapper > .row:nth-child(2) > .col-sm-12 > .dataTables_scroll > .dataTables_scrollHead > .dataTables_scrollHeadInner > table`
- http://localhost:8080/recipes
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/shoppinglist
  - `.dataTables_scrollHeadInner > .w-100`
- http://localhost:8080/shoppinglocations
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockentries
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockjournal
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockjournal/summary
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockoverview
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockreports/spendings
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/taskcategories
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/tasks
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/user/1/sessions
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/userentities
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/userfields
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/userobjects/exampleuserentity
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/users
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockoverview [state:header-user-menu]
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockoverview [state:view-settings-menu]
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockoverview [state:settings-menu]
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockoverview [state:about-iframe-dialog]
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/products [state:delete-confirm]
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/choresoverview [state:chores-filter-expanded]
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/choresoverview [state:chore-reschedule-modal]
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockoverview [state:night-mode]
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/products [state:night-mode-dialog]
  - `.dataTables_scrollHeadInner > table`
- http://localhost:8080/stockoverview [state:mobile-nav-390]
  - `.dataTables_scrollHeadInner > table`

### aria-allowed-role — ARIA role should be appropriate for the element

- http://localhost:8080/equipment/1
  - `a[data-value="8"]`
  - `a[data-value="9"]`
  - `a[data-value="10"]`
  - `a[data-value="11"]`
  - `a[data-value="12"]`
  - `a[data-value="14"]`
  - `a[data-value="18"]`
  - `a[data-value="24"]`
  - `a[data-value="36"]`
- http://localhost:8080/product/1
  - `.was-validated > .form-group:nth-child(4) > .note-editor.note-frame.card:nth-child(3) > .note-toolbar.card-header[role="toolbar"] > .note-fontsize.note-btn-group.btn-group > .note-btn-group.btn-group > .note-check.dropdown-fontsize[aria-label="Font Size"] > a[data-value="8"][aria-label="8"][role="listitem"]`
  - `.was-validated > .form-group:nth-child(4) > .note-editor.note-frame.card:nth-child(3) > .note-toolbar.card-header[role="toolbar"] > .note-fontsize.note-btn-group.btn-group > .note-btn-group.btn-group > .note-check.dropdown-fontsize[aria-label="Font Size"] > a[data-value="9"][aria-label="9"][role="listitem"]`
  - `.was-validated > .form-group:nth-child(4) > .note-editor.note-frame.card:nth-child(3) > .note-toolbar.card-header[role="toolbar"] > .note-fontsize.note-btn-group.btn-group > .note-btn-group.btn-group > .note-check.dropdown-fontsize[aria-label="Font Size"] > a[data-value="10"][aria-label="10"][role="listitem"]`
  - `.was-validated > .form-group:nth-child(4) > .note-editor.note-frame.card:nth-child(3) > .note-toolbar.card-header[role="toolbar"] > .note-fontsize.note-btn-group.btn-group > .note-btn-group.btn-group > .note-check.dropdown-fontsize[aria-label="Font Size"] > a[data-value="11"][aria-label="11"][role="listitem"]`
  - `.was-validated > .form-group:nth-child(4) > .note-editor.note-frame.card:nth-child(3) > .note-toolbar.card-header[role="toolbar"] > .note-fontsize.note-btn-group.btn-group > .note-btn-group.btn-group > .note-check.dropdown-fontsize[aria-label="Font Size"] > a[data-value="12"][aria-label="12"][role="listitem"]`
  - `.was-validated > .form-group:nth-child(4) > .note-editor.note-frame.card:nth-child(3) > .note-toolbar.card-header[role="toolbar"] > .note-fontsize.note-btn-group.btn-group > .note-btn-group.btn-group > .note-check.dropdown-fontsize[aria-label="Font Size"] > a[data-value="14"][aria-label="14"][role="listitem"]`
  - `.was-validated > .form-group:nth-child(4) > .note-editor.note-frame.card:nth-child(3) > .note-toolbar.card-header[role="toolbar"] > .note-fontsize.note-btn-group.btn-group > .note-btn-group.btn-group > .note-check.dropdown-fontsize[aria-label="Font Size"] > a[data-value="18"][aria-label="18"][role="listitem"]`
  - `.was-validated > .form-group:nth-child(4) > .note-editor.note-frame.card:nth-child(3) > .note-toolbar.card-header[role="toolbar"] > .note-fontsize.note-btn-group.btn-group > .note-btn-group.btn-group > .note-check.dropdown-fontsize[aria-label="Font Size"] > a[data-value="24"][aria-label="24"][role="listitem"]`
  - `.was-validated > .form-group:nth-child(4) > .note-editor.note-frame.card:nth-child(3) > .note-toolbar.card-header[role="toolbar"] > .note-fontsize.note-btn-group.btn-group > .note-btn-group.btn-group > .note-check.dropdown-fontsize[aria-label="Font Size"] > a[data-value="36"][aria-label="36"][role="listitem"]`
  - `.note-editor.note-frame.card:nth-child(4) > .note-toolbar.card-header[role="toolbar"] > .note-fontsize.note-btn-group.btn-group > .note-btn-group.btn-group > .note-check.dropdown-fontsize[aria-label="Font Size"] > a[data-value="8"][aria-label="8"][role="listitem"]`
  - … +17 autres
- http://localhost:8080/recipe/1
  - `a[data-value="8"]`
  - `a[data-value="9"]`
  - `a[data-value="10"]`
  - `a[data-value="11"]`
  - `a[data-value="12"]`
  - `a[data-value="14"]`
  - `a[data-value="18"]`
  - `a[data-value="24"]`
  - `a[data-value="36"]`
- http://localhost:8080/shoppinglist
  - `a[data-value="8"]`
  - `a[data-value="9"]`
  - `a[data-value="10"]`
  - `a[data-value="11"]`
  - `a[data-value="12"]`
  - `a[data-value="14"]`
  - `a[data-value="18"]`
  - `a[data-value="24"]`
  - `a[data-value="36"]`

### target-size — All touch targets must be 24px large, or leave sufficient space

- http://localhost:8080/equipment/1
  - `button[aria-label="More Color"]`
- http://localhost:8080/product/1
  - `.was-validated > .form-group:nth-child(4) > .note-editor.note-frame.card:nth-child(3) > .note-toolbar.card-header[role="toolbar"] > .note-color.note-btn-group.btn-group > .note-color-all.note-color.note-btn-group > .dropdown-toggle[aria-label="More Color"][data-original-title="More Color"]`
  - `.note-editor.note-frame.card:nth-child(4) > .note-toolbar.card-header[role="toolbar"] > .note-color.note-btn-group.btn-group > .note-color-all.note-color.note-btn-group > .dropdown-toggle[aria-label="More Color"][data-original-title="More Color"]`
  - `.content-wrapper.pt-0[role="main"]:nth-child(93) > .container-fluid.pr-1.pl-md-3 > .mb-3.row > .content-text.fa-width-auto.col > .row:nth-child(3) > .col-lg-6.col-12:nth-child(1) > form > .form-group:nth-child(4) > .note-editor.note-frame.card > .note-toolbar.card-header[role="toolbar"] > .note-color.note-btn-group.btn-group > .note-color-all.note-color.note-btn-group > .dropdown-toggle[aria-label="More Color"][data-original-title="More Color"]`
- http://localhost:8080/recipe/1
  - `button[aria-label="More Color"]`
- http://localhost:8080/shoppinglist
  - `button[aria-label="More Color"]`

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://localhost:8080/product/1
  - `nav:nth-child(26) > .navbar-collapse.collapse > .ml-auto.navbar-nav > .dropdown.nav-item:nth-child(2) > .dropdown-menu-right.dropdown-menu > .dropdown-item:nth-child(1) > .form-check > .user-setting-control.form-check-input[data-setting-key="auto_reload_on_db_change"]`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .ml-auto.navbar-nav > .dropdown.nav-item:nth-child(2) > .dropdown-menu-right.dropdown-menu > .dropdown-item:nth-child(2) > .form-check > .user-setting-control.form-check-input[data-setting-key="show_clock_in_header"]`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .ml-auto.navbar-nav > .dropdown.nav-item:nth-child(2) > .dropdown-menu-right.dropdown-menu > .pt-0.dropdown-item > .custom-control-inline.custom-radio.custom-control:nth-child(2) > input[value="on"][name="night-mode"][data-setting-key="night_mode"]`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .ml-auto.navbar-nav > .dropdown.nav-item:nth-child(2) > .dropdown-menu-right.dropdown-menu > .pt-0.dropdown-item > .custom-control-inline.custom-radio.custom-control:nth-child(3) > input[value="follow-system"][name="night-mode"][data-setting-key="night_mode"]`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .ml-auto.navbar-nav > .dropdown.nav-item:nth-child(2) > .dropdown-menu-right.dropdown-menu > .pt-0.dropdown-item > .custom-control-inline.custom-radio.custom-control:nth-child(4) > input[value="off"][name="night-mode"][data-setting-key="night_mode"]`
  - `.is-dirty.user-setting-control[data-setting-key="auto_night_mode_enabled"]`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .ml-auto.navbar-nav > .dropdown.nav-item:nth-child(2) > .dropdown-menu-right.dropdown-menu > .dropdown-item:nth-child(5) > .mt-1.form-check > .user-setting-control.form-check-input[type="checkbox"]`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .ml-auto.navbar-nav > .dropdown.nav-item:nth-child(2) > .dropdown-menu-right.dropdown-menu > .dropdown-item:nth-child(7) > .form-check > .user-setting-control.form-check-input[data-setting-key="keep_screen_on"]`
  - `nav:nth-child(26) > .navbar-collapse.collapse > .ml-auto.navbar-nav > .dropdown.nav-item:nth-child(2) > .dropdown-menu-right.dropdown-menu > .dropdown-item:nth-child(8) > .form-check > .user-setting-control.form-check-input[type="checkbox"]`
  - `.is-dirty[name="name"][value="Cookies"]`
  - … +37 autres

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:8080/product/1
  - `.is-dirty[name="name"][value="Cookies"]`
  - `.was-validated > .form-group:nth-child(2) > .custom-checkbox.custom-control > .form-check-input[name="active"][value="1"]`
  - `.combobox-container:nth-child(3) > .input-group > .product-combobox.barcodescanner-input[placeholder=""]`
  - `.was-validated > .form-group:nth-child(5) > .custom-select[name="location_id"]`
  - `.was-validated > .form-group:nth-child(6) > .custom-select[name="default_consume_location_id"]`
  - `.was-validated > .form-group:nth-child(6) > .custom-checkbox.custom-control > .form-check-input[name="move_on_open"][value="1"]`
  - `.shopping-location-combobox.is-dirty[placeholder=""]`
  - `.was-validated > .mb-1.form-group:nth-child(8) > .input-group > input[name="min_stock_amount"][value="8"][min="0.0000"]`
  - `.was-validated > .mb-1.form-group:nth-child(9) > .custom-checkbox.custom-control > .form-check-input[value="1"][type="checkbox"]`
  - `.was-validated > .form-group:nth-child(10) > .custom-checkbox.custom-control > .form-check-input[name="treat_opened_as_out_of_stock"][value="1"]`
  - … +60 autres
- http://localhost:8080/userfield/1
  - `#name`

### frame-tested — Frames should be tested with axe-core

- http://localhost:8080/stockoverview [state:about-iframe-dialog]
  - `iframe`

