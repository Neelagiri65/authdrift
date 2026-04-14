# authdrift

> Find OAuth handlers that will break when users rename their Gmail.

[**Site & rule catalogue → authdrift.nativerse-ventures.com**](https://authdrift.nativerse-ventures.com) · [PyPI](https://pypi.org/project/authdrift/) · MIT licensed

**Coverage today:** 6 rules across 6 ecosystems · 24 test fixtures (11 vulnerable + 11 safe + 2 edge) · 0 false positives on the safe matrix.

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

## Exit codes

- `0` — no findings (your codebase is clean)
- `1` — findings detected (email-keyed OAuth handlers found)
- `2` — error (semgrep not found, invalid path, etc.)

## CI Integration

Add this to `.github/workflows/authdrift.yml`:

```yaml
name: authdrift
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install authdrift
      - run: authdrift scan ./
```

The scan exits `1` on findings, failing the CI check.

## Why this matters

Atlassian's own KB confirms that SCIM email changes create duplicate Atlassian Cloud accounts. Google's developer documentation acknowledges that revoke + reauth produces duplicate accounts. The cascade is documented; the fix is not deployed.

`authdrift` flags the exact code patterns that produce phantom users after a rename event. Six rules across six ecosystems, narrowly scoped, designed to slot into CI alongside `semgrep`, `trufflehog`, and `gitleaks` without producing noise.

## What it catches today

- **Passport.js** handlers using `profile.emails[0].value` as a user lookup key (`passport-google-oauth20`, `passport-google-oauth2`)
- **NextAuth** `signIn` callbacks resolving users by `user.email` against Prisma
- **Python** (Django / SQLAlchemy) handlers querying by `userinfo['email']` from Google's userinfo response
- **authlib** (Flask/Django) handlers using `userinfo['email']` or `userinfo.get('email')` as a lookup key
- **Firebase Auth** code using `getUserByEmail()` instead of `getUser()` with uid
- **Lucia v3** auth flows resolving users by email instead of provider subject ID

## What it deliberately does NOT do

- Flag every reference to `email` in an OAuth file. The rules require the email value to be used as a lookup key, not just read or logged.
- Flag handlers that key on `sub` / `profile.id` and use email only as a contact attribute.
- Auto-fix anything. Read-only by design.

## Limitations

authdrift catches the most common **direct** patterns — where email is used inline as a database lookup key in the same file as the OAuth handler. It does **not** catch:

- **Indirect patterns** — email extracted into a variable or passed to a helper function in a different file (e.g. LibreChat's email-fallback pattern across `socialLogin.js`). These require manual review.
- **Runtime-only email keying** — applications that resolve email to a user at the database level (stored procedures, views) rather than in application code.
- **Non-Google OAuth providers** — the rules are scoped to Google OAuth patterns. Other providers (GitHub, Facebook, Apple) have similar risks but different code patterns.
- **Database-level identity** — if your user table has a unique constraint on `email` rather than on `sub`, that's a schema-level vulnerability this tool can't see.

## False positive?

If authdrift flags code you've verified is safe, suppress with a Semgrep inline comment:

```javascript
// nosemgrep: oauth-passport-email-as-primary-key
const user = await db.findUser({ email: profile.emails[0].value });
```

This keeps the finding suppressed for that line while continuing to scan the rest of the file.

## Roadmap

- More OAuth library coverage (omniauth, Clerk, Supabase Auth)
- A `--fix` mode that suggests the `sub`-keyed equivalent
- A hosted scan for organisations that can't run a CLI

## License

MIT.
