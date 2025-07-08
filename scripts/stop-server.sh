#!/bin/bash
echo "Stopping API server..."
pkill -f "node.*dist.*index.cjs" || echo "No server running"
