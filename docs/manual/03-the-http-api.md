---
title: The HTTP API
---

We want to use [HTTP API](https://www.rfc-editor.org/rfc/rfc9110) to operate data in FiDB.

The aim is to enable a developer to describe rules about HTTP API,
and let fidb dynamicly serves the HTTP API based on the rules,
thus a developer almost never need to write backend API code over database again.

We will do this little by little.

## Data Operations

Firstly, the most basic four operations is the **CRUD**
-- **C**reate, **R**ead, **U**pdate and **D**elete.

- To **create** data, `POST` the path with the data.

  Note that, when JSON is used as HTTP request body,
  the `Content-Type` header should be `application/json`,
  this is the same for all HTTP APIs.

  For example, after the following `POST`s:

  ```
  POST users/xieyuheng

  { "name": "Xie Yuheng" }

  POST users/xieyuheng/projects/inner

  { "name": "inner", "description": "My inner universe." }

  POST users/xieyuheng/projects/pomodoro

  { "name": "Pomodoro", "description": "🍅 A Pomodoro timer." }
  ```

  We will create the following data files:

  ```
  users/xieyuheng/index.json
  users/xieyuheng/projects/inner/index.json
  users/xieyuheng/projects/pomodoro/index.json
  ```

- To **read** data, `GET` the path.

  For example, if we have the following data:

  ```
  users/xieyuheng/index.json
  users/xieyuheng/projects/inner/index.json
  users/xieyuheng/projects/pomodoro/index.json
  ```

  The `GET` requests would be:

  ```
  GET users/xieyuheng
  GET users/xieyuheng/projects/inner
  GET users/xieyuheng/projects/pomodoro
  ```

- To **update** the whole data, `PUT` the path with the data.

  We first need to read the data to get `@revision`.

  ```
  GET users/xieyuheng
  ```

  Result:

  ```
  {
    "name": "Xie Yuheng",
    "@path": "users/xieyuheng",
    "@revision": "1b0d4dc0b6e68853aa0005b03c059a47",
    "@createdAt": 1677377821957,
    "@updatedAt": 1679424624733,
  }
  ```

  Update the whole data:

  ```
  PUT users/xieyuheng

  {
    "name": "谢宇恒",
    "@path": "users/xieyuheng",
    "@revision": "1b0d4dc0b6e68853aa0005b03c059a47",
    "@createdAt": 1677377821957,
    "@updatedAt": 1679424624733
  }
  ```

- To **update** some properties of a data, `PATCH` the path with the data.

  We first need to read the data to get `@revision`.

  ```
  GET users/xieyuheng
  ```

  Result:

  ```
  {
    "name": "谢宇恒",
    "@path": "users/xieyuheng",
    "@revision": "2b983c7a51376a61747eb9d79da13c77",
    "@createdAt": 1677377821957,
    "@updatedAt": 1679424824733
  }
  ```

  Update only some properties:

  ```
  PATCH users/xieyuheng

  {
    "@revision": "2b983c7a51376a61747eb9d79da13c77",
    "country": "China"
  }
  ```

- To **delete** data, `DELETE` the path with the `@revision`.

  We first need to read the data to get `@revision`.

  ```
  GET users/xieyuheng
  ```

  Result:

  ```
  {
    "name": "谢宇恒",
    "country": "China",
    "@path": "users/xieyuheng",
    "@revision": "3f71a2d894180a2145ea7b05e2931e15",
    "@createdAt": 1677377821957,
    "@updatedAt": 1679425024733
  }
  ```

  Delete the data:

  ```
  DELETE users/xieyuheng

  {
    "@revision": "3f71a2d894180a2145ea7b05e2931e15"
  }
  ```

## File Operations

Since we are using file system as database,
beside operations on JSON data files,
we also want to operate on other kinds of files
such as markdown, image, mp3 and so on.

- **Problem 3.1:** How to distinguish kinds of resources referenced by a path?

- **Solution 3.1:** We can add `kind=...` query parameter to a request,
  where the value of `kind` explicitly denotes the kind of resource.

  For examples, value can be `data`, `file`, `directory` and so on.

  We require an implementation to view the value of `kind` as case insensitive,
  so a user can write both `kind=Data` and `kind=data`.

I feel good about this solution,
because it is scalable,
i.e. we can add as many kinds as we want in the future.

Now we are ready to specify the HTTP API about file operations.

- To **create** a file, `POST` the path with query parameter `kind=file` and the file content.

  Note that, when file is used as HTTP request body,
  the `Content-Type` header should be `text/plain` for plaintext file,
  and `application/octet-stream` for other kinds of file,
  It actually does not matter what `Content-Type` is used here,
  because when reading a file, the file extension is used
  to determine the response `Content-Type` header.

  For example:

  ```
  POST users/xieyuheng/human.txt?kind=file

  Hello, I am Xie Yuheng.
  ```

- To **read** a file, `GET` the path with query parameter `kind=file`.

  For example, after the POST above, we can read file by:

  ```
  GET users/xieyuheng/human.txt?kind=file
  ```

  The `Content-Type` of the HTTP response will be setted
  based on the corresponding file extension,
  for example, `.txt` maps to `text/plain`.

- To **update** a file, `PUT` the path with query parameter `kind=file` and the file content.

  For example:

  ```
  PUT users/xieyuheng/human.txt?kind=file

  Hello, I am Xie Yuheng from China.
  ```

- To **delete** a file, `DELETE` the path with query parameter `kind=file`.

  For example:

  ```
  DELETE users/xieyuheng/human.txt?kind=file
  ```

Now, all data operations require us to write `kind=data`,
and all file operations require us to write `kind=file`,
we can improve this situation a little bit.

- **Problem: 3.2** It is not convenient to always have to write
  `kind=data` and `kind=file`,
  specially we do not want to write `kind=file`
  when using web apps that dynamicly load content from URL
  -- like [readonly.link](https://readonly.link)
  and [mimor.app](https://mimor.app).

- **Solution: 3.2** We can identify some situations
  where it is unambiguous to omit `kind=...`.

  It is unambiguous to omit `kind=file`,
  if we are simply reading a file and the given `path`
  is to an existing file (instead of a directory).

  For `kind=data`, since it is the most used use case of our system,
  we view it as the default when `kind` is omitted,
  when the given `path` does not exist or the given path is to a directory.

## Directory Operations

TODO
