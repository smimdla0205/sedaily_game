#!/usr/bin/env node

import { execSync } from 'child_process';

const BUCKET_NAME = 'g2-pre-games-frontend';
const CLOUDFRONT_ID = 'E2SSUB36GW6E6B';

console.log('[Deploy] Full Deploy (Frontend + Backend)...\n');

try {
  // 1. Frontend 배포
  console.log('[Build] Building frontend...');
  execSync('pnpm run build:export', { stdio: 'inherit' });
  
  console.log('\n[Deploy] Deploying frontend...');
  execSync(`aws s3 sync ./out s3://${BUCKET_NAME} --delete --exclude '*.txt'`, { stdio: 'inherit' });
  
  // 2. Backend 배포 (Direct Lambda Update)
  console.log('\n[Deploy] Deploying backend...');
  console.log('Creating Lambda deployment package...');
  execSync('cd backend/lambda && zip -r ../enhanced-chatbot.zip .', { stdio: 'inherit' });
  
  console.log('Updating Lambda function...');
  execSync('cd backend && aws lambda update-function-code --function-name sedaily-chatbot-dev-handler --zip-file fileb://enhanced-chatbot.zip', { stdio: 'inherit' });
  
  // 3. CloudFront 무효화
  console.log('\n[Invalidate] Invalidating CloudFront...');
  execSync(`aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"`, { stdio: 'inherit' });
  
  console.log('\n[Success] Full deployment complete!');
  console.log(`[Info] Live at: https://pre.g.sedaily.ai`);
  console.log(`[Info] Frontend Bucket: ${BUCKET_NAME}`);
  
} catch (error) {
  console.error('[Error] Deploy failed:', error.message);
  process.exit(1);
}