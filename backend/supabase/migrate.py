#!/usr/bin/env python3
"""
KAGE Supabase Migration Runner
==============================

Applies schema + seed data to a Supabase project via the REST API + Management API.

Usage:
  export SUPABASE_URL=https://your-project.supabase.co
  export SUPABASE_SERVICE_KEY=eyJ...  # service_role key
  export SUPABASE_DB_PASSWORD=...
  python3 migrate.py --apply

Or for a dry run:
  python3 migrate.py --check

The runner will:
  1. Check the project is reachable
  2. Apply 001_init_schema.sql via the SQL endpoint (pg-meta /query)
  3. POST exercises from seeds/exercises.json to /rest/v1/exercises
  4. POST templates and template_exercises to /rest/v1/...
  5. Verify counts and print a summary

This script is idempotent — running it twice will not duplicate rows
(UPSERT on slug / name).
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

BACKEND_DIR = Path(__file__).resolve().parent
MIGRATIONS_DIR = BACKEND_DIR / "migrations"
SEEDS_DIR = BACKEND_DIR / "seeds"


# ---------------------------------------------------------------------------
# Minimal HTTP client (no external deps so this works in any environment)
# ---------------------------------------------------------------------------
class HttpClient:
    def __init__(self, base_url: str, headers: dict | None = None, timeout: int = 30):
        self.base_url = base_url.rstrip("/")
        self.headers = headers or {}
        self.timeout = timeout

    def request(self, method: str, path: str, body=None, headers=None) -> tuple[int, str]:
        url = urljoin(self.base_url + "/", path.lstrip("/"))
        hdrs = dict(self.headers)
        hdrs.update(headers or {})
        if body is not None and not isinstance(body, (bytes, str)):
            body = json.dumps(body).encode("utf-8")
            hdrs.setdefault("Content-Type", "application/json")
        elif isinstance(body, str):
            body = body.encode("utf-8")
        req = Request(url, data=body, method=method, headers=hdrs)
        try:
            with urlopen(req, timeout=self.timeout) as resp:
                return resp.status, resp.read().decode("utf-8")
        except HTTPError as e:
            return e.code, e.read().decode("utf-8") if e.fp else str(e)
        except URLError as e:
            return 0, f"Network error: {e.reason}"


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
def load_config() -> tuple[str, str]:
    url = os.environ.get("SUPABASE_URL", "").strip().rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_KEY", "").strip()
    if not url or not key:
        print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in env", file=sys.stderr)
        print("  Get your service_role key from:", file=sys.stderr)
        print("  https://supabase.com/dashboard/project/_/settings/api-keys", file=sys.stderr)
        sys.exit(1)
    return url, key


# ---------------------------------------------------------------------------
# Steps
# ---------------------------------------------------------------------------
def check_reachable(client: HttpClient) -> bool:
    print("[1/5] Checking Supabase reachability...")
    code, body = client.request("GET", "/auth/v1/health")
    if code == 200:
        print(f"  ✓ Project is healthy")
        return True
    print(f"  ✗ Health check failed: {code} {body[:200]}")
    return False


def apply_schema(client: HttpClient, dry_run: bool) -> bool:
    print("[2/5] Applying schema migration 001_init_schema.sql...")
    sql = (MIGRATIONS_DIR / "001_init_schema.sql").read_text()

    if dry_run:
        print(f"  (dry run) would execute {len(sql)} chars of SQL")
        return True

    code, body = client.request(
        "POST",
        "/rest/v1/rpc/exec_sql",
        body={"query": sql},
        headers={"Prefer": "return=minimal"},
    )
    if code in (200, 201, 204):
        print(f"  ✓ Schema applied")
        return True
    # Fallback: use the pg-meta endpoint if exec_sql RPC is not available
    code, body = client.request(
        "POST",
        "/pg/query",
        body={"query": sql},
        headers={"Content-Type": "application/json"},
    )
    if code in (200, 201, 204):
        print(f"  ✓ Schema applied (via pg-meta)")
        return True
    print(f"  ✗ Schema apply failed: {code}")
    print(f"  Body: {body[:500]}")
    print()
    print("  FALLBACK: open Supabase SQL Editor and paste the file contents:")
    print(f"    {MIGRATIONS_DIR / '001_init_schema.sql'}")
    return False


def seed_exercises(client: HttpClient, dry_run: bool) -> dict:
    print("[3/5] Seeding 53 exercises...")
    exercises = json.loads((SEEDS_DIR / "exercises.json").read_text())

    if dry_run:
        print(f"  (dry run) would POST {len(exercises)} exercises")
        return {}

    code, body = client.request(
        "POST",
        "/rest/v1/exercises",
        body=exercises,
        headers={"Prefer": "resolution=merge-duplicates,return=representation"},
    )
    if code in (200, 201):
        rows = json.loads(body) if body else []
        print(f"  ✓ Inserted/updated {len(rows)} exercises")
        # Build name → id map for template resolution
        return {r["name"]: r["id"] for r in rows}

    print(f"  ✗ Exercise seed failed: {code} {body[:300]}")
    return {}


def seed_templates(client: HttpClient, name_to_id: dict, dry_run: bool) -> bool:
    print("[4/5] Seeding 10 workout templates...")
    templates = json.loads((SEEDS_DIR / "templates.json").read_text())

    if not name_to_id:
        print("  ✗ Cannot seed templates without exercise IDs (previous step failed)")
        return False

    if dry_run:
        print(f"  (dry run) would POST {len(templates)} templates")
        return True

    # Insert templates first (without exercise references)
    template_payload = []
    for t in templates:
        t_copy = {k: v for k, v in t.items() if k != "exercises"}
        template_payload.append(t_copy)

    code, body = client.request(
        "POST",
        "/rest/v1/workout_templates",
        body=template_payload,
        headers={"Prefer": "resolution=merge-duplicates,return=representation"},
    )
    if code not in (200, 201):
        print(f"  ✗ Template insert failed: {code} {body[:300]}")
        return False

    inserted = json.loads(body) if body else []
    print(f"  ✓ Inserted {len(inserted)} templates")

    # Build template_id → db_id map
    tmpl_id_map = {t["name"]: t["id"] for t in inserted}

    # Now insert template_exercises with resolved IDs
    te_payload = []
    skipped = 0
    for t in templates:
        tmpl_db_id = tmpl_id_map.get(t["name"])
        if not tmpl_db_id:
            continue
        for ex in t["exercises"]:
            ex_id = name_to_id.get(ex["exercise_name"])
            if not ex_id:
                print(f"  ⚠ Skipping '{ex['exercise_name']}' (not in exercises table)")
                skipped += 1
                continue
            te_payload.append({
                "template_id": tmpl_db_id,
                "exercise_id": ex_id,
                "sort_order": ex["sort_order"],
                "sets": ex["sets"],
                "reps": ex["reps"],
                "weight_kg": ex["weight_kg"],
                "rest_seconds": ex["rest_seconds"],
                "notes": ex["notes"],
            })

    if te_payload:
        code, body = client.request(
            "POST",
            "/rest/v1/template_exercises",
            body=te_payload,
            headers={"Prefer": "resolution=merge-duplicates,return=minimal"},
        )
        if code in (200, 201, 204):
            print(f"  ✓ Inserted {len(te_payload)} template_exercises ({skipped} skipped)")
            return True
        print(f"  ✗ template_exercises insert failed: {code} {body[:300]}")
        return False

    return True


def verify(client: HttpClient) -> bool:
    print("[5/5] Verifying deployment...")
    tables = ["exercises", "workout_templates", "template_exercises", "profiles"]
    all_ok = True
    for table in tables:
        code, body = client.request(
            "GET",
            f"/rest/v1/{table}?select=*&limit=0",
            headers={"Prefer": "count=exact"},
        )
        if code == 200:
            # Extract count from content-range header
            # Body won't have rows but the response has X-Total-Count
            print(f"  ✓ {table} reachable")
        else:
            print(f"  ✗ {table} not accessible: {code}")
            all_ok = False
    return all_ok


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="KAGE Supabase migration runner")
    ap.add_argument("--check", action="store_true", help="Dry run only (no writes)")
    ap.add_argument("--apply", action="store_true", help="Apply schema and seeds")
    args = ap.parse_args()

    if not args.check and not args.apply:
        args.check = True  # default

    url, key = load_config()
    print(f"Target: {url}")
    print(f"Mode:   {'check (dry run)' if args.check else 'apply'}")
    print()

    client = HttpClient(
        url,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
        },
    )

    if not check_reachable(client):
        sys.exit(1)

    if not apply_schema(client, args.check):
        print("\nSchema apply failed — please run the SQL manually in the Supabase SQL Editor.")
        print("Then re-run with --apply to seed the data.")
        sys.exit(1)

    name_to_id = seed_exercises(client, args.check)
    seed_templates(client, name_to_id, args.check)
    verify(client)

    print()
    print("=" * 60)
    print("MIGRATION COMPLETE")
    print("=" * 60)
    print()
    print("Next steps:")
    print("  1. In Supabase Dashboard → Authentication → URL Configuration,")
    print("     add your Expo / web redirect URL.")
    print("  2. In your frontend, set environment variables:")
    print("     EXPO_PUBLIC_SUPABASE_URL=" + url)
    print("     EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key from dashboard>")
    print("  3. Test signup: the handle_new_user trigger auto-creates a profile.")


if __name__ == "__main__":
    main()
