#!/bin/bash

# Start mock server in background
npm run mock-server > /tmp/mock.log 2>&1 &
MOCK_PID=$!
echo "Mock server PID: $MOCK_PID"

# Wait for server to start
sleep 3

# Run tests
API_URL=http://localhost:4000 GRAPHQL_URL=http://localhost:4000/graphql npm run test:mock

# Capture test exit code
TEST_EXIT_CODE=$?

# Kill mock server
kill $MOCK_PID 2>/dev/null

# Show mock server logs
echo "=== MOCK SERVER LOGS ==="
cat /tmp/mock.log | tail -30

exit $TEST_EXIT_CODE
