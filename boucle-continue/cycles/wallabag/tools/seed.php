<?php
// Cycle 38 (wallabag) — deterministic entry seed.
// Upstream EntryFixtures fetch 24 live external URLs; unreachable sources make
// that path non-replayable. This seed writes equivalent realistic content
// (title, url, full HTML body with links/images, tags, archives, favorites,
// annotations, i18n) directly into sqlite.
//
// Usage (inside a container that mounts the data volume):
//   php seed.php /path/to/wallabag.sqlite

$dbPath = $argv[1] ?? '/var/www/html/data/db/wallabag.sqlite';
$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$userId = (int) $pdo->query("SELECT id FROM wallabag_user WHERE username = 'wallabag'")->fetchColumn();
if (!$userId) {
    fwrite(STDERR, "user wallabag not found — run wallabag:install first\n");
    exit(1);
}

// --- config utilisateur (équivalent ConfigFixtures) ---
$configId = (int) $pdo->query("SELECT id FROM wallabag_config WHERE user_id = $userId")->fetchColumn();
if (!$configId) {
    fwrite(STDERR, "wallabag_config missing for user $userId\n");
    exit(1);
}
$pdo->exec("UPDATE wallabag_config SET items_per_page = 30, reading_speed = 200, language = 'en', action_mark_as_read = 0, list_mode = 0, display_thumbnails = 1 WHERE id = $configId");

// --- tags (équivalent TagFixtures : 14 labels) ---
$tagLabels = ['wallabag', 'self-hosted', 'privacy', 'open-source', 'ereader', 'kobo',
    'migration', 'pocket', 'omnivore', 'read-it-later', 'tutorial', 'review', 'howto', 'news'];
$insTag = $pdo->prepare('INSERT INTO wallabag_tag (label, slug) VALUES (?, ?)');
foreach ($tagLabels as $label) {
    $exists = $pdo->query("SELECT COUNT(*) FROM wallabag_tag WHERE label = " . $pdo->quote($label))->fetchColumn();
    if (!$exists) {
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $label));
        $insTag->execute([$label, $slug]);
    }
}
$tags = [];
foreach ($pdo->query("SELECT id, label FROM wallabag_tag") as $row) {
    $tags[$row['label']] = (int) $row['id'];
}

// --- tagging rules (équivalent TaggingRuleFixtures ; tags = simple_array) ---
$taggingRules = [
    ['rule' => 'title matches "wallabag"', 'tags' => 'wallabag'],
    ['rule' => 'title matches "pocket"', 'tags' => 'pocket,migration'],
    ['rule' => 'title matches "omnivore"', 'tags' => 'omnivore,migration'],
    ['rule' => 'title matches "kobo"', 'tags' => 'ereader,kobo'],
    ['rule' => 'readingTime <= 5', 'tags' => 'shortread'],
    ['rule' => 'readingTime > 5', 'tags' => 'longread'],
    ['rule' => 'domainName = "nicolas.loeuillet.org"', 'tags' => 'wallabag,news'],
];
$insRule = $pdo->prepare('INSERT INTO wallabag_tagging_rule (config_id, rule, tags) VALUES (?, ?, ?)');
foreach ($taggingRules as $r) {
    $exists = $pdo->query("SELECT COUNT(*) FROM wallabag_tagging_rule WHERE config_id = $configId AND rule = " . $pdo->quote($r['rule']))->fetchColumn();
    if (!$exists) {
        $insRule->execute([$configId, $r['rule'], $r['tags']]);
    }
}

// --- ignore-origin rules (équivalent IgnoreOriginUserRuleFixtures) ---
foreach (['host = "feedproxy.google.com"', 'host = "l.facebook.com"'] as $rule) {
    $exists = $pdo->query("SELECT COUNT(*) FROM wallabag_ignore_origin_user_rule WHERE config_id = $configId AND rule = " . $pdo->quote($rule))->fetchColumn();
    if (!$exists) {
        $pdo->prepare('INSERT INTO wallabag_ignore_origin_user_rule (config_id, rule) VALUES (?, ?)')
            ->execute([$configId, $rule]);
    }
}

function body(array $paragraphs): string {
    return implode("\n", $paragraphs);
}

// Each entry: title, url slug (host defines domain_name), tags, flags, content paragraphs.
$entries = [
    [
        'title' => 'Welcome to wallabag 2.6: what changed',
        'url' => 'https://blog.wallabag.io/posts/2026/03/wallabag-2-6-release-notes/',
        'tags' => ['wallabag', 'news'],
        'starred' => true,
        'language' => 'en',
        'published_by' => ['The wallabag team'],
        'body' => [
            '<p>wallabag 2.6 ships a reworked tag filter bar, a faster content extractor and a rewritten settings screen. The update is rolling out to wallabag.it and to self-hosted instances through the usual channels.</p>',
            '<p>The biggest change is the new <a href="https://doc.wallabag.org/en/user/articles">article preview pipeline</a>, which now caches cleaned content per domain. Repeat saves from the same site resolve in a fraction of a second.</p>',
            '<p>Readers who upgraded from 2.5 will notice that the tagging rules engine finally supports regular expressions on the URL, not only on the title. Existing rules are migrated automatically.</p>',
            '<p>See the <a href="https://github.com/wallabag/wallabag/releases">full changelog</a> for the list of 120 merged pull requests, including accessibility fixes in the Materialize navigation drawer.</p>',
        ],
    ],
    [
        'title' => 'Self-hosting a read-it-later list in 2026',
        'url' => 'https://selfhosted.example.org/articles/self-hosting-read-it-later-2026',
        'tags' => ['self-hosted', 'read-it-later'],
        'language' => 'en',
        'body' => [
            '<p>Running your own article archive keeps your reading habits private and your history durable across provider shutdowns. wallabag, linkding and shiori cover most use cases today.</p>',
            '<p>A minimal wallabag setup needs a PHP runtime, a database — sqlite is fine for a single user — and optionally a Redis queue for background imports. The official <a href="https://hub.docker.com/r/wallabag/wallabag">Docker image</a> bundles all three.</p>',
            '<p>Keep backups boring: copy the sqlite file nightly and test a restore once a quarter. The database is the only state that matters; assets can always be rebuilt.</p>',
            '<blockquote><p>The best backup is the one you verified last month, not the one you scheduled last year.</p></blockquote>',
        ],
    ],
    [
        'title' => 'The state of web privacy for readers',
        'url' => 'https://privacyblog.example.net/2026/state-of-web-privacy-for-readers',
        'tags' => ['privacy'],
        'starred' => true,
        'language' => 'en',
        'body' => [
            '<p>Every article you save tells a service something about you: what you read, when, and for how long. Centralized read-it-later providers turned that signal into a profiling business.</p>',
            '<p>Client-side extraction changes the calculus. When your own server fetches the article, the publisher sees a request, not a reading habit. Pair it with <a href="https://www.eff.org/issues/privacy">EFF guidance on tracker blocking</a> in the browser and the data trail shrinks considerably.</p>',
            '<p>None of this requires going offline. It only requires that the sync layer be boring infrastructure instead of a surveillance product.</p>',
        ],
    ],
    [
        'title' => 'Migrating a decade of Pocket saves to wallabag',
        'url' => 'https://migratetech.example.com/posts/pocket-to-wallabag-migration',
        'tags' => ['migration', 'pocket'],
        'archived' => true,
        'language' => 'en',
        'published_by' => ['M. Keller'],
        'body' => [
            '<p>Exporting from Pocket produces a single HTML file of links. wallabag ingests it from the Import page, then queues a fetch for every URL in the background.</p>',
            '<p>Large archives are best imported in slices. Splitting the export into chunks of a few hundred links keeps failures isolated and retryable through the <a href="https://doc.wallabag.org/en/user/import">import documentation</a> workflow.</p>',
            '<p>Tags survive the trip if they were already in the export; everything else lands in Untagged for a manual pass later.</p>',
        ],
    ],
    [
        'title' => 'Omnivore shutdown: lessons for hosted note apps',
        'url' => 'https://ossweekly.example.org/omnivore-shutdown-lessons',
        'tags' => ['omnivore', 'migration'],
        'archived' => true,
        'starred' => true,
        'language' => 'en',
        'body' => [
            '<p>Omnivore joined Elephas and closed its hosted service, reminding everyone that even open-source clients die when the server is proprietary.</p>',
            '<p>The community response was instructive: exports were available within days, and projects like wallabag published <a href="https://github.com/wallabag/wallabag/issues">import bridges</a> within weeks.</p>',
            '<p>The durable pattern is boring: local-first storage, standard export formats, and a server you can afford to run yourself.</p>',
        ],
    ],
    [
        'title' => 'Sending wallabag articles to a Kobo e-reader',
        'url' => 'https://ereadertips.example.net/kobo-wallabag-sync-guide',
        'tags' => ['ereader', 'kobo'],
        'language' => 'en',
        'body' => [
            '<p>Kobo devices running recent firmware can pull articles straight from a wallabag account through the built-in Pocket compatibility layer.</p>',
            '<p>Articles arrive as clean EPUB-like documents: title, body text and embedded images. Font size and margins follow the reader settings, not the website.</p>',
            '<p>Sync runs on Wi-Fi connect; articles you archive on the reader come back marked read in the web UI, which keeps both surfaces honest.</p>',
        ],
    ],
    [
        'title' => 'How to import an old Pocket export without losing tags',
        'url' => 'https://howto.example.com/import-pocket-export-keep-tags',
        'tags' => ['howto', 'pocket'],
        'archived' => true,
        'language' => 'en',
        'body' => [
            '<p>Pocket exports ship tags embedded in the HTML anchor attributes. wallabag reads them during import, but only if the export was generated after Pocket added that feature.</p>',
            '<p>For older exports, run the file through the community <a href="https://github.com/wallabag/wallabag/issues">tag-repair scripts</a> first, or accept a weekend of manual triage.</p>',
        ],
    ],
    [
        'title' => 'RSS is not dead, it just went quiet',
        'url' => 'https://feedsforever.example.net/rss-quiet-renaissance',
        'tags' => ['news'],
        'language' => 'en',
        'body' => [
            '<p>Every few years someone publishes the RSS obituary, and every few years the feed readership quietly grows. Newsletters with RSS escape hatches, podcasts, and federated blogging all ride the same plumbing.</p>',
            '<p>Pairing a feed reader with a save-for-later queue remains the calmest way to consume the web: pull what you follow, queue what you want to finish, archive what mattered.</p>',
            '<ul><li>Feed reader for discovery</li><li>Read-it-later for depth</li><li>Archive for memory</li></ul>',
        ],
    ],
    [
        'title' => 'Selbsthosting auf einem kleinen VPS',
        'url' => 'https://selbsthosten.example.de/artikel/kleiner-vps-setup',
        'tags' => ['self-hosted'],
        'language' => 'de',
        'body' => [
            '<p>Ein kleiner virtueller Server mit zwei vCPUs reicht für eine persönliche wallabag-Instanz problemlos aus. Wichtiger als reine Leistung sind verlässliche Snapshots und ein schlanker Software-Stack.</p>',
            '<p>Wer SQLite statt MySQL wählt, spart sich einen Dienst und eine Backup-Spur. Die <a href="https://doc.wallabag.org/de/admin/installation">deutsche Installationsanleitung</a> beschreibt beide Varianten Schritt für Schritt.</p>',
        ],
    ],
    [
        'title' => 'Terminal notes: a calmer command-line workflow',
        'url' => 'https://terminalnotes.example.org/posts/calmer-cli-workflow',
        'tags' => [],
        'language' => 'en',
        'body' => [
            '<p>Aliases rot. Dotfiles drift. The only shell configuration that survives contact with a new machine is the one small enough to remember.</p>',
            '<p>Three rules helped: keep aliases under ten lines, prefer scripts with names over flags with muscle memory, and write the weird incantations down in a place you actually search — in my case, a wallabag tag.</p>',
        ],
    ],
    [
        'title' => 'Review: read-it-later apps after the consolidation wave',
        'url' => 'https://appreviews.example.com/read-it-later-2026-review',
        'tags' => ['review', 'read-it-later'],
        'archived' => true,
        'language' => 'en',
        'body' => [
            '<p>Two acquisitions and one shutdown later, the read-it-later landscape is smaller but healthier. Wallabag remains the default answer for self-hosters; Instapaper quietly kept working for everyone else.</p>',
            '<p>Scoring criteria for this review: export fidelity, offline behavior, tagging flexibility, and whether the company still exists next year.</p>',
            '<p><img src="https://picsum.photos/seed/wlb38review/640/320" alt="Comparison table of read-it-later apps"></p>',
        ],
    ],
    [
        'title' => 'Tutorial: writing tagging rules that actually help',
        'url' => 'https://tutorials.example.org/wallabag-tagging-rules-tutorial',
        'tags' => ['tutorial', 'wallabag'],
        'language' => 'en',
        'annotated' => 'The rules engine evaluates conditions in order and stops at the first match.',
        'body' => [
            '<p>Tagging rules look trivial until you have three hundred articles and a hundred tags. The rules engine evaluates conditions in order and stops at the first match, so ordering is the whole game.</p>',
            '<p>Start with domains you save constantly — the newspaper you read every morning deserves its own rule before you tune edge cases. The <a href="https://doc.wallabag.org/en/user/errors_during_fetching">fetch-error guide</a> also explains which sites need site-credentials before rules will ever fire.</p>',
            '<p>A rule you cannot explain in one sentence is a rule that will surprise you in six months.</p>',
        ],
    ],
    [
        'title' => 'A short note on CSS contrast tokens',
        'url' => 'https://cssnotes.example.net/contrast-tokens-short-note',
        'tags' => [],
        'language' => 'en',
        'annotated' => 'Naming contrast pairs as tokens forces the decision to be made once.',
        'body' => [
            '<p>Color tokens are only as honest as the contrast pairs they encode. Naming a pair — surface, on-surface — forces the contrast decision to be made once, in one place, instead of rediscovered at every component.</p>',
        ],
    ],
    [
        'title' => 'Deep dive: how content extraction pipelines fail',
        'url' => 'https://engineering.example.org/content-extraction-pipeline-failures',
        'tags' => ['open-source'],
        'archived' => true,
        'starred' => true,
        'language' => 'en',
        'body' => [
            '<p>Content extraction is a game of probabilistic cleanup: strip navigation, keep article text, guess where the byline went. Every heuristic that saves a page breaks another one somewhere.</p>',
            '<p>Graby — the extractor wallabag embeds — resolves this with site-specific config files that override the generic algorithm. Over a thousand sites have hand-tuned selectors, which is less elegant than machine learning and far more debuggable.</p>',
            '<p>When extraction fails, the debug loop is honest: fetch the raw HTML, run the extractor locally, and read which heuristic swallowed the content. No model weights to blame, just XPath.</p>',
            '<p><img src="https://picsum.photos/seed/wlb38ex/640/280" alt="Diagram of the extraction pipeline stages"></p>',
        ],
    ],
];

$now = new DateTime('2026-10-01 12:00:00', new DateTimeZone('UTC'));
$insertEntry = $pdo->prepare('INSERT INTO wallabag_entry
    (user_id, title, url, hashed_url, given_url, hashed_given_url, is_archived, archived_at,
     is_starred, starred_at, content, created_at, updated_at, published_at, published_by,
     mimetype, language, reading_time, domain_name, preview_picture, http_status, is_not_parsed, uid)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
$linkTag = $pdo->prepare('INSERT INTO wallabag_entry_tag (entry_id, tag_id) VALUES (?,?)');
$insertAnn = $pdo->prepare('INSERT INTO wallabag_annotation
    (user_id, entry_id, text, created_at, updated_at, quote, ranges)
    VALUES (?,?,?,?,?,?,?)');

$pdo->beginTransaction();
$i = 0;
foreach ($entries as $e) {
    $i++;
    $created = (clone $now)->modify('-' . (20 - $i) . ' days');
    $archived = !empty($e['archived']);
    $starred = !empty($e['starred']);
    $content = body($e['body']);
    $wordCount = str_word_count(strip_tags($content));
    $readingTime = max(1, (int) round($wordCount / 200));
    $domain = parse_url($e['url'], PHP_URL_HOST);
    $hasPublishedBy = !empty($e['published_by']);
    // uid déterministe (23 chars hex) — l'URL publique /share/{uid} du seed doit
    // être rejouable à l'identique, donc jamais de random_bytes ici.
    $uid = substr(sha1('cycle38-entry-' . $i), 0, 23);

    $insertEntry->execute([
        $userId,
        $e['title'],
        $e['url'],
        sha1($e['url']),
        $e['url'],
        sha1($e['url']),
        $archived ? 1 : 0,
        $archived ? $created->format('Y-m-d H:i:s') : null,
        $starred ? 1 : 0,
        $starred ? $created->format('Y-m-d H:i:s') : null,
        $content,
        $created->format('Y-m-d H:i:s'),
        $created->format('Y-m-d H:i:s'),
        $hasPublishedBy ? $created->format('Y-m-d H:i:s') : null,
        $hasPublishedBy ? serialize($e['published_by']) : null,
        'text/html',
        $e['language'],
        $readingTime,
        $domain,
        'https://picsum.photos/seed/wlb38e' . $i . '/400/200',
        '200',
        0,
        $uid,
    ]);
    $entryId = (int) $pdo->lastInsertId();
    foreach ($e['tags'] as $tagLabel) {
        if (isset($tags[$tagLabel])) {
            $linkTag->execute([$entryId, $tags[$tagLabel]]);
        }
    }
    if (!empty($e['annotated'])) {
        $ranges = serialize([['start' => '/p[1]', 'startOffset' => 0, 'end' => '/p[1]', 'endOffset' => 20]]);
        $insertAnn->execute([
            $userId, $entryId,
            'Benchmark annotation: ' . $e['annotated'],
            $created->format('Y-m-d H:i:s'), $created->format('Y-m-d H:i:s'),
            $e['annotated'], $ranges,
        ]);
    }
}
$pdo->commit();

foreach (['unread' => 'is_archived = 0', 'archived' => 'is_archived = 1', 'starred' => 'is_starred = 1'] as $k => $w) {
    echo $k . ': ' . $pdo->query("SELECT COUNT(*) FROM wallabag_entry WHERE $w")->fetchColumn() . "\n";
}
echo 'tags linked: ' . $pdo->query('SELECT COUNT(*) FROM wallabag_entry_tag')->fetchColumn() . "\n";
echo 'annotations: ' . $pdo->query('SELECT COUNT(*) FROM wallabag_annotation')->fetchColumn() . "\n";
echo 'untagged: ' . $pdo->query('SELECT COUNT(*) FROM wallabag_entry e WHERE NOT EXISTS (SELECT 1 FROM wallabag_entry_tag t WHERE t.entry_id = e.id)')->fetchColumn() . "\n";
echo "done\n";
