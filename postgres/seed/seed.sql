BEGIN TRANSACTION;

INSERT INTO users (name,email,entries, joined) values ('Eren','eren@test.com',5,'2018-01-01');
INSERT INTO login (hash,email) values ('$2a$10$TXntm3SK4yZa9FZrTrMCgeDuNbBzSUT2lpFA/Fzc44hTZKLqorBOu','eren@test.com');

COMMIT;

