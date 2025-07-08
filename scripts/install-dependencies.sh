#!/bin/bash
cd /home/ec2-user/finora-api

echo "Installing Node.js and pnpm..."
# Install Node.js 22 if not present
if ! command -v node &> /dev/null || [[ $(node --version) != v22* ]]; then
    curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
    sudo yum install -y nodejs
fi

# Install pnpm globally
npm install -g pnpm

echo "Installing dependencies..."
pnpm install --frozen-lockfile
