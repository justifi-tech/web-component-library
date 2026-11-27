# ADR 0001 — Web Components docs: the URL contract, the front door, the origin, the owner

- **Status:** Accepted
- **Date:** 2026-11-27
- **Milestone:** [Decouple WC Docs from public-docs](https://github.com/justifi-tech/engineering-artifacts/milestone/200)
- **Covers:** engineering-artifacts [#4405](https://github.com/justifi-tech/engineering-artifacts/issues/4405), [#4406](https://github.com/justifi-tech/engineering-artifacts/issues/4406), [#4407](https://github.com/justifi-tech/engineering-artifacts/issues/4407), [#4409](https://github.com/justifi-tech/engineering-artifacts/issues/4409)

---

## 1. No live URL changes

**This is the rule the rest of this document exists to serve, and it outranks every other
consideration in the migration. If a task would change a live URL, the task is wrong.**

The Web Components documentation moves out of `justifi-tech/public-docs` and into this repo, which
will build and deploy it. `https://docs.justifi.tech/web-components/introduction` stays exactly
that: same host, same path, same status, **and no redirect anywhere in the chain**.

A 301 is a broken URL that passes a naive check. Every probe in this milestone asserts the redirect
count as well as the status — `curl -o /dev/null -s -w '%{http_code} %{num_redirects}'` must read
`200 0`. A check that only reads `200` does not test this contract.

The contract covers every indexed URL, the archived version snapshots included, and the `.md` twin
the `llms-txt` plugin emits beside each page.

Two deliberate exceptions, both strict improvements:

- `/web-components/` becomes a real `200` index instead of today's 301-then-404.
- The bare `/web-components` directory redirect is rebuilt by hand, because S3 does not issue it.

### The five answers

Everything downstream reads this section. A task that needs a different answer comes back here
first and amends this ADR.

| # | Question | Answer |
|---|---|---|
| 1 | What is the public path? | `/web-components/*`, unchanged. The docs app's `baseUrl` is `/web-components/`. |
| 2 | Trailing slashes? | `trailingSlash: false`. Matches `public-docs` today. |
| 3 | Page URL shape? | Extensionless. `/web-components/introduction`, never `…/introduction.html` and never `…/introduction/`. |
| 4 | What path does the origin receive? | The request path, unmodified. No prefix is added or stripped between the viewer and the origin. |
| 5 | How is any mapping done? | A **CloudFront Function on viewer-request** that rewrites `event.request.uri` in place. Never a redirect, never a 404-rewrite, never a `custom_error_response`. |

Answer 5 is the one that is easy to get wrong cheaply. `public-docs` has already paid for it twice —
[#234](https://github.com/justifi-tech/public-docs/issues/234), a `trailingSlash: false` site whose
route was declared with a trailing slash, and
[#236](https://github.com/justifi-tech/public-docs/issues/236), the host not knowing to serve
`index.html` for a clean URL. Both produced the same symptom: a **404 flash**, where the user sees a
404 render before client-side routing recovers. Both were fixed by making the edge resolve the path,
not by redirecting.

---

## 2. Front door: CloudFront

**Decision.** A CloudFront distribution in front of `docs.justifi.tech`, taking the whole domain —
the API spec and the main docs included, not just `/web-components/*`.

Not on general principle. Because the exact shape already exists and can be copied:
`fastify/production/customer-portal/frontend/cloudfront` serves `portal.justifi.tech` from several
origins with ordered behaviours keyed on `path_pattern`, and already does this migration's central
trick — splitting a path prefix (`/signup/*`) off to a different origin. `infra` runs more than a
dozen distributions off `blueprints//aws/cloudfront-distribution`. This is the paved road, not a new
capability.

**Rejected — Vercel.** Undoes the GitHub Pages cutover that just shipped, for no gain the front door
does not already give us.

**Rejected — Cloudflare.** Delegates a `justifi.tech` subdomain to a vendor that holds nothing else
of ours. A second DNS and TLS system to operate, for one subdomain.

---

## 3. Origin: S3 with Origin Access Control

**Decision.** The docs build is published to a private S3 bucket, reachable only by the distribution
through **OAC**. GitHub Pages is not the origin.

`vault/production/edge/cloudfront/just-auth` is the template — `use_origin_access_control = true`,
an `oac_name`/`oac_description` pair, and a bucket policy scoped to the distribution. `components`
and `imports` in the same folder are the same shape.

**Bucket account: `vault_production`, AWS account `369792239863`.** That is where the
`edge/cloudfront/*` leaves live, where the `docs.justifi.tech` DNS record already lives (§5), and
where the existing OAC-fronted static distributions already live. Putting the bucket in the same
account as the distribution also lets its policy use the same-account
`arn:aws:cloudfront::369792239863:distribution/*` wildcard, rather than the exact-distribution-id
policy `just-auth` needs for its cross-account bucket — that form is a chicken-and-egg at creation
time, and there is no reason to inherit it.

### The consequence, written down

**GitHub Pages served `/web-components/introduction` from `introduction.html` for free. S3 does
not — it returns 404 for a key that does not exist, and `web-components/introduction` is not a key.**

Docusaurus emits flat files, so the keys are `web-components/introduction.html` and friends.
Appending `.html` is therefore **mandatory work**, not a nicety — it is task
[#4433](https://github.com/justifi-tech/engineering-artifacts/issues/4433), and it is the only thing
standing between this design and a site-wide 404. Per answer 5 it is done by a viewer-request
CloudFront Function, in place, with no redirect.

**Two non-options**, recorded so nobody re-proposes them:

- `default_root_object` only ever applies to `/`. It does nothing for `/web-components/` and nothing
  for a leaf page.
- SPA-style error responses would turn every genuinely missing docs page into a soft `200`. On a
  docs site that is SEO damage, and it hides real build regressions.

---

## 4. Front-door owner

**Owner: the Infra Team**, as `@justifi-tech/infra-approvers`.

That is not a label invented here — it is the enforced owner of the code. `infra`'s `CODEOWNERS`
assigns `*/production/**` to `@justifi-tech/infra-approvers`, so every change to the distribution,
the bucket, the certificate and the DNS record already requires their review. Urgent breakage
escalates through the Infra Team's on-call rotation.

The owner must be named **before the DNS flip**
([#4417](https://github.com/justifi-tech/engineering-artifacts/issues/4417)), not before the bucket
exists. That flip is the moment the API spec and the main docs start depending on this distribution,
and therefore the moment the blast radius stops being "the web components docs".

---

## 5. What this binds downstream

**The DNS record is already Terraform-managed**, as a CNAME to GitHub Pages in `infra` at
`vault/production/foundation/route53-justifi-tech-records`, in the vault production account — not in
the `fastify` zone where `api` and `portal` live. So
[#4417](https://github.com/justifi-tech/engineering-artifacts/issues/4417) is an **in-place edit of
a live record**, in an adoption leaf whose values were transcribed from the live zone; a careless
edit shows up as destroy/create. Details on that issue.

**The Blueprint module cannot attach our function yet.** It already accepts arbitrary CloudFront
Function source, but creation is gated on the distribution's *default origin* being `redirect`, and
ours is S3 — so the function is never created, and the two behaviour blocks that resolve a function
ARN index into an empty list. That makes
[#4432](https://github.com/justifi-tech/engineering-artifacts/issues/4432) a prerequisite for
[#4433](https://github.com/justifi-tech/engineering-artifacts/issues/4433), and it is a small
upstream fix rather than a new module. Specifics on #4408.

**This file must not become a published docs page.** It lives in `docs/`, which is the
`@justifi/webcomponents-docs` package. It is safe on npm today only because that package's `files`
field is an allowlist and `adr/` is not in it. It stops being safe at
[#4420](https://github.com/justifi-tech/engineering-artifacts/issues/4420), when the new Docusaurus
app reads the `docs` workspace directly — that task must exclude `**/adr/**`, or these records ship
as public pages under `/web-components/adr/…` and §1 is violated by the document that defines it.

---

*Every factual claim above was read from `infra`, `blueprints`, `public-docs` and a local
`public-docs` build on 2026-11-27, not recalled. The sources are quoted on the issues this ADR
covers and on #4408, #4417 and #4420.*
