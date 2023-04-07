---
title: Metadata Properties
---

Metadata are data about data.

Beside the JSON data stored in file,
when reading the data, we also want to add some metadata
such as primary key, timestamps and so on,

- **Problem 2.1:** How should we add metadata properties to JSON data?

- **Solution 2.1:** We can use `@` as prefix of property name,
  to denote that this property is metadata.

For the ease of creating data by editing JSON files,
all the metadata should be optional.
Metadata properties should be created (or updated)
when reading or writing the data.

## @path

To make the data more convenient to use,
we use `@path` as the property name of primary key.

When reading data, the path of the directory that contains `index.json`
will be added to the result as a metadata property.

- The path is relative to the root of database.

For example, the primary keys of the following data

```
users/xieyuheng/index.json
users/xieyuheng/projects/inner/index.json
users/xieyuheng/projects/pomodoro/index.json
```

Would be

```
users/xieyuheng
users/xieyuheng/projects/inner
users/xieyuheng/projects/pomodoro
```

Which are just path to the directory, thus `@path`.

## @createdAt

To make the data more convenient to use,
we use `@createdAt` as the timestamp of creation.

When reading data, if there is no `@createdAt` property,
the created timestamp of the file
will be added to the result as a metadata property.

- The timestamp is the number of milliseconds that have elapsed
  since the UNIX epoch, which is defined as
  the midnight at the beginning of January 1, 1970, UTC.

## @updatedAt

To make the data more convenient to use,
we use `@updatedAt` as the timestamp of modification.

When reading data, if there is no `@updatedAt` property,
`@createdAt` will be used as it's `@updatedAt`.

When writing data, new `@updatedAt` will be setted to the data
based on current timestamp.

## @revision

- **Problem 2.2:** When I want to update a data, I first read it by it's `@path`,
  then I edit the data and write it back to the database.
  What it the during this time, the data is updated by other user?
  How should I now about this?

- **Solution 2.2:** We can use `@revision` as a metadata property.

  When reading data, if there is no `@revision` property,
  we add a random string as `@revision`.

  When writing data, the given `@revision` is compared with existing `@revision`,
  if they are equal, the writing is successful
  and a new random `@revision` is created,
  if they are not equal, the writing is failed
  error message will be return (for example, via HTTP).
