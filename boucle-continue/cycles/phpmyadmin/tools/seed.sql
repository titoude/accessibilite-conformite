-- Cycle 31 phpmyadmin — seed réelle (reconstituée depuis events worker + preuves baseline)
-- 3 tables + 1 vue dans a11ydb
CREATE DATABASE IF NOT EXISTS a11ydb;
USE a11ydb;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(190) NOT NULL,
    bio TEXT NULL,
    homepage VARCHAR(190) NULL,
    is_admin TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_username (username)
);

INSERT INTO users (username, email, bio, homepage, is_admin) VALUES
('alice', 'alice@example.com', 'Developer', 'https://alice.dev', 1),
('bob', 'bob@example.com', NULL, NULL, 0),
('carol', 'carol@example.com', 'Designer', 'https://carol.art', 0),
('dan', 'dan@example.com', NULL, NULL, 0),
('eve', 'eve@example.com', 'Admin', 'https://eve.io', 1);

CREATE TABLE IF NOT EXISTS access_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(45),
    url VARCHAR(255),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO access_log (ip, url) VALUES
('10.0.0.1', '/index.php'),
('10.0.0.2', '/table/browse'),
('10.0.0.3', '/sql'),
('10.0.0.4', '/table/structure'),
('10.0.0.5', '/database/designer');

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(64),
    active TINYINT DEFAULT 0,
    created TIMESTAMP
);

INSERT INTO projects (title, active) VALUES
('alpha', 1), ('beta', 0), ('gamma', 1), ('delta', 0), ('epsilon', 1);

CREATE OR REPLACE VIEW v_open_projects AS
    SELECT id, title, created FROM projects WHERE active = 1;
