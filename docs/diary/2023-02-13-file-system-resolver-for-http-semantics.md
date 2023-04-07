---
title: File system resolver for http semantics
author: Xie Yuheng
date: 2023-02-13
---

When thinking about token based permission system,
I found that the most natural way of represent permission
is to use path patterns.

One require of the permission system is to grant a user
only the permission to read and write his own data.

For example, the path patterns can be:

```
/users/
/users/xieyuheng/
/users/xieyuheng/*/posts/
```

Thus we change how data are stored, from

```
/users/xieyuheng // json file
```

to

```
/users/xieyuheng/index.json
```

Now it is clear that what we are doing is just
a **file system resolver for http semantics**.

> It is tempting to think of resource identifiers as remote file
> system pathnames and of representations as being a copy of the
> contents of such files. In fact, that is how many resources are
> implemented. However, there are no such limitations in practice.
>
> - [RFC 9110 -- HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html).

# About relations between SQL tables

The most used relations between SQL tables
are `has one` and `has many`,
which are naturally expressed by nested directories.

For example, user has many posts, so we use the following subdirectory:

```
/users/
/users/*/posts/
```

When designing API or syntax,
we often should optimize for the most used use case,
our resolver can be viewed as optimizing for
`has one` and `has many` relations.
