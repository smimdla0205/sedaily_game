#!/usr/bin/env node

import { execSync } from 'child_process';

const BUCKET_NAME = 'g2-pre-games-frontend';
const CLOUDFRONT_ID = 'E2SSUB36GW6E6B';

console.log('[Deploy] Quick Deploy Started...\n');

try {
  // 1. 빌드
  console.log('[Build] Building...');
  execSync('pnpm run build:export', { stdio: 'inherit' });
  
  // 2. S3 업로드
  console.log('\n[Upload] Uploading to S3...');
  execSync(`aws s3 sync ./out s3://${BUCKET_NAME} --delete --exclude '*.txt'`, { stdio: 'inherit' });
  
  // 3. CloudFront 무효화
  console.log('\n[Invalidate] Invalidating CloudFront...');
  execSync(`aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"`, { stdio: 'inherit' });
  
  console.log('\n[Success] Quick Deploy Complete!');
  console.log(`[Info] Live at: https://pre.g.sedaily.ai`);
  console.log(`[Info] Bucket: ${BUCKET_NAME}`);
  
} catch (error) {
  console.error('[Error] Deploy failed:', error.message);
  process.exit(1);
}