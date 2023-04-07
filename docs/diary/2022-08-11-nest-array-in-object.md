---
title: Nest array in object
author: Xie Yuheng
date: 2022-08-11
---

Sometimes it does not make sense to normalize data.

Take the following data (from a pomodoro app) as an example,
maybe we should normalize `.tasks[]`,
but definitely not `.trace[]`.

```
{
  username: "xieyuheng",
  tasks: [
    {
      id: 2,
      title: "Design Mimor",
      trace: [1659920124149, 1659921632305, 1659954068198],
    },
    {
      id: 0,
      title: "Read HoTT",
      trace: [],
    },
    {
      id: 1,
      title: 'Read "Causality"',
      trace: [],
    },
  ],
}
```
