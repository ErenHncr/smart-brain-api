BEGIN TRANSACTION;

create table login ( 
    id serial PRIMARY KEY,
    hash varchar(100) not null,
    email text unique not null
);

COMMIT;