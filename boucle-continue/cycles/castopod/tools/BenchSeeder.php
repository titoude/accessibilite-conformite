<?php

declare(strict_types=1);

/**
 * BenchSeeder — cycle 50 (boucle a11y). Seed DÉTERMINISTE du banc :
 * superadmin « bench-admin », un podcast « Audit Waves » (@auditwaves) avec
 * cover/banner réels générés en GD, 3 épisodes publiés avec vrais mp3 (sine
 * ffmpeg), un épisode programmé (futur), une page custom, un contributeur.
 * Fichier recopié dans app/Database/Seeds/ par tools/seed.sh — banc only,
 * JAMAIS dans patch.diff (untracked).
 *
 * @copyright  2026 — outillage banc a11y, hors produit
 */

namespace App\Database\Seeds;

use App\Entities\Episode;
use App\Entities\Page;
use App\Entities\Podcast;
use App\Models\EpisodeModel;
use App\Models\PageModel;
use App\Models\PersonModel;
use App\Models\PodcastModel;
use CodeIgniter\Database\Seeder;
use CodeIgniter\Files\File;
use CodeIgniter\I18n\Time;
use CodeIgniter\Shield\Entities\User;
use Modules\Auth\Models\UserModel;

class BenchSeeder extends Seeder
{
    private const ASSETS = WRITEPATH . 'bench-assets';

    public function run(): void
    {
        $this->makeAssets();

        // ---------- superadmin banc ----------
        $users = auth()->getProvider();
        if ((new UserModel())->where('username', 'bench-admin')->first() === null) {
            $user = new User([
                'username' => 'bench-admin',
                'email'    => 'bench-admin@c50.local',
                'password' => 'AuditC50-Pass-Seed!',
                'is_owner' => true,
            ]);
            $users->save($user);
            $user = $users->findById($users->getInsertID());
            $user->addGroup(setting('AuthGroups.mostPowerfulGroup'));
        } else {
            $user = (new UserModel())->where('username', 'bench-admin')->first();
        }
        $uid = (int) $user->id;

        // ---------- podcast « Audit Waves » ----------
        // getPodcastByHandle exige published_at passé — requête brute pour l'idempotence
        $existing = $this->db->table('podcasts')->where('handle', 'auditwaves')->get()->getRow();
        if ($existing !== null) {
            return; // idempotent
        }

        // purge d'éventuels résidus d'un run partiel (podcast + medias orphelins)
        foreach ($this->db->table('podcasts')->like('handle', 'auditwaves%')->get()->getResult() as $p) {
            $this->db->table('episodes')->where('podcast_id', $p->id)->delete();
            $this->db->table('podcasts_persons')->where('podcast_id', $p->id)->delete();
            $this->db->table('podcasts')->where('id', $p->id)->delete();
            $this->db->table('fediverse_actors')->where('id', $p->actor_id)->delete();
        }
        $this->db->table('media')->like('file_key', 'podcasts/auditwaves/%')->delete();

        $podcast = new Podcast([
            'created_by'           => $uid,
            'updated_by'           => $uid,
            'title'                => 'Audit Waves',
            'handle'               => 'auditwaves',
            'cover'                => new File(self::ASSETS . '/cover.jpg'),
            'banner'               => new File(self::ASSETS . '/banner.jpg'),
            'description_markdown' => "Bulletin hebdomadaire du banc d'audit.\n\nChaque épisode passe au crible une surface publique : [suivre le projet Castopod](https://castopod.org/) et **mesurer** ce qui change vraiment.\n\n- Landmark et titres\n- Contrastes réels\n- Clavier et lecteurs d'écran",
            'language_code'        => 'en',
            'category_id'          => 1,
            'parental_advisory'    => 'clean',
            'owner_name'           => 'Bench A11y',
            'owner_email'          => 'bench-owner@c50.local',
            'publisher'            => 'Cycle 50',
            'type'                 => 'episodic',
            'copyright'            => '© 2026 Bench',
            'is_blocked'           => false,
            'is_completed'         => false,
            'is_locked'            => false,
            'is_premium_by_default' => false,
            'published_at'         => Time::now()->subDays(12),
        ]);

        $podcastModel = new PodcastModel();
        $newPodcastId = $podcastModel->insert($podcast, true);
        if (! $newPodcastId) {
            throw new \RuntimeException('podcast insert failed: ' . json_encode($podcastModel->errors()));
        }

        config('AuthGroups')->generatePodcastAuthorizations((int) $newPodcastId);
        add_podcast_group($user, (int) $newPodcastId, setting('AuthGroups.mostPowerfulPodcastGroup'));

        // ---------- épisodes publiés ----------
        $episodeModel = new EpisodeModel();
        $episodes = [
            [
                'title' => 'Repérage : la page publique du podcast',
                'slug'  => 'reperage-page-publique',
                'desc'  => "Premier épisode du banc.\n\nOn y décortique la hiérarchie des titres et les landmarks de la page podcast, avec un [lien vers la documentation CodeIgniter](https://codeigniter.com/user_guide/).",
                'number' => 1,
                'audio'  => 'ep1.mp3',
                'days'   => 9,
            ],
            [
                'title' => 'Contrastes : mesurer avant de corriger',
                'slug'  => 'contrastes-mesurer-avant-corriger',
                'desc'  => "Deuxième épisode.\n\n*Pourquoi* un ratio 4.5:1 ne se devine pas : on mesure le pixel réel. Référence : [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).",
                'number' => 2,
                'audio'  => 'ep2.mp3',
                'days'   => 5,
            ],
            [
                'title' => 'Le player embarqué passé au clavier',
                'slug'  => 'player-embarque-au-clavier',
                'desc'  => "Troisième épisode.\n\nTab, Entrée, Échap : tout ce que le player doit accepter. Bonus : [WCAG 2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html).",
                'number' => 3,
                'audio'  => 'ep3.mp3',
                'days'   => 1,
            ],
        ];

        foreach ($episodes as $e) {
            $published = Time::now()->subDays($e['days']);
            $episode = new Episode([
                'created_by'           => $uid,
                'updated_by'           => $uid,
                'podcast_id'           => (int) $newPodcastId,
                'title'                => $e['title'],
                'slug'                 => $e['slug'],
                'guid'                 => null,
                'audio'                => new File(self::ASSETS . '/' . $e['audio']),
                'cover'                => null,
                'description_markdown' => $e['desc'],
                'transcript'           => null,
                'chapters'             => null,
                'parental_advisory'    => 'clean',
                'number'               => $e['number'],
                'season_number'        => null,
                'type'                 => 'full',
                'is_blocked'           => false,
                'is_premium'           => false,
                'published_at'         => $published,
            ]);
            $episodeId = $episodeModel->insert($episode, true);
            if (! $episodeId) {
                throw new \RuntimeException('episode insert failed: ' . json_encode($episodeModel->errors()));
            }
        }

        // épisode programmé (futur) — surface admin « scheduled »
        $future = new Episode([
            'created_by'           => $uid,
            'updated_by'           => $uid,
            'podcast_id'           => (int) $newPodcastId,
            'title'                => 'Épisode programmé du banc',
            'slug'                 => 'episode-programme-banc',
            'guid'                 => null,
            'audio'                => new File(self::ASSETS . '/ep4.mp3'),
            'cover'                => null,
            'description_markdown' => 'Épisode non encore publié (date future).',
            'parental_advisory'    => 'clean',
            'number'               => 4,
            'type'                 => 'full',
            'is_blocked'           => false,
            'is_premium'           => false,
            'published_at'         => Time::now()->addDays(7),
        ]);
        $episodeModel->insert($future, true);

        // ---------- page custom ----------
        (new PageModel())->insert(new Page([
            'title'            => 'À propos du banc',
            'slug'             => 'a-propos-du-banc',
            'content_markdown' => "Cette page documente le banc d'audit.\n\nRetrouvez le protocole sur [le dépôt de la boucle](https://github.com/titoude/accessibilite-conformite).",
        ]), true);

        // ---------- contributeur (cast/host du podcast) ----------
        $personModel = new PersonModel();
        $personId = $personModel->insert([
            'full_name'       => 'Nadia Rêve',
            'unique_name'     => 'nadia-reve',
            'information_url' => 'https://example.org/nadia',
            'created_by'      => $uid,
            'updated_by'      => $uid,
        ], true);
        $personModel->addPodcastPerson((int) $newPodcastId, (int) $personId, 'cast', 'host');
    }

    /**
     * Génère les assets factices : cover 1400×1400, banner 1500×500 (GD),
     * 3 mp3 sine distincts (ffmpeg présent dans l'image cp50-php).
     */
    private function makeAssets(): void
    {
        if (! is_dir(self::ASSETS)) {
            mkdir(self::ASSETS, 0o775, true);
        }

        $mkJpg = static function (string $path, int $w, int $h, int $r, int $g, int $b, string $label): void {
            if (is_file($path)) {
                return;
            }
            $img = imagecreatetruecolor($w, $h);
            $bg = imagecolorallocate($img, $r, $g, $b);
            imagefill($img, 0, 0, $bg);
            $fg = imagecolorallocate($img, 255, 255, 255);
            imagestring($img, 5, intdiv($w, 2) - 60, intdiv($h, 2), $label, $fg);
            imagejpeg($img, $path, 90);
            imagedestroy($img);
        };

        $mkJpg(self::ASSETS . '/cover.jpg', 1400, 1400, 0, 148, 134, 'AUDIT WAVES');
        $mkJpg(self::ASSETS . '/banner.jpg', 1500, 500, 17, 24, 39, 'AUDIT WAVES — BANNER');

        foreach (['ep1' => 330, 'ep2' => 440, 'ep3' => 550, 'ep4' => 660] as $name => $freq) {
            $mp3 = self::ASSETS . "/{$name}.mp3";
            if (! is_file($mp3)) {
                exec(sprintf('ffmpeg -y -f lavfi -i sine=frequency=%d:duration=8 -q:a 6 %s 2>/dev/null', $freq, escapeshellarg($mp3)));
            }
        }
    }
}
