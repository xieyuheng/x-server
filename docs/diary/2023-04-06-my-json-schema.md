---
title: My JSON Schema
author: Xie Yuheng
date: 2023-04-06
---

We need to use json to describe schema of json data.

We can not use [json-schema](https://json-schema.org/understanding-json-schema/index.html),
because instead of the following:

```
{
  "type": "object",
  "properties": {
    "age": { "type": "number" },
    "name": { "type": "string" }
  }
}
```

We want to write something like:

```
{
  "name": "string",
  "age": "number"
}
```

How can we achieve this?

We are interpreter writers right?

Maybe we can view a string as a variable name,
and structurally evaluate every properties that does not starts with `@`,
specially we will use `@type` and `@kind` properties to denote type name and sum types,
and the evaluation of object without `@type` or `@kind` property is special,
i.e. not just structural down, but also wrap it inside `{ "@type": "object", ... }`.

For example:

```
{
  "name": "string",
  "age": "number"
}

// =>

{
  "@type": "object",
  properties: {
    "name": { "@type": "string" },
    "age": { "@type": "number" }
  }
}
```

```
{
  "@type": "string",
  "minLength": 2,
  "maxLength": 3
}

// =>

{
  "@type": "string",
  "minLength": { "@kind": "Literal', "@value": 2 },
  "maxLength": { "@kind": "Literal', "@value": 3 }
}
```

This sounds promising!

Maybe we should call this `x-schema`, just like `x-node` and `x-markdown`,
it also feels like `x` because we are evaluating the schema expressions.
