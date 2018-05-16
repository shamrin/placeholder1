DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS conversation;
DROP TABLE IF EXISTS message;

CREATE TABLE "user" (id INTEGER PRIMARY KEY);
CREATE TABLE employee (user_id INTEGER PRIMARY KEY, name text);
CREATE TABLE customer (user_id INTEGER PRIMARY KEY);
CREATE TABLE conversation (id INTEGER PRIMARY KEY, customer_id INTEGER, created_at TIMESTAMP);
CREATE TABLE message (id INTEGER PRIMARY KEY, conversation_id INTEGER, sender_user_id INTEGER, "text" TEXT, sent_at TIMESTAMP);

INSERT INTO "user" VALUES (1);
INSERT INTO "user" VALUES (2);
INSERT INTO "user" VALUES (3);
INSERT INTO "user" VALUES (4);

INSERT INTO employee VALUES (1, 'John');
INSERT INTO employee VALUES (2, 'Mary');

INSERT INTO customer VALUES (3);
INSERT INTO customer VALUES (4);

INSERT INTO conversation VALUES (1, 3, TIMESTAMP 'epoch' + INTERVAL '1 second'); 
INSERT INTO conversation VALUES (2, 3, TIMESTAMP 'epoch' + INTERVAL '100 second'); 
INSERT INTO conversation VALUES (3, 4, TIMESTAMP 'epoch' + INTERVAL '200 second');

INSERT INTO message VALUES (1, 2, 3, 'hi', TIMESTAMP 'epoch' + INTERVAL '101 second');
INSERT INTO message VALUES (2, 2, 3, 'how are you?', TIMESTAMP 'epoch' + INTERVAL '102 second');
INSERT INTO message VALUES (3, 2, 1, 'oh, hi', TIMESTAMP 'epoch' + INTERVAL '110 second');
INSERT INTO message VALUES (4, 2, 1, 'i am good thank you', TIMESTAMP 'epoch' + INTERVAL '111 second');
