{
  # config.hjson — cycle 55, format release 0.19.x (admin_password via setup).
  setup: {
    admin_username: "lemmy"
    admin_password: "Lemmy55-Admin-Pass!"
    site_name: "lemmy-bench"
  }
  database: {
    host: "postgres"
    user: "lemmy"
    password: "lemmy55dbpass"
    database: "lemmy"
    pool_size: 10
  }
  # hostname externe inclut le port du cycle (proxy nginx :9655) — les URL
  # pictrs/fédérées générées doivent résoudre depuis le navigateur du harnais.
  hostname: "localhost:{{UI_PORT}}"
  bind: "0.0.0.0"
  port: 8536
  tls_enabled: false
  pictrs: {
    url: "http://pictrs:8080/"
    api_key: "lemmy55pictrs"
    image_mode: "None"
  }
  # stack de bench : quotas relevés pour permettre le seed/API de façon
  # déterministe (le backend et le harnais partagent la même IP source nginx).
  rate_limit: {
    message: 10000
    message_per_second: 60
    post: 10000
    post_per_second: 600
    register: 10000
    register_per_second: 60
    image: 10000
    image_per_second: 60
    comment: 10000
    comment_per_second: 60
    search: 10000
    search_per_second: 60
    import_user_settings: 10000
    import_user_settings_per_second: 60
  }
}
