#!/bin/bash
set -e

# Configuration
S3_BUCKET="splatntreat"
CLOUDFRONT_DISTRIBUTION_ID="EY0RNBDZCX7KS"
BUILD_DIR="apps/splat-and-treat/dist"

echo "🔨 Building app..."
pnpm build

echo "📤 Uploading to S3..."
aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" --delete

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*"

echo "✅ Deploy complete!"
echo "🌐 Your site will be live in a few minutes at your CloudFront URL"
