# configuration.py — banc cycle 52 (copié par tools/boot.sh dans le checkout ;
# gitignoré upstream — JAMAIS dans patch.diff : config de banc, pas du produit).
# Hôtes = aliases du réseau docker du cycle (netbox52-db / netbox52-redis).

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'netbox',
        'USER': 'netbox',
        'PASSWORD': 'nb52secret',
        'HOST': 'netbox52-db',
        'PORT': 5432,
        'CONN_MAX_AGE': 300,
    }
}

REDIS = {
    'tasks': {
        'HOST': 'netbox52-redis',
        'PORT': 6379,
        'USERNAME': '',
        'PASSWORD': '',
        'DATABASE': 0,
        'SSL': False,
    },
    'caching': {
        'HOST': 'netbox52-redis',
        'PORT': 6379,
        'USERNAME': '',
        'PASSWORD': '',
        'DATABASE': 1,
        'SSL': False,
    }
}

SECRET_KEY = 'nb52-bench-key-not-a-real-secret-0123456789abcdef0123456789abcdef'

API_TOKEN_PEPPERS = {
    1: 'nb52-pepper-not-secret-0123456789abcdef0123456789abcdef01234567',
}

# DEBUG=False + runserver --insecure : statiques servis via finders (STATICFILES_DIRS),
# recharge les templates à chaque requête — le patch de templates/static est
# effectif sans collectstatic ni restart. INTERNAL_IPS=[] neutralise la
# django-debug-toolbar (aucune injection de markup dans le DOM audité).
DEBUG = False  # bench : production-like — toolbar+debug-banner absents; statics via runserver --insecure
INTERNAL_IPS = ['8.8.8.8']  # IP injoignable → debug-toolbar réellement off (INTERNAL_IPS=[] l'ACTIVE chez NetBox)

DEFAULT_LANGUAGE = 'en-us'
TIME_ZONE = 'UTC'

LOGIN_TIMEOUT = None
LOGO_IMAGE = None
