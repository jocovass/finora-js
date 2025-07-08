#!/bin/bash
cd /home/ec2-user/finora-api

echo "Starting API server..."
# Start your built API server
nohup node apps/api/dist/index.cjs > /tmp/api.log 2>&1 &
echo "API server started"
echo "Logs available at /tmp/api.log"

# Wait a moment and check if server started
sleep 2
if pgrep -f "node.*dist.*index.cjs" > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server failed to start. Check logs:"
    tail -20 /tmp/api.log
fi
