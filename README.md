# Prerequisites

```
yarn
```

# Running

```
make dev
```

Open http://localhost:4411 in the browser.

# Postgres

```
brew install postgres
brew services start postgresql
```

```
psql postgres
> CREATE ROLE placeholder WITH LOGIN PASSWORD 'placeholder';
> CREATE DATABASE placeholder;
> \q
psql postgres -U placeholder
```

```
create table record
(
  id   serial not null
    constraint table_name_pkey
    primary key,
  data jsonb
);
```
