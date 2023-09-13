# X Server

A website server that supports serving many websites by subdomain-based routing.

## Usages

### Command line tool

Install it by the following command:

```sh
npm install -g @xieyuheng/x-server
```

The command line program is called `x-server`.

## Examples

### `x-server serve`

Serve a single-page-app using `http` with an available port (starting from 8080):

```sh
x-server serve /websites/pomodoro \
  --cors \
  --rewrite-not-found-to index.html \
  --cache-control-pattern 'assets/**: max-age=31536000'
```

Serve a single-page-app using `https` with a given port:

```sh
x-server serve /websites/readonlylink \
  --cors \
  --port 443 \
  --rewrite-not-found-to index.html \
  --cache-control-pattern 'assets/**: max-age=31536000' \
  --tls-cert /etc/letsencrypt/live/readonly.link/fullchain.pem \
  --tls-key /etc/letsencrypt/live/readonly.link/privkey.pem
```

Serve a single-page-app using `https` with a `website.json` config file:

```sh
x-server serve /websites/readonlylink/website.json
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

### `x-server serve-many`

Serve many websites in a directory, using subdomain-based routing:

- Each website might have it's own `website.json` config file,
- The `server` option of config file in subdirectory will be ignored.
- the `hostname` option is required.

```sh
x-server serve-many /websites \
  --hostname localhost \
  --port 443 \
  --tls-cert /etc/letsencrypt/live/fidb.app/fullchain.pem \
  --tls-key /etc/letsencrypt/live/fidb.app/privkey.pem
```

Serve many with base `website.json` config file:

```sh
x-server serve-many /websites/website.json
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
    },
  },
  "logger": {
    "name": "pretty-line",
    "disableRequestLogging": true
  }
}
```

The `LoggerOptions` used above is:

```ts
export type LoggerName = "json" | "silent" | "pretty" | "pretty-line"

export type LoggerOptions = {
  name: LoggerName
  disableRequestLogging?: boolean
}
```

The default `LoggerOptions` is:

```json
{
  "name": "pretty-line"
}
```

On Linux, to test `x-server serve-many` locally,
we can add subdomains to `localhost` by editing `/etc/hosts`.

For examples:

```
127.0.1.1 readonlylink.localhost
127.0.1.1 pomodoro.localhost
...
```

### Using `.domain-map/` with `serve-many`

When doing subdomain-based routing,
we can also support custom domain for a subdomain,
by adding adding a file

```
.domain-map/<custom-domain>/subdomain
```

where the file content is the subdomain.

Then you can add an A record to the DNS of your custom domain,
to point to the IP address of your server.

Custom domain is only supported when TLS is enabled.
To provide TLS certificate for a custom domain,
add the following files:

```
.domain-map/<custom-domain>/cert
.domain-map/<custom-domain>/key
```

To get free certificate for your domain,
`certbot` can be used.

- [Certbot website](https://certbot.eff.org/instructions)
- [Certbot on archlinux wiki](https://wiki.archlinux.org/title/certbot)

We prefer creating certificate via DNS TXT record,
install `certbot` and run the following command:

```sh
sudo certbot certonly --manual --preferred-challenges dns
```

then the prompt of `certbot` to create certificate,
you will need to add TXT record to the DNS record of your domain.

After created the certificate, copy them to `.domain-map` of your custom domain:

```sh
sudo cat /etc/letsencrypt/live/<custom-domain>/fullchain.pem > /websites/.domain-map/<custom-domain>/cert
sudo cat /etc/letsencrypt/live/<custom-domain>/privkey.pem > /websites/.domain-map/<custom-domain>/key
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
