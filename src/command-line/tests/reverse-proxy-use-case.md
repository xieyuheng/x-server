---
title: Reverse proxy use case
---

# note

We can not yet run tests for command-line.

To be able to test this commands we need to:

- Setup example website.
- Run command in `child_process`.
- Use node http client, which can mock DNS server,
  instead of using `fetch`.

# fidb.app

```
sudo fidb reverse-proxy:serve --port 443 --port 5108 \
  --database ~/fidb-official/fidb-databases/databases/reverse-proxy \
  --domain fidb.app \
  --tls-cert /etc/letsencrypt/live/fidb.app/fullchain.pem \
  --tls-key /etc/letsencrypt/live/fidb.app/privkey.pem

fidb reverse-proxy:login https://fidb.app

fidb website:serve ~/xieyuheng/pomodoro/dist \
  --cors \
  --rewrite-not-found-to index.html \
  --cache-control-pattern 'assets/**: max-age=31536000' \
  --public-url https://pomodoro.fidb.app

curl https://pomodoro.fidb.app
```

# fidb.cn

```
fidb reverse-proxy:serve --port 443 --port 5108 \
  --database /root/fidb-official/fidb-databases/databases/reverse-proxy \
  --domain fidb.cn \
  --tls-cert /etc/letsencrypt/live/fidb.cn/fullchain.pem \
  --tls-key /etc/letsencrypt/live/fidb.cn/privkey.pem

fidb reverse-proxy:login https://fidb.cn

fidb website:serve ~/xieyuheng/pomodoro/dist \
  --cors \
  --rewrite-not-found-to index.html \
  --cache-control-pattern 'assets/**: max-age=31536000' \
  --public-url https://pomodoro.fidb.cn

curl https://pomodoro.fidb.cn
```

# cicada.localhost

```
fidb reverse-proxy:serve --port 8080 --port 5108 \
 --database ~/fidb-official/fidb-databases/databases/reverse-proxy \
 --domain cicada.localhost

fidb reverse-proxy:login http://cicada.localhost:8080

fidb website:serve ~/xieyuheng/pomodoro/dist \
  --cors \
  --rewrite-not-found-to index.html \
  --cache-control-pattern 'assets/**: max-age=31536000' \
  --public-url http://test.cicada.localhost:8080

curl http://test.cicada.localhost:8080
```
