CREATE USER itaygold WITH PASSWORD 'password';

CREATE DATABASE nodelogin;

GRANT ALL PRIVILEGES ON DATABASE nodelogin TO itaygold;


\c nodelogin
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(200),
    email VARCHAR(200),
    password VARCHAR(200)
);


GRANT ALL PRIVILEGES ON TABLE users TO itaygold;

GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO itaygold;
