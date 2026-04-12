# authdrift

> Find OAuth handlers that will break when users rename their Gmail.

On 31 March 2026, Google began letting users rename their primary Gmail address. Every OAuth integration that uses email as the user lookup key will silently create a duplicate account when a user renames. Most do.

`authdrift` is a static analysis tool that scans your codebase for the exact patterns that explode on a Gmail rename — and on the ~0.04% baseline `sub`-claim drift Truffle Security documented in January 2025.

## Install

```bash
pip install authdrift
```

Requires `semgrep` (installed automatically).

## Use

```bash
authdrift scan ./
```

Example output:

```
src/auth/google.ts
   12:18  WARNING  oauth-passport-email-as-primary-key
            This OAuth handler is using `profile.emails[0].value` as a user lookup key.
            When a user renames their Gmail address, this lookup will fail and your
            application will silently create a duplicate user record.
            Fix: use `profile.id` (the OIDC `sub` claim) as the immutable primary key.
```

JSON output for CI:

```bash
authdrift scan ./ --json
```

## Why this matters

Atlassian's own KB confirms that SCIM email changes create duplicate Atlassian Cloud accounts. Google's developer documentation acknowledges that revoke + reauth produces duplicate accounts. The cascade is documented; the fix is not deployed.

`authdrift` flags the exact code patterns that produce phantom users after a rename event. Three rules, narrowly scoped, designed to slot into CI alongside `semgrep`, `trufflehog`, and `gitleaks` without producing noise.

## What it catches today

- **Passport.js** handlers using `profile.emails[0].value` as a user lookup key (`passport-google-oauth20`, `passport-google-oauth2`)
- **NextAuth** `signIn` callbacks resolving users by `user.email` against Prisma
- **Python** (Django / SQLAlchemy) handlers querying by `userinfo['email']` from Google's userinfo response

## What it deliberately does NOT do

- Flag every reference to `email` in an OAuth file. The rules require the email value to be used as a lookup key, not just read or logged.
- Flag handlers that key on `sub` / `profile.id` and use email only as a contact attribute.
- Auto-fix anything. Read-only by design.

## Roadmap

- More OAuth library coverage (lucia-auth, authlib, omniauth, Clerk, Supabase Auth, Firebase Auth)
- A `--fix` mode that suggests the `sub`-keyed equivalent
- A hosted scan for organisations that can't run a CLI

## License

MIT.
