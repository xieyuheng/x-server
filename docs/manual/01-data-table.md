---
title: Data Table
---

To implement the idea of using file system as database,
we must first answer the question about
the familiar concept of _data table_.

- **Problem 1.1:** How should we represent data table in file system?

- **Solution 1.1.A:** Using a directory of JSON files to represent a table,
  where each JSON file represents a row of the table,
  and the name of the file relative to the root of the database
  is viewed as the primary key of the row.

  For example:

  ```
  users/xieyuheng.json
  users/readonlylink.json
  users/mimor.json
  ```

  The primary keys will be:

  ```
  xieyuheng.json
  readonlylink.json
  mimor.json
  ```

This seems is the most simple solution, but we can not use it,
because we want to use subdirectory relation
to represent "has one" and "has many" relations,
while a file can not have any subdirectory at all.

- **Solution 1.1.B:** Using a directory of directories to represent a table,
  where each subdirectory contains one JSON file named `index.json`
  that represents a row of the table,
  and the name of the subdirectory relative to the root of the database
  is viewed as the primary key of the row.

  For example:

  ```
  users/xieyuheng/index.json
  users/readonlylink/index.json
  users/mimor/index.json
  ```

  The primary keys will be:

  ```
  xieyuheng
  readonlylink
  mimor
  ```

Note that, different from **Solution 1.1.A**,
in **Solution 1.1.B** a primary key does not have the `.json` file extension,
this is a good feature.

We talked about representing "has one" and "has many" relations
many many times already, let's articulate it as a problem
and solve it once for all.

By the way, the form of problem and solution is learned from a book called [Scalable C](https://readonly.link/books/https://books.readonly.link/scalable-c/book.json).

- **Problem:** How should we represent "has one" and "has many" relations in file system?

Actually we should view them as two different problems,
with the condition that the solutions of them must feel symmetric together.

- **Problem 1.2:** How should we represent "has many" relations in file system?

- **Solution 1.2:** The data belong to another data,
  should be represented as subdirectory belong to the corresponding directory.

  For example, "a user has many projects",
  then each user has a subdirectory called "projects".

  The pattern of directories will be:

  ```
  users/*/projects/*/index.json
  ```

  Concrete examples:

  ```
  users/xieyuheng/index.json
  users/xieyuheng/projects/inner/index.json
  users/xieyuheng/projects/pomodoro/index.json
  users/xieyuheng/projects/learn-x/index.json
  users/xieyuheng/projects/cell-complex/index.json

  users/readonlylink/index.json
  users/readonlylink/projects/x-node/index.json
  users/readonlylink/projects/x-markdown/index.json
  ```

- **Problem 1.3:** How should we represent "has one" relations in file system?

- **Solution 1.3:** The data belong to another data,
  should be represented as subdirectory belong to the corresponding directory.

  (This principle is the same as **Solution 1.2** for **Problem 1.2**.)

  For example, "a user has one config",
  then each user has a subdirectory called "config".

  The pattern of directories will be:

  ```
  users/*/config/index.json
  ```

  Concrete examples:

  ```
  users/xieyuheng/index.json
  users/xieyuheng/config/index.json

  users/readonlylink/index.json
  users/readonlylink/config/index.json
  ```
