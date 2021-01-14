# SQL on the frontend, safely

* Firebase-like real-time automatically synchronized database between frontend and backend
* User are restricted to their own data, using [Postgres row security](https://www.postgresql.org/docs/13/ddl-rowsecurity.html)
* Optimistic updates, frontend shows most recent data without server round trip
* Built-in authentication

In other words, [Supabase](https://supabase.io/), but with SQL and optimistic updates, and (hopefully) simpler.

## Hello world:

Data definition:
```sql
CREATE TABLE user (name text);
ALTER TABLE user ENABLE ROW LEVEL SECURITY;
CREATE POLICY user ON user TO userid
    USING (userid = current_user);
```

Frontend (Svelte):
```html
<script>
import { getone } from "magic";
let name = getone(`select name from user`)
</script>

<p>Hello, $name</p>
```

## Optimistic updates

Data definition:
```sql
CREATE TABLE counter (counterid serial, value int, userid references user);
ALTER TABLE counter ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_counter ON counter TO userid
    USING (userid = current_user);
```

Frontend:
```html
<script>
import { execute } from "magic";
let counter = query(`select value from counter`)
let userid = query(`select userid from user`)

function increment() {
  execute(`update counter set value = value + 1`)
}
</script>

<button on:click={increment}>{counter}</p>
```

Admin UI:
```html
<script>
import { getall } from "magic";
let user_counters = getall(`select counterid, name, value from counter join user on userid`)
</script>

<table>
{#each user_counters as { counterid, name, value } (counterid)}
    <tr><td>{name}</td><td>{value}</td></tr>
{/each}
</table>
```
