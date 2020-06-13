BEGIN TRANSACTION;

INSERT INTO users (name,email,entries, joined, pet,age) values ('Eren','a','5','2018-01-01','cat','18');
INSERT INTO login (hash,email) values ('$2a$10$mY16T2zxColsoIalXYLCl.9D8hyDWXeLOcvMmrXZ4xLq4JFmBMpUC','a');

COMMIT;

