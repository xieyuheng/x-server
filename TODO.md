# subdomain

[subdomain] support loading user provided cert for custom domain

- use `SNICallback`

- save them in `.domain-map/<custom-domain>` directory

  - `.domain-map/<custom-domain>/cert`
  - `.domain-map/<custom-domain>/key`

[subdomain] update docs about using custom domain

[subdomain] update docs about creating cert by certbot

[docs] setup `docs/manual`

[subdomain] [maybe] support `main/` directory when there is no subdomain
[subdomain] [maybe] support `404/` directory subdomain can not be found
