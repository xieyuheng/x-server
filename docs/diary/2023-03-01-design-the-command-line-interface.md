---
title: Design the command line interface
author: Xie Yuheng
date: 2023-03-01
---

The following command line has enough information,
but is too long,
and it write password to terminal,
which will be save to terminal history,
thus not good.

```
fidb database:serve <directory> --port 5108 \
  --reverse-proxy-server https://fidb.app:5108 \
  --reverse-proxy-subdomain pomodoro \
  --reverse-proxy-username xieyuheng \
  --reverse-proxy-password abc


The database

  <directory> and database information

served at

  http://localhost:5108
  https://pomodoro.fidb.app:5108
```

Instead, we should first login to the reverse proxy server.

```
fidb reverse-proxy:login https://fidb.app:5108


Prompt for username

Prompt for password

On success, token saved to ~/.fidb/tokens/
```

Then in one line

```
fidb database:serve <directory> --port 5108
fidb database:serve <directory> --port 5108 --url https://pomodoro.fidb.app:5108


The database

  <directory> and database information

served at

  http://localhost:5108
  https://pomodoro.fidb.app:5108
```

```
fidb website:serve <directory> --port 8080
fidb website:serve <directory> --port 8080 --url https://pomodoro.fidb.app

Website served at

  http://localhost:8080
  https://pomodoro.fidb.app
```

About the reverse proxy server itself.

Here we explicit say `--database`,
because it is not obvious that
we need a database to serve a reverse proxy.

Since reverse proxy server's routing is based on subdomain,
we also need to specify the domain of reverse proxy server.

```
fidb reverse-proxy:serve --port 5108 \
  --domain fidb.app \
  --database <directory> \
  --tls-cert /etc/letsencrypt/live/fidb.app/fullchain.pem \
  --tls-key /etc/letsencrypt/live/fidb.app/privkey.pem


The reverse-proxy served at:

  https://127.0.0.1:5108
```

An app often need both website and database,
but we do not want to `reverse-proxy:serve` twice
and `reverse-proxy:login` twice.

Thus `reverse-proxy:serve` and should support multiple ports.

```
fidb reverse-proxy:serve --port 443 --port 5108 \
  --domain fidb.app \
  --database <directory> \
  --tls-cert /etc/letsencrypt/live/fidb.app/fullchain.pem \
  --tls-key /etc/letsencrypt/live/fidb.app/privkey.pem
```

Login do not need to specify many ports.

Login one port will login all ports.

```
fidb reverse-proxy:login https://fidb.app


Available reverse-proxy ports 443 and 5108
```
