---
title: Length prefixed data
author: Xie Yuheng
date: 2023-03-05
---

TCP is a stream, we need protocol to send data part by part.

I come up with the following way:

- 4 bytes -- use a 32-bit number (big-endian) for the length of the data.
- length bytes -- the body of the data.
- and so on.

Wireshark recognize this as [Network Data Management Protocol (NDMP)](https://www.ietf.org/archive/id/draft-skardal-ndmpv4-04.txt).

The draft RFC looks complicated, I did not read it.

From wireshark, we can see beside encoding a length,
NDMP also uses the first bit as flag for "is last fragment or not".

I do not need such flag, because semantics like "ending or not"
can be built on top of length prefixed data.

Maybe we should setup a RFC project for this,
just like [the RFC of ZeroMQ](https://rfc.zeromq.org).
