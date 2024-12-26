CREATE TABLE account (
    id BIGSERIAL
         PRIMARY KEY,
     username TEXT
         UNIQUE
         NOT NULL,
     password_hash TEXT
         NOT NULL
);

CREATE TABLE session (
     id BIGSERIAL
         PRIMARY KEY,
     token_hash TEXT
         NOT NULL,
     account_id BIGINT
         REFERENCES account(id) ON DELETE CASCADE
         NOT NULL
);
