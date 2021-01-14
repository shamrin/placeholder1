# SQL on the frontend, safely

* Firebase-like automatic data sync between frontend and backend
* User are restricted to their own data, using [Postgres row security](https://www.postgresql.org/docs/13/ddl-rowsecurity.html)
* Optimistic updates, frontend shows most recent data without server round trip

In other words, Supabase, but with SQL and optimistic updates, and (hopefully) simpler.

## Hello world:

Data definition:
```sql
CREATE TABLE user (name text);
ALTER TABLE user ENABLE ROW LEVEL SECURITY;
CREATE POLICY user ON user TO userid
    USING (userid = current_user);
```

Hello world (Svelte):
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
CREATE TABLE counter (value int, userid references user);
ALTER TABLE counter ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_counter ON counter TO userid
    USING (userid = current_user);
```

Counter (with optimistic updates):
```html
<script>
import { execute } from "magic";
let counter = query(`select value from counter`)
let userid = query(`select userid from user`)

function increment() {
  execute(`update counter set value = value + 1`)
  
  // equivalent to:
  execute(q`update counter set value = value + 1 where userid = {userid}`)
}
</script>

<button on:click={increment}>{counter}</p>
```
