# SQL on the frontend, safely

* Firebase-like real-time automatically synchronized database between frontend and backend
* Full power of SQL, Postgres under the hood
* No API or backend needed
* Safe, user are restricted to their own data, using [Postgres row security](https://www.postgresql.org/docs/13/ddl-rowsecurity.html)
* Optimistic updates, frontend shows most recent data without server round trip
* Built-in authentication

In other words, [Supabase](https://supabase.io/), but with SQL and optimistic updates, and (hopefully) simpler.

Notes:
* Authentication is not demostrated below
* Frontend code examples below are using [Svelte](https://svelte.dev/)

## Hello world

#### Data definition
```sql
CREATE TABLE user (name text);
ALTER TABLE user ENABLE ROW LEVEL SECURITY;
CREATE POLICY user ON user TO userid
    USING (userid = current_user);
```

#### Show "Hello, username"
```html
<script>
import { getone } from "magic"
let name = getone(`select name from user`)
</script>

<p>Hello, $name</p>
```

## Optimistic updates

#### Data definition
```sql
CREATE TABLE counter (counterid serial, value int, userid references user);
ALTER TABLE counter ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_counter ON counter TO userid
    USING (userid = current_user);
```

#### Button showing how many time you've clicked on it
```html
<script>
import { execute, getone } from "magic"
let counter = getone(`select value from counter`)
function increment() {
  execute(`update counter set value = value + 1`)
}
</script>

<button on:click={increment}>{counter}</p>
```

Counter updates right away, without waiting for server to confirm the update.

#### Admin UI
```svelte
<script>
import { getall } from "magic"
let user_counters = getall(`select counterid, name, value from counter join user on userid`)
</script>

<table>
{#each user_counters as { counterid, name, value } (counterid)}
    <tr><td>{name}</td><td>{value}</td></tr>
{/each}
</table>
```

## FAQ

**Is it possible to implement?**

Yes.

**How?**

LOL.

**To get to optimistic updates you need to implement SQL in the frontend. Isn't it crazy?**

Yes, but we don't need to implement **all** of it. Some sane subset is enough. We will simply skip optimistic updates for unsupported queries (with a warning during development).
