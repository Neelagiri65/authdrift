"""authdrift CLI — wraps semgrep with the bundled authdrift ruleset."""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from importlib.resources import as_file, files

from . import __version__


def _rules_path() -> str:
    """Return the on-disk path to the bundled rules directory."""
    rules = files("authdrift").joinpath("rules")
    with as_file(rules) as p:
        return str(p)


def _find_semgrep() -> str | None:
    """Locate the semgrep executable.

    Prefer the binary adjacent to the current Python interpreter so that
    a venv-installed authdrift uses its venv-installed semgrep — even when
    that venv is not active on PATH.
    """
    bin_dir = os.path.dirname(sys.executable)
    candidate = os.path.join(bin_dir, "semgrep")
    if os.path.isfile(candidate) and os.access(candidate, os.X_OK):
        return candidate
    return shutil.which("semgrep")


def _scan(path: str, json_output: bool) -> int:
    semgrep_bin = _find_semgrep()
    if semgrep_bin is None:
        sys.stderr.write(
            "authdrift: semgrep is required but was not found.\n"
            "Install it with: pip install semgrep\n"
        )
        return 2

    cmd = [semgrep_bin, "scan", "--config", _rules_path(), "--error", path]
    if json_output:
        cmd.append("--json")
    return subprocess.call(cmd)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="authdrift",
        description=(
            "Find OAuth handlers that will break when users rename their "
            "identifier (e.g. a Gmail rename)."
        ),
    )
    parser.add_argument(
        "--version",
        action="version",
        version=f"authdrift {__version__}",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    scan = sub.add_parser("scan", help="Scan a directory for authdrift patterns.")
    scan.add_argument(
        "path",
        nargs="?",
        default=".",
        help="Path to scan (default: current directory).",
    )
    scan.add_argument(
        "--json",
        action="store_true",
        help="Emit semgrep JSON output instead of human-readable.",
    )

    args = parser.parse_args(argv)

    if args.command == "scan":
        return _scan(args.path, args.json)

    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
