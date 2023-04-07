---
title: Functional API
author: Xie Yuheng
date: 2023-02-04
---

Is it ok to use functional API instead of OOP API?

Maybe we should not say functional API,
because it is full of side-effects,
maybe we should just say procedural programming.

OOP API create a `db` object from options,
and all the methods are in `db`.

```typescript
type Data = JsonObject & { "@id": string }
type FindOptions = { properties: Record<string, JsonAtom> }

class Database {
  constructor(public options: { path: string })
  resolve(path: string): string
  async create(prefix: string, json: JsonObject): Promise<Data>
  async put(id: string, json: JsonObject): Promise<Data>
  async getOrFail(id: string): Promise<Data>
  async get(id: string): Promise<Data | undefined>
  async patch(id: string, json: JsonObject): Promise<Data>
  async delete(id: string): Promise<void>
  async *all(prefix: string): AsyncIterable<Data>
  async *find(prefix: string, options: FindOptions): AsyncIterable<Data>
}
```

But, because we want to do many many things to the database,
maybe it does not make sense to implement
all the functions as methods in the class.

What FP API will be?

```typescript
type Database = { path: string }
type Data = JsonObject & { "@id": string }
type FindOptions = { properties: Record<string, JsonAtom> }

Db.resolve(db: Database, path: string): string
Db.create(db: Database, prefix: string, json: JsonObject): Promise<Data>
Db.put(db: Database, id: string, json: JsonObject): Promise<Data>
Db.getOrFail(db: Database, id: string): Promise<Data>
Db.get(db: Database, id: string): Promise<Data | undefined>
Db.patch(db: Database, id: string, json: JsonObject): Promise<Data>
Db.deleteData(db: Database, id: string): Promise<void>
Db.*all(db: Database, prefix: string): AsyncIterable<Data>
Db.*find(db: Database, prefix: string, options: FindOptions): AsyncIterable<Data>
```

It is clear that all the functions are state-less,
the database is state-ful.

How about dependency injection?

Beside the options of database,
we have not used dependency injection at all.
Maybe we do not need it, and the API will be
easier to understand without it.

Maybe we should have the following rule:

1. We should never use `class` for the syntax sugar -- `object.method(arg)`.

2. We should use `class` when there is a real open `interface`.

3. We should use `class` specially when the `interface` is stable
   and we have many implementation of it.

4. We should use `interface` instead of `abstract class`,
   because the later is for handling complicated cases like fallback,
   in this situation, maybe we should just use closed type instead.
