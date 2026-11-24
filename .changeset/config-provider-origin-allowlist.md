---
"@justifi/webcomponents": minor
---

`justifi-config-provider` now accepts `iframe-origin` and `api-origin` only as a canonical origin (`scheme://host[:port]`, no path, no trailing slash) on a host this build is allowed to talk to: `components.`, `wc-proxy.` or `api.justifi.ai` over https, a loopback host (`localhost`, `127.0.0.1`, `[::1]`, http or https, any port), or — in a non-production build only — the same three hosts on `justifi-staging.com`. Any other value is ignored with a `console.error` naming the value and the fallback, and the build default is used.

Why: a script running on the host page could redirect every hosted field, and every API call carrying the auth token, to a host it controls just by injecting the provider element. This closes that declarative lever; it does not (and cannot) stop same-page JavaScript that patches the SDK directly — the iframe origin boundary is what protects card data from the page. Hosts are listed explicitly rather than as `*.justifi.ai` so a forgotten subdomain can never serve fake card fields.

Staging is gated on the build's own tier so a production bundle cannot be talked into loading hosted fields from staging. There is no new build flag: the baked `IFRAME_ORIGIN` / `PROXY_API_ORIGIN` default already says which tier the bundle belongs to, each prop is judged against its own default, and an unrecognised default counts as production.

Visible change: tunnel or LAN URLs (`https://*.ngrok.io`, `http://192.168.x.x`, `host.docker.internal`), merchant-run reverse proxies, and non-canonical forms such as a trailing slash are no longer accepted through the attribute, and a published production build no longer accepts a staging override. For tunnel, LAN or cross-tier testing set `IFRAME_ORIGIN` / `PROXY_API_ORIGIN` in `.env` at build time instead. Local-dev overrides and staging builds keep working unchanged.
