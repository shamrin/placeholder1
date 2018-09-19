# TODO

* [x] update libpq_query emscripten build (2h)
* [ ] test
* [ ] libpg_query library
* [ ] web server with websocket
* [ ] make `SELECT * from record` work
* [ ] row security policies

# Design

## Query language

SQL subset

## Data model

* Firestore collections == Postgres tables
* Firestore document == Postgres `jsonb` column (for now)
* Firestore database == Postgres database

## Security rules language

TBD

# See also

* [DESIGN_DETAILS](./DESIGN_DETAILS.md)
* http://lokijs.org
* https://github.com/Nozbe/WatermelonDB ([via](https://news.ycombinator.com/item?id=17950992))
* https://realm.io/products/realm-database/
* https://sqorn.org
