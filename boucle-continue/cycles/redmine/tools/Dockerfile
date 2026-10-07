# Image dérivée pour le cycle 40 — Redmine @10d61f8 (7.0.2.devel).
# L'image officielle redmine:latest embarque la release 7.0.2 SANS toolchain de
# build : son entrypoint fait `bundle check || bundle install` mais échoue sur
# les gems natifs de HEAD (json 3.0.2…). Ici on reconstruit une image complète
# depuis les sources du dépôt (patch appliqué sur l'hôte, arbre COPYé) :
#   docker build -t redmine40-img -f tools/Dockerfile <clone>
FROM mirror.gcr.io/library/redmine:latest

USER root
WORKDIR /usr/src/redmine

# Toolchain pour les extensions natives exigées par le Gemfile de HEAD.
RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential pkg-config \
    libsqlite3-dev libyaml-dev \
 && rm -rf /var/lib/apt/lists/*

# Bundler : pas de groupes dev/test (capybara, selenium…) — env, pas de fichier.
ENV BUNDLE_WITHOUT="development:test"

# Dépendances d'abord (couche cachée tant que le Gemfile ne change pas).
# Gemfile.local = mécanisme amont pour gems locales : puma (serveur rails,
# ajouté au Gemfile de la release par le Dockerfile officiel, absent de HEAD).
COPY Gemfile config.ru Rakefile ./
COPY config/ config/
COPY lib/ lib/
COPY bin/ bin/
# config/database.yml est gitignored amont : le build a besoin d'un fichier
# minimal (sqlite3) ; l'entrypoint amont le régénère au runtime si absent.
RUN printf 'production:\n  adapter: sqlite3\n  database: "db/redmine.sqlite3"\n  encoding: "utf8"\n' > config/database.yml \
 && echo 'gem "puma"' > Gemfile.local && bundle install

# Sources complètes ensuite (toute retouche ne casse que les couches finales).
COPY --chown=redmine:redmine . .

# Assets propshaft cuits dans l'image (redmine_detect_update les régénérerait
# au boot sinon). SECRET factice juste pour la compile.
RUN mkdir -p db files log tmp public/assets \
 && chown -R redmine:redmine db files log tmp public \
 && SECRET_KEY_BASE=buildtime-dummy bundle exec rake assets:precompile
