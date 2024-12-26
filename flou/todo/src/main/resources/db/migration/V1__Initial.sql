CREATE TABLE todo (
    id BIGSERIAL
         PRIMARY KEY,
    account_id BIGINT
        NOT NULL,
    name TEXT
         NOT NULL,
    done boolean
         NOT NULL
);
