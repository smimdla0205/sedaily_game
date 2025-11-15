#!/usr/bin/env node

import { execSync } from 'child_process';

const BUCKET_NAME = 'g2-pre-games-frontend';
const CLOUDFRONT_ID = 'E2SSUB36GW6E6B';

console.log('🚀 Full Deploy (Frontend + Backend)...\n');

try {
  // 1. Frontend 배포
  console.log('📦 Building frontend...');
  execSync('pnpm run build:export', { stdio: 'inherit' });
  
  console.log('\n📤 Deploying frontend...');
  execSync(`aws s3 sync ./out s3://${BUCKET_NAME} --delete --exclude '*.txt'`, { stdio: 'inherit' });
  
  // 2. Backend 배포 (Direct Lambda Update)
  console.log('\n🔧 Deploying backend...');
  console.log('Creating Lambda deployment package...');
  execSync('cd backend/lambda && zip -r ../enhanced-chatbot.zip .', { stdio: 'inherit' });
  
  console.log('Updating Lambda function...');
  execSync('cd backend && aws lambda update-function-code --function-name sedaily-chatbot-dev-handler --zip-file fileb://enhanced-chatbot.zip', { stdio: 'inherit' });
  
  // 3. CloudFront 무효화
  console.log('\n🔄 Invalidating CloudFront...');
  execSync(`aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"`, { stdio: 'inherit' });
  
  console.log('\n🎉 Full deployment complete!');
  console.log(`🌐 Live at: https://pre.g.sedaily.ai`);
  console.log(`📦 Frontend Bucket: ${BUCKET_NAME}`);
  
} catch (error) {
  console.error('❌ Deploy failed:', error.message);
  process.exit(1);
}