# subdomain

[subdomain] update docs about domain-map in readme

- docs about creating cert by certbot

[subdomain] domain-map should use directory instead of file

- `.domain-map/<custom-domain>/subdomain (a file)`

[subdomain] support loading user provided cert for custom domain

- save them in `.domain-map/<custom-domain>` directory

  - `.domain-map/<custom-domain>/subdomain`
  - `.domain-map/<custom-domain>/fullchain.pem`
  - `.domain-map/<custom-domain>/privkey.pem`

[subdomain] [maybe] support `main/` directory when there is no subdomain
[subdomain] [maybe] support `404/` directory subdomain can not be found
