# HANDOFF — authdrift

**Last updated:** 2026-06-14
**State:** clean working tree, on `main`. Recent: `e64d5c5` (README→site link), `aee96bb` (CI on Node 24), `7ba9bc0` (authlib/Firebase Auth/Lucia rules + dynamic CI).
**Remote:** github.com/Neelagiri65/authdrift · PyPI: pypi.org/project/authdrift · Site: authdrift.nativerse-ventures.com · MIT.

## What this is
A Python tool (`pyproject.toml`, published to PyPI) that **finds OAuth handlers that will break when a user renames their Gmail** — i.e. code keying identity on `email` rather than the stable `sub` claim. Productises the finding from the sibling `gmail-oauth-research` audit.

## Current state
- Layout: `src/` (tool), `tests/`, `fp-validation/` (false-positive corpus), `dist/` (build output).
- Rule catalogue covers multiple auth libraries (authlib, Firebase Auth, Lucia, …).
- CI runs on GitHub Actions (Node 24 opted-in).

## NEXT
- No active task — baseline HANDOFF for a shipped, published tool.
- If revisiting: extend the rule catalogue to more auth libraries/frameworks; grow `fp-validation/` to keep precision high; cut a new PyPI release after rule additions; keep README/site/PyPI version in sync.
