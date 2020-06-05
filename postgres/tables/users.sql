BEGIN TRANSACTION;

create table users (
    id serial PRIMARY KEY,
    name varchar(100),
    email text unique not null ,
    entries bigint default 0,
    joined timestamp not null 
);

COMMIT;