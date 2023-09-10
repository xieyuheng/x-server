# Website Server

A website server that supports serving many websites by subdomain-based routing.

## Usages

### Command line tool

Install it by the following command:

```sh
npm install -g website-server
```

The command line program is called `website-server`.

## Examples

### `website-server serve`

Serve a single-page-app using `http` with an available port (starting from 8080):

```sh
website-server serve /websites/pomodoro \
  --cors \
  --rewrite-not-found-to index.html \
  --cache-control-pattern 'assets/**: max-age=31536000'
```

Serve a single-page-app using `https` with a given port:

```sh
website-server serve /websites/readonlylink \
  --cors \
  --port 443 \
  --rewrite-not-found-to index.html \
  --cache-control-pattern 'assets/**: max-age=31536000' \
  --tls-cert /etc/letsencrypt/live/readonly.link/fullchain.pem \
  --tls-key /etc/letsencrypt/live/readonly.link/privkey.pem
```

Serve a single-page-app using `https` with a `website.json` config file:

```sh
website-server serve /websites/readonlylink/website.json
```

Where `/websites/readonlylink/website.json`:

```json
{
  "server": {
    "port": 443,
    "tls": {
      "cert": "/etc/letsencrypt/live/readonly.link/fullchain.pem",
      "key": "/etc/letsencrypt/live/readonly.link/privkey.pem"
    }
  },
  "cors": true,
  "rewriteNotFoundTo": "index.html",
  "cacheControlPatterns": {
    "assets/**": "max-age=31536000"
  }
}
```

### `website-server serve-many`

Serve many websites in a directory, using subdomain-based routing:

- Each website might have it's own `website.json` config file,
- The `server` option of config file in subdirectory will be ignored.
- the `hostname` option is required.

```sh
website-server serve-many /websites \
  --hostname localhost \
  --port 443 \
  --tls-cert /etc/letsencrypt/live/fidb.app/fullchain.pem \
  --tls-key /etc/letsencrypt/live/fidb.app/privkey.pem
```

Serve many with base `website.json` config file:

```sh
website-server serve-many /websites/website.json
```

Where `/websites/website.json`:

```json
{
  "server": {
    "hostname": "localhost",
    "port": 443,
    "tls": {
      "cert": "/etc/letsencrypt/live/readonly.link/fullchain.pem",
      "key": "/etc/letsencrypt/live/readonly.link/privkey.pem"
    }
  }
}
```

On Linux, to test `website-server serve-many` locally,
we can add subdomains to `localhost` by editing `/etc/hosts`.

For examples:

```
127.0.1.1 readonlylink.localhost
127.0.1.1 pomodoro.localhost
...
```

## Development

```sh
npm install           # Install dependencies
npm run build         # Compile `src/` to `lib/`
npm run build:watch   # Watch the compilation
npm run format        # Format the code
npm run test          # Run test
npm run test:watch    # Watch the testing
```

## Contributions

To make a contribution, fork this project and create a pull request.

Please read the [STYLE-GUIDE.md](STYLE-GUIDE.md) before you change the code.

Remember to add yourself to [AUTHORS](AUTHORS).
Your line belongs to you, you can write a little
introduction to yourself but not too long.

## License

[GPLv3](LICENSE)
