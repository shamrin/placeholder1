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

* https://github.com/shamrin/blog2/blob/master/2018-05-11-placeholder-project.md
