#!/bin/bash

API_URL="http://localhost:8080"
EMAIL="test-$(date +%s)@example.com"

echo "========== STEP 1: Send Magic Link =========="
MAGIC_LINK_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/magic-link" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}")

echo "Response: $MAGIC_LINK_RESPONSE"
echo ""

MAGIC_TOKEN=$(echo $MAGIC_LINK_RESPONSE | grep -o '"devToken":"[^"]*' | cut -d'"' -f4)
echo "Extracted Magic Token: $MAGIC_TOKEN"
echo ""

if [ -z "$MAGIC_TOKEN" ]; then
  echo "ERROR: Could not extract magic token!"
  exit 1
fi

echo "========== STEP 2: Verify Magic Link =========="
VERIFY_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/verify" \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$MAGIC_TOKEN\"}")

echo "Response: $VERIFY_RESPONSE"
echo ""

ACCESS_TOKEN=$(echo $VERIFY_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo $VERIFY_RESPONSE | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)

echo "Extracted Access Token: $ACCESS_TOKEN"
echo "Extracted Refresh Token: $REFRESH_TOKEN"
echo ""

if [ -z "$ACCESS_TOKEN" ]; then
  echo "ERROR: Could not extract access token!"
  exit 1
fi

echo "========== STEP 3: Get Profile with Access Token =========="
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/api/auth/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Profile Response: $PROFILE_RESPONSE"
echo ""

echo "    Full flow test completed!"
