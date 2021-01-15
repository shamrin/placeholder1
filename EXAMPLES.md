# SQL on the frontend, safely

* Firebase-like real-time automatically synchronized database between frontend and backend
* Full power of SQL, Postgres under the hood
* No API or backend needed
* Safe, user are restricted to their own data, using [Postgres row security](https://www.postgresql.org/docs/13/ddl-rowsecurity.html)
* Optimistic updates, frontend shows most recent data without server round trip
* Built-in authentication

In other words, it's like [Supabase](https://supabase.io/), but with SQL and optimistic updates, and (hopefully) simpler.

Notes on the examples below:
* Authentication not demostrated 
* Powered by [React](https://reactjs.org)

## Hello world

#### Data definition
```sql
CREATE TABLE user (name text);
ALTER TABLE user ENABLE ROW LEVEL SECURITY;
CREATE POLICY user ON user TO userid
    USING (userid = current_user);
```

#### Show "Hello, username"
```js
import ReactDOM from 'react-dom'
import { use } from 'placeholder/react'
function Hello() {
  const user = use.fetchValue(`select name from user`)
  return <p>Hello, {user}</p>
}
ReactDOM.render(<Hello />, document.getElementById('hello'))
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
```js
import ReactDOM from 'react-dom'
import { use } from 'placeholder/react'
import { execute } from 'placeholder'
function Incrementer() {
  const counter = use.fetchValue(`select value from counter`)
  const increment = () => execute(`update counter set value = value + 1`)
  return <button onClick={increment}>{counter}</button>
}
ReactDOM.render(<Incrementer />, document.getElementById('incrementer'))
```

Counter updates right away, without waiting for server to confirm the update.

#### Admin UI
```js
import ReactDOM from 'react-dom'
import { use } from 'placeholder/react'
function Incrementer() {
  let counters = use.fetchAll(`select counterid, name, value from counter join user on userid`)

  return (
    <table>
      {counters.map(({counterid, name, value}) => {
        <tr key={counterid}><td>{name}</td><td>{value}</td></tr>
      })}
    </table>
  )  
}
ReactDOM.render(<Incrementer />, document.getElementById('incrementer'))
```

## Query params, SQL-injection safe

```js
import { fetchValue, sql } from 'placeholder'

const userid = 42
const name = fetchValue(sql`select name from user where userid = ${userid}`))
console.log(`Hello, ${name}`)
```

## "Hello world" in Svelte

```svelte
<script>
import { fetchValue } from 'placeholder/svelte'
const user = fetchValue(`select name from user`)
</script>

<p>Hello, {$user}</p>
```

(`fetchValueStore` is a [readable store](https://svelte.dev/tutorial/readable-stores).)

## FAQ

**Isn't it dangerous to allow access to database from the browser?**

Yes, but not with "placeholder*. It's safe with us:

1. We parse the query on the server using Postgres original SQL parser, and check that queries are among the safe subset. 
2. You have to set up security rules (uses Postgres row security under the head), to make sure users see their own data. 
3. We automatically warn you if your security rules are unsafe. You will not open the whole database to the world by accident.
4. Security rules are all in one place, Firebase-style. It makes them easy to review.

**Okay, but could heavy aggregate queries DoS the database?**

It's your responsibility to not overload the database. However, once the server is deployed to production, all existing queries are effectively frozen. We will deny any other queries. It means if you've never used heavy aggregate queries in user context, they will not allow in production.

**To get to optimistic updates you need to implement SQL in the frontend. Isn't it crazy?**

Yes, but we don't need to implement **all** of it. We support only a useful subset. We will simply skip optimistic updates for unsupported queries (with a warning during development).

**Bobby tables?**

See "Query params" and [placeholder.ts](./placeholder.ts)
