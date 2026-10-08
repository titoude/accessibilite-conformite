# Dockerfile — cycle 52 netbox. Image applicative : python:3.12-slim + deps
# système pour psycopg[c] (libpq-dev = pg_config, gcc = compilateur C).
# requirements.txt du checkout est copié puis installé VERBATIM — c'est
# l'étape « install verrouillée » du cycle : l'image fige les dépendances.
FROM python:3.12-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends gcc g++ libpq-dev pkg-config git make \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/netbox
COPY requirements.txt /opt/netbox/requirements.txt
RUN pip install --no-cache-dir -r /opt/netbox/requirements.txt

# Le checkout complet est monté à /opt/netbox au runtime (voir tools/boot.sh).
WORKDIR /opt/netbox/netbox
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000", "--noreload"]
