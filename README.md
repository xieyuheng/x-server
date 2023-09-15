# X Server

A website server
that supports serving many websites
using subdomain-based routing.

## Install

Install it by the following command:

```sh
npm install -g @xieyuheng/x-server
```

The command line program is called `x-server`.

## Docs

- [Serve one website](#serve-one-website)
- [Serve many websites](#serve-many-websites)
- [Config logger](#config-logger)
- [Use custom domain](#use-custom-domain)
- [Get free certificate](#get-free-certificate)
- [Use systemd to start service](#use-systemd-to-start-service)

### Serve one website

Use the `x-server serve` command to serve one website:

```sh
x-server serve <directory>
```

When serving a [single-page application (SPA)](https://en.wikipedia.org/wiki/Single-page_application),
we need to redirect all requests to `index.html`.

Example command for serving a SPA:

```sh
x-server serve <directory> \
  --cors \
  --redirect-not-found-to index.html \
  --cache-control-pattern 'assets/**: max-age=31536000'
```

To serve a website using HTTPS, we need to provide TLS certificate.

Example command for serving a SPA using HTTPS:

```sh
x-server serve <directory> \
  --cors \
  --port 443 \
  --redirect-not-found-to index.html \
  --cache-control-pattern 'assets/**: max-age=31536000' \
  --tls-cert <certificate-file> \
  --tls-key <private-key-file>
```

It is unhandy to issue long command,
thus we also support using a `website.json` config file:

```sh
x-server serve <directory>/website.json
```

Where `<directory>/website.json` is:

```json
{
  "server": {
    "port": 443,
    "tls": {
      "cert": "<certificate-file>",
      "key": "<private-key-file>"
    }
  },
  "cors": true,
  "redirectNotFoundTo": "index.html",
  "cacheControlPatterns": {
    "assets/**": "max-age=31536000"
  }
}
```

### Serve many websites

The main use case of `x-server` is to
serve many websites in one directory,
using subdomain-based routing.

For example, I have a VPS machine,
where I put all my websites
in the `/websites` directory.

```
/websites/www
/websites/graphwind
/websites/inet
/websites/pomodoro
/websites/readonlylink
...
```

I bought a domain for my server -- say `fidb.app`,
and configured my DNS to resolve `fidb.app`
and `*.fidb.app` to my server.

I also created certificate files for my domain using `certbot`.

- About how to use `certbot`, please see
  the ["Get free certificate"](#get-free-certificate) section.

I can use `x-server serve-many` command to serve all of
the websites in `/websites` directory.

```sh
x-server serve-many /websites \
  --hostname fidb.app \
  --port 443 \
  --tls-cert /etc/letsencrypt/live/fidb.app/fullchain.pem \
  --tls-key /etc/letsencrypt/live/fidb.app/privkey.pem
```

Then I can visit all my websites via subdomain of `fidb.app`.

```
https://www.fidb.app
https://graphwind.fidb.app
https://inet.fidb.app
https://pomodoro.fidb.app
https://readonlylink.fidb.app
...
```

If no subdomain is given in a request,
`www/` will be used as the default subdomain directory
(while no redirect will be done).

Thus the following websites have the same contents:

```
https://fidb.app
https://www.fidb.app
```

When using `x-server serve-many`,
the `hostname` option is required,
and each website in `/websites` might have
it's own `website.json` config file,

Instead of issuing long command,
we can also use a root `website.json` config file.

```sh
x-server serve-many /websites/website.json
```

Where `/websites/website.json` is:

```json
{
  "server": {
    "hostname": "fidb.app",
    "port": 443,
    "tls": {
      "cert": "/etc/letsencrypt/live/fidb.app/fullchain.pem",
      "key": "/etc/letsencrypt/live/fidb.app/privkey.pem"
    }
  }
}
```

### Config logger

We can config logger in `/websites/website.json`:

```json
{
  ...,
  "logger": {
    "name": "pretty-line",
    "disableRequestLogging": true
  }
}
```

The type of logger options are:

```ts
export type LoggerOptions = {
  name: "json" | "silent" | "pretty" | "pretty-line"
  disableRequestLogging?: boolean
}
```

The default logger options are:

```json
{
  "name": "pretty-line",
  "disableRequestLogging": false
}
```

### Use custom domain

When doing subdomain-based routing,
we can also support custom domain for a subdomain,
by adding a file in `.domain-map/` directory.

```
/websites/.domain-map/<custom-domain>/subdomain
```

Where the content of the file is the subdomain, for examples:

```
/websites/.domain-map/readonly.link/subdomain -- (content: readonlylink)
/websites/.domain-map/inet.run/subdomain -- (content: inet)
...
```

Then I can the following DNS ALIAS records to my custom domains:

- You can also use A record and IP addresses.

| Domain        | Type  | Value                  |
|---------------|-------|------------------------|
| readonly.link | ALIAS | readonlylink.fidb.app. |
| inet.run      | ALIAS | inet.fidb.app.         |


Custom domain is only supported when TLS is enabled.
To provide TLS certificate for a custom domain,
add the following files:

```
/websites/.domain-map/<custom-domain>/cert
/websites/.domain-map/<custom-domain>/key
```

For example, the listing of `.domain-map/` is the following:

```
/websites/.domain-map/readonly.link/subdomain
/websites/.domain-map/readonly.link/cert
/websites/.domain-map/readonly.link/key
/websites/.domain-map/inet.run/subdomain
/websites/.domain-map/inet.run/cert
/websites/.domain-map/inet.run/key
...
```

### Get free certificate

You can use `certbot` to get free certificate for your domains.

- [Certbot website](https://certbot.eff.org/instructions)
- [Certbot on archlinux wiki](https://wiki.archlinux.org/title/certbot)

After install `certbot`,
I prefer creating certificate via DNS TXT record,
using the following command:

```sh
sudo certbot certonly --manual --preferred-challenges dns
```

Then you can follow the prompt of `certbot`
to create the certificate files,
during which you will need to add TXT record
to the DNS record of your domain
to accomplish the challenge given by `certbot`.

After created the certificate files,
I use the follow command to copy them to my `.domain-map`:

```sh
sudo cat /etc/letsencrypt/live/<custom-domain>/fullchain.pem > /websites/.domain-map/<custom-domain>/cert
sudo cat /etc/letsencrypt/live/<custom-domain>/privkey.pem > /websites/.domain-map/<custom-domain>/key
```

### Use systemd to start service

On a Linux server, we can use `systemd` to start a service,
or enable a service to start whenever the server is booted.


Example service file `fidb-app-x-server.service`:

```
[Unit]
Description=fidb.app x-server
After=network.target

[Service]
ExecStart=/usr/local/bin/x-server serve-many /websites/website.json
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Install service:

```
sudo cp <name>.service /etc/systemd/system/
```

Using service:

```
sudo systemctl start <name>.service
sudo systemctl enable <name>.service
sudo systemctl status <name>.service
```

To view log:

```
journalctl -f -u <name>.service
```

Reload systemd config files:

```
systemctl daemon-reload
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
