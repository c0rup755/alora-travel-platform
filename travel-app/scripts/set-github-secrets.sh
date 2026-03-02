#!/usr/bin/env bash
# Helper to set repository secrets using GitHub CLI (`gh`).
# Usage: export GITHUB_REPO=c0rup755/alora-travel-platform && ./scripts/set-github-secrets.sh

REPO=${GITHUB_REPO:-}
if [ -z "$REPO" ]; then
  echo "Please set GITHUB_REPO environment variable (owner/repo)."
  exit 1
fi

set_secret() {
  NAME=$1
  VALUE=${!1}
  if [ -z "$VALUE" ]; then
    echo "Skipping $NAME (env var $NAME not exported)."
    return
  fi
  echo "Setting secret: $NAME"
  echo -n "$VALUE" | gh secret set "$NAME" --repo "$REPO" --body -
}

# List of secrets we recommend setting
SECRETS=(VERCEL_TOKEN VERCEL_ORG_ID VERCEL_PROJECT_ID REACT_APP_TP_SCRIPT_URL AFFILIATE_ID KIWI_API_KEY SKY_API_KEY BOOKING_API_KEY ADMIN_TOKEN SENTRY_DSN)

for s in "${SECRETS[@]}"; do
  set_secret $s
done

echo "Done. Verify secrets in https://github.com/$REPO/settings/secrets/actions"
