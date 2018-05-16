Customer-side:

* INSERT message
* SELECT 10 recent messages

Employee-side:

* SELECT 10 recent conversations, ordered by time and replied boolean
* INSERT message

Auth:

* customers can add their own messages to their own conversions
* customers can read their own convesions
* employee can add his own messages to any conversation
* employee can read any conversation
* (optional?) customer can only get their own employees info (name + photo)

Collections:

* user: {id}
* customer: {user_id}
* employee: {user_id, name, photo}
* conversation: {customer_id, created_at}
* message: {conversation_id, sender_user_id, text, sent_at}

Queries:

* Customer wants to see messages:

```sql
SELECT message.sent_at, message.text, message.sender_user_id, employee.name, employee.photo, employee.user_id
  FROM message, conversation, employee
 WHERE conversation.customer_id = current_user
   AND message.conversation_id = conversation_id
   AND employee.user_id = message.sender_user_id
 ORDER BY sent_at DESC;
```

```sql
CREATE TABLE "user" (id INTEGER PRIMARY KEY);
CREATE TABLE employee (user_id INTEGER PRIMARY KEY, name text);
CREATE TABLE customer (user_id INTEGER PRIMARY KEY);
CREATE TABLE conversation (id INTEGER PRIMARY KEY, customer_id INTEGER, created_at DATE);
CREATE TABLE message (id INTEGER PRIMARY KEY, conversation_id INTEGER, sender_user_id INTEGER, "text" TEXT, sent_at DATE);
```

```sql
INSERT INTO "user" VALUES (1);
INSERT INTO "user" VALUES (2);
INSERT INTO "user" VALUES (3);
INSERT INTO "user" VALUES (4);

INSERT INTO employee VALUES (1, 'John');
INSERT INTO employee VALUES (2, 'Mary');

INSERT INTO customer VALUES (3);
INSERT INTO customer VALUES (4);
```

```sql
DROP TABLE user;
DROP TABLE employee;
DROP TABLE customer;
DROP TABLE conversation;
DROP TABLE message;
```
