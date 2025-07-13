#!/bin/bash

# Deploy script for forms-cloud
# Usage: ./deploy.sh [local|production]

set -e

ENVIRONMENT=${1:-local}

echo "Deploying to $ENVIRONMENT environment..."

if [ "$ENVIRONMENT" = "production" ]; then
    echo "Using production configuration with HTTPS..."
    cp nginx.production.conf nginx.conf
    docker compose down
    docker compose up -d --build
    echo "Production deployment completed!"
    echo "Your app is available at: https://bugs-everywhere.ru"
elif [ "$ENVIRONMENT" = "local" ]; then
    echo "Using local development configuration with HTTP..."
    # Restore original local config
    git checkout nginx.conf
    docker compose down
    docker compose up -d --build
    echo "Local deployment completed!"
    echo "Your app is available at: http://localhost"
else
    echo "Invalid environment. Use 'local' or 'production'"
    exit 1
fi
