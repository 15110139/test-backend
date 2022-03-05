CREATE DATABASE test;

CREATE TABLE t_user (
    id VARCHAR(64) NOT NULL,
    create_date DATE NOT NULL,
    modify_date date NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    name VARCHAR(64) NOT NULL,
    date_of_birth date NOT NULL,
    email VARCHAR(64) NOT NULL,
    password TEXT NOT NULL,
    photo_url TEXT DEFAULT NULL,
    phone_numer VARCHAR(15) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE t_blog (
    id VARCHAR(64) NOT NULL,
    create_date DATE NOT NULL,
    modify_date date NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id VARCHAR(64) DEFAULT NULL,
    PRIMARY KEY (id)
);
