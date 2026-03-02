#!/usr/bin/env bash
# Toggle USE_MOCKS at the backend admin endpoint using curl
# Usage: ADMIN_TOKEN=xxx ./scripts/toggle-mocks.sh false

BASE_URL=${BASE_URL:-http://localhost:5000}
ADMIN_TOKEN=${ADMIN_TOKEN:-}
USE_MOCKS=${1:-false}

if [ -z "$ADMIN_TOKEN" ]; then
  echo "Please export ADMIN_TOKEN env var (or pass via header). Example: ADMIN_TOKEN=xxx $0 false"
  exit 1
fi

echo "Toggling useMocks -> $USE_MOCKS on $BASE_URL"
curl -s -X POST "$BASE_URL/api/admin/toggle-mocks" \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -d "{ \"useMocks\": $USE_MOCKS }" | jq || true
