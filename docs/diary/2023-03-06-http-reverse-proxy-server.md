---
title: HTTP reverse proxy server
author: Xie Yuheng
date: 2023-03-06
---

My aim is to run local HTTP server (without a public IP),
and use a HTTP reverse proxy server to make the local server
publicly available to the internet.

Our current solution for such a HTTP reverse proxy server is the following:

```
HTTP reverse proxy server =
  HTTP server + channel server (over TCP or UDP)
```

In this document, we will only talk about "over TCP",
"over TCP" will be studied in another document.

The network is the following:

```
client <-> reverse proxy server <-> local server
```

The reverse proxy server has a domain name (the base domain name),
and it dispatches request by subdomain name.

For example, take `fidb.app` as the
base domain of our reverse proxy server.
A subdomain might be `xieyuheng.fidb.app`.

The reverse proxying works as the following:

- (1) A local server send POST HTTP request
  to the reverse proxy server,
  with host set to the base domain,
  and with the following body:

  ```ts
  {
    username: string
    subdomain: string
  }
  ```

- (2) The reverse proxy server auth the request by token,
  add the the local server IP to a white list,
  and reply `ChannelTicket` of the channel server to connect.

  ```ts
  type ChannelTicket = {
    port: number
    workerId: string
    encryptionKeyText: string // hex encoding
  }
  ```

  Because we are sending a key for encryption through HTTP,
  the reverse proxy server must use HTTPS instead of HTTP.

  In the state of the reverse proxy server,
  there is a record to map local server id back to `ChannelInfo`.

  ```ts
  type ChannelInfo = {
    username: string
    subdomain: string
    encryptionKey: Uint8Array
  }
  ```

- (3) The local server connect to the channel server,
  the first data sent should be the id,
  so that the channel server knows
  which `ChannelInfo` to use.

- (4) The channel server check the IP in its white list
  (remove it from the white list if successful),
  find the `ChannelInfo` back from the id,
  and accept the connection for future proxying.

- (5) Proxying is done by multiplexing this TCP connection.

  It does not matter if a middle man
  sets between the local server and the channel server,
  because all future data will be encrypted.
