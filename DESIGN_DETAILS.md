# Placeholder project plan

## Desired features

1. No backend.
2. Radically simplified state-management on the client-side. It means no Redux.
3. Automatically synchronized backend-frontend state.
4. Powerful query language from the client side.

## How to  get there?

We are going to allow SQL from the client-side. We will parse SQL with one of [libpg_query][libpg] implementations in order to:

1. whitelist safe sql (known statements, allowed tables etc.)
2. add information about the current user id to the query. The user id will be checked by database, because `CONSTRAINT`s.
3. allow client-side mini-postgres implementation. At the beginning it could be a bare-bones implmentation, with very simple queries supported.

## Open questions

* [ ] Client-vs-server synchronisation protocol
* [x] Choosing libpg_query variant (plain C vs Golang vs Node.js vs Python 2 vs Python 3 vs Ruby)
* [ ] Data model
* [x] Way to add user id information to the queries
* [ ] Language to specify security and validation rules. See Firebase and Firestore documentation.
* [x] Backend implementation language
* [x] Executing queries browser-side, for optimistic caching (and non-persistent use?)
* [ ] Lovefield DSL vs SQL

### Executing (relational?) queries browser-side

**Option 1: Lovefield**

* [Design documentation](https://github.com/google/lovefield/tree/master/docs/dd)
* [Lovefield is a relational database for web apps](https://google.github.io/lovefield/)
* [Demetrios Papadopoulos: Lovefield | JS.LA January 2015](https://www.youtube.com/watch?v=pwCzMFoheGw)
* [Generating SQL from Lovefield API](https://github.com/google/lovefield/blob/master/lib/query/to_sql.js)

> It's a mature library and is used in G-Mail. There's not really a need to promote it since it works and serves Google well.
>
> The future plan of Lovefield is to keep it as-is. We (the Lovefield team) is working on pushing majority part of the Lovefield API to W3C, and hoping that browsers will incorporate relational database. Current work can be found at
>
> https://github.com/arthurhsu/rdb<br>
> https://github.com/arthurhsu/rdb-polyfill
>
> Please note that this is a multi-year work and an uphill battle. Browser vendors killed WebSQL long ago and it's hard to persuade them that relational database is a necessity of web standards.

https://groups.google.com/forum/#!msg/lovefield-users/tXClOBzDhMo/9XsRNEtBBgAJ

**Other options**

* https://github.com/yathit/ydn-db
* https://github.com/agershun/alasql
* https://github.com/tonsky/datascript
* https://github.com/dfahlander/Dexie.js/wiki/Dexie.js

**SyncKit research**

VeejayRampay:

> Now they only need to add a "commitToServer()" feature that uses some diff since the last commit and we got a stew going.
>
> That tech is promising though, I like that we're opening new possibilities all the time.

eob:

> We did this with sqlite about six years back and got awesome performance results. It was a system called SyncKit. Still would have preferred relational storage in the browser, but glad to see at least we're moving toward something.
>
> http://edwardbenson.com/papers/www2010-synckit.pdf

https://news.ycombinator.com/item?id=8658632

### Lovefield DSL vs SQL

Having Lovefield DSL makes it tempting to use the DSL instead of SQL. Lovefield DSL advantages:

* smaller language, easier to port to another database or a library
* no security problems with SQL injections
* no need to deal with string concatations, easier code to look at
* we could use easier-to-analyze data structure for passing and validating queries (no need for libpg_query library at all)

Disadvantages:

* no JSON support (we could *probably* fake it by automatically mapping Postgres JSONs into Lovefield fields)
* no subqueries
* no recursive queries
* no RIGHT JOINs support
* overall, cannot have queries that transparently use Postgres features and are ignored by browser-side code (by we (just?) loose optimistic caching in this case)


### Backend implementation language

|   | Advantages | Disadvantages |
| ------------- | ------------- |-----|
| TypeScript  | share types with frontend;<br>familiar language;<br>can use emscripten / libpg_query | messy libraries;<br>not trivial to deploy |
| Golang  | single binary to deploy;<br>fun to learn the language;<br>high quality libraries;<br>awesome community | verbose language;<br>need to rebuild types¹; |
| Rust  | single binary to deploy;<br>fun to learn the language;<br>type safety;<br>awesome community | hard to learn;<br>not trivial to build;<br>need to rebuild types¹;<br>need to choose threads-vs-async |
| Elixir | fun to learn the language;<br>Phoenuix has full browser-server example | not trivial to deploy;<br>no types? |
| Python | favourite language;<br>MyPy is less powerful than TypeScript | not trivial to deploy;<br>need to rebuild types¹;<br>async-compatible libraries for everything |

¹: Or write a compiler from TypeScript types to backend language

### Adding user id information

**Option 1:** [Postgres roles + row security policies][row-security], with Postgres [`current_user`][pg-user] built-in and [`SET ROLE`][set-role] statement or [`SECURITY DEFINER`][pg-function] attribute in functions.

> The session_user is normally the user who initiated the current database connection; but superusers can change this setting with SET SESSION AUTHORIZATION. The current_user is the user identifier that is applicable for permission checking. Normally it is equal to the session user, but it can be changed with SET ROLE. It also changes during the execution of functions with the attribute SECURITY DEFINER. In Unix parlance, the session user is the “real user” and the current user is the “effective user”. current_role and user are synonyms for current_user. (The SQL standard draws a distinction between current_role and current_user, but PostgreSQL does not, since it unifies users and roles into a single kind of entity.)

(from [`current_user` documentation][pg-user])

Option 1 seems to be the most interesting option. Need to review the following though:

* https://wiki.postgresql.org/wiki/Row-security
* https://news.ycombinator.com/item?id=11535801
* https://gist.github.com/luben/4ab60b0dbda66ecf4b6601b88c852272 (linked from the first HN thread comment)
* https://medium.com/@cazzer/practical-application-of-row-level-security-b33be18fd198
* "It'd probably be better to have a user with all roles granted as NOINHERIT (so the only thing it can do is SET ROLE) and all connections defaulting to that, then when you get a connection from the pool you "SET ROLE current_user" and you "RESET ROLE" the connection before storing it back. I have not tested it." - "i do just that and it works like a charm." ([HN thread][noinherit])

**Option 2:** backend code manually checks for rules.

**Option 3:** add something like the following to all `WHERE json_lookup(data, "user_id") = current_user_id` to all incoming queries. Requires deparsing support in libpg_query variant (see below).

### Choosing libpg_query variant

* **Plain C** is the most supported, because it's used by all other implementations. However, it lacks deparsing.
* **Ruby** is the most supported, and has deparsing feature.
* **Golang** is good, and also coming from the [libg_query][libpg] author, but it lacks deparsing. There's an [interesting discussion regarding deparsing][go-deparse].
* **Python 3** has deparsing, license is limiting (GPL).
* **Python 2** has no deparsing, license is fine.
* **Node.js** has deparsing, somewhat abandonded.
* **Emscripten-compiled plain C** for browser and Node.js. Little dated, but should be easy to update, because it's just another build. No deparsing.

The proper solution is implementing deparsing in C. See [discussion on Golang issue][go-deparse]. But it's the most difficult.

The short-term solution is to take the most-supported version with deparsing: Ruby. This requires to write whitelisting + extending queries with user id info in Ruby. Which should be fine. It's just a language.

It's also tempting to choose a language with good pattern support, for whitelisting implementation, but none of the above have that. It could be Rust / Erlang / Elixir / OCaml, but well..

## References

### Firebase Firestore client code

Yes, it's *surprisingly* open-source: https://github.com/firebase/firebase-js-sdk/tree/master/packages/firestore

### Hacker New [discussion thread][hn] on Firestore announcement

With Chris Granger:

**ibdknox:**
> How do you deal with consistency in the offline case? E.g. If I make a bunch of edits while disconnected, and others have made edits while connected, how are the conflicts resolved?

**mikelehen:**
> This works similar to the Realtime Database in that it's last-write wins (where in the offline case, "last" is the last person to come back online and send their write to the backend). This model is very easy for developers to understand and directly solves many use cases, especially since we allow very granular writes which reduces the risk of conflicts. But for more complex use cases, you can get clever and implement things like OT conflict resolution as a layer on top of last-write wins, e.g. similar to how we implemented collaborative editing with www.firepad.io on the realtime database.
>
> PS: Hi Chris! :-)

**ibdknox:**
> Hey Michael! Congrats on the launch :)
>
> Providing a one-size-fits-all solution here is probably impossible, but it seems like it would be nice to provide some mechanism to be notified that you're making edits based on stale information. If such a mechanism existed, it would be easy to add a bunch of canned merge strategies. In doing so you can probably teach people a little bit about the pitfalls they're likely to run into (these sorts of bugs are insanely difficult to track down), while not really making them do much work.
>
> The approach we've taken in Eve is that we can't solve all these problems for you, but we can at least let you know that things can go sideways and prompt you to make a deliberate decision about what should happen. It's amazing how helpful that ends up being.

**mikelehen:**
> Thanks for the feedback. I think you're right and we're interested in exploring what we can do to help people more in the future. One of the really nice things about Cloud Firestore is that documents are versioned with timestamps in such a way that we could definitely detect and expose conflicts and let you decide how to deal with them... It's mostly a matter of identifying the common use cases and then figuring out the right API to make them possible without going too far into the deep end of conflict resolution.

With another guy:
	
**cfilipov:**
> Regarding offline mode. How is sync done? Is this OT based? How are conflicts resolved?

**mikelehen:**
> Good question, and to answer this well we should probably do a blog post or something. In the meantime you could dig into the code since the clients are all open source. :-)
>
> But basically, sync is split into two halves: writes and listens. Clients store pending writes locally until they're flushed to the backend (which could be a long time if the app is running offline). While online, listen results are streamed from the backend and persisted in a local client cache so that the results will also be visible while offline (and any pending writes are merged into this offline view). When a client comes back online, it flushes its pending writes to the backend which are executed in a last-write-wins manner (see my answer above to ibdknox for more details on this). To resume listens, the client can use a "resume token" which allows the backend to quickly get the client back up-to-date without needing to re-send already retrieved results (there are some nuances here depending on how old the resume token is, etc.).

[libpg]: https://github.com/lfittl/libpg_query
[hn]: https://news.ycombinator.com/item?id=15393396
[go-deparse]: https://github.com/lfittl/pg_query_go/issues/4
[row-security]: https://www.postgresql.org/docs/10/static/ddl-rowsecurity.html
[pg-user]: https://www.postgresql.org/docs/10/static/functions-info.html
[set-role]: https://www.postgresql.org/docs/10/static/sql-set-role.html
[pg-function]: https://www.postgresql.org/docs/10/static/sql-createfunction.html.
[noinherit]: https://news.ycombinator.com/item?id=8405778
