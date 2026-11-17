// Owns the shared Postgres pool. The pool, the query helper and transaction
// handling stay in this folder; repositories in `src/modules` import only this
// file.
