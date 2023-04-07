---
title: Intro
---

What if we use file system as database?

I mean a suite of protocols about
implementing database concepts in file system,
including a suite of HTTP API which can
read and write data represented in file system.

What is a protocol?

The most beautiful definition I know is by Pieter Hintjens:

> A protocol is a kind of contract, an agreement that lets different
> teams in different times and places write code that is guaranteed to
> work together.
>
> Code that can work together is called interoperable.
>
> -- Pieter Hintjens

This is actually what URL and HTTP is designed for
(Although people had not yet discovered JSON at that time).

> It is tempting to think of resource identifiers as remote file
> system pathnames and of representations as being a copy of the
> contents of such files. In fact, that is how many resources are
> implemented. However, there are no such limitations in practice.
>
> - [RFC 9110 -- HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html).

A resource identifier is a URL (or say URI) that denotes a resource,
while resource is a abstract concept which might have many kinds of implementations
and a representation of a resource is one implementation of concrete format
that programmers can work with.
We see that file system,
with it's pathname and files,
is the inspiration and archetype of such system,
and is also how such system end up been implemented
at the early days of HTTP.

Nowaday people use relational database and SQL to implement HTTP API,
but the most used relations between SQL data
are the one-to-one "has one" relation
and the one-to-many "has many" relation,
which are most naturally expressed by nested directories.

For example:

- A user _has many_ projects,
  so we give each user a subdirectory called "projects":

  ```
  /users/*/projects/*
  ```

- A user _has one_ config,
  so we give each user one subdirectory called "config":

  ```
  /users/*/config
  ```

  We might also just let `config` be a property of `user`,
  as people might do in some document database.

When designing a tool (such as API and formal language syntax),
we should _optimize for the most used use case_.
Thus using file system as database can be viewed as
optimizing for "has one" and "has many" relations.
The _many-to-many_ relation, which is about graph instead of tree,
can still be implemented by indexes,
just like how normal relational database do.
Since we are optimizing the tool for the most used use case,
the tool feels so handy and easy to understand.

What if we use file system as database?

It feels like an idea worth trying.
Let us explore how execatly can we implement this idea.

Before we begin, let's solve the most import problem first.

- **Problem 0:** How should we name this project?

- **Solution 0:** This project is about using file system as database,
  specially using the subdirectory relation to represent
  "has one" and "has many" relations between data.

  How about **FiDB**?

  **Fi**le system as **DB**!

FiDB, fidb, sounds kinda cute, and I kinda like it already :)
