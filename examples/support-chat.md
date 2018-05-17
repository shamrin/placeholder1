Customer-side:

* [ ] INSERT message
* [x] SELECT 10 recent messages

Employee-side:

* [ ] SELECT 10 recent conversations, ordered by time and replied boolean
* [ ] INSERT message

Auth:

* [ ] customers can add their own messages to their own conversions
* [ ] customers can read their own convesions
* [ ] employee can add his own messages to any conversation
* [ ] employee can read any conversation
* [ ] (optional?) customer can only get their own employees info (name + photo)

Collections:

* user: {id}
* customer: {user_id}
* employee: {user_id, name, photo}
* conversation: {customer_id, created_at}
* message: {conversation_id, sender_user_id, text, sent_at}

Queries:

* Init database:

```sh
psql postgres -U placeholder -a -f support-chat-init.sql
```

* Customer wants to see their messages:

```sql
SELECT m.id, m.sent_at, m.text, m.sender_user_id, c.id AS c_id, e.name AS employee_name, e.user_id AS employee_user_id
 FROM conversation AS c
 RIGHT JOIN message AS m ON m.conversation_id = c.id
 LEFT JOIN employee AS e ON e.user_id = m.sender_user_id
 WHERE c.customer_id = 3
 ORDER BY m.sent_at DESC;
```
