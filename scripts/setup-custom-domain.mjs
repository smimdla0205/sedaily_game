#!/usr/bin/env node

import { execSync } from 'child_process';

const CLOUDFRONT_ID = 'E2SSUB36GW6E6B';
const CUSTOM_DOMAIN = 'pre.g.sedaily.ai';
const CERTIFICATE_ARN = 'arn:aws:acm:us-east-1:887078546492:certificate/007d551e-b0b6-4453-9076-b2b2090a2ff2';

console.log('[Setup] Setting up custom domain for CloudFront...\n');

try {
  // 1. SSL 인증서 상태 확인
  console.log('[Info] Checking SSL certificate status...');
  const certStatus = execSync(`aws acm describe-certificate --certificate-arn ${CERTIFICATE_ARN} --region us-east-1 --query 'Certificate.Status' --output text`, { encoding: 'utf8' }).trim();
  
  if (certStatus !== 'ISSUED') {
    console.log(`[Error] SSL certificate is not ready yet. Status: ${certStatus}`);
    console.log('Please complete DNS validation first:');
    console.log('1. Add the CNAME record from ssl-validation-record.json to your DNS');
    console.log('2. Wait for certificate validation to complete');
    console.log('3. Run this script again');
    process.exit(1);
  }
  
  console.log('[Success] SSL certificate is ready');
  
  // 2. CloudFront 배포 설정 가져오기
  console.log('[Info] Getting current CloudFront configuration...');
  const config = JSON.parse(execSync(`aws cloudfront get-distribution-config --id ${CLOUDFRONT_ID}`, { encoding: 'utf8' }));
  
  // 3. 커스텀 도메인 추가
  console.log('[Setup] Adding custom domain to CloudFront...');
  config.DistributionConfig.Aliases = {
    Quantity: 1,
    Items: [CUSTOM_DOMAIN]
  };
  
  config.DistributionConfig.ViewerCertificate = {
    ACMCertificateArn: CERTIFICATE_ARN,
    SSLSupportMethod: 'sni-only',
    MinimumProtocolVersion: 'TLSv1.2_2021',
    Certificate: CERTIFICATE_ARN,
    CertificateSource: 'acm'
  };
  
  // ETag 제거
  const etag = config.ETag;
  delete config.ETag;
  
  // 4. CloudFront 배포 업데이트
  console.log('[Info] Updating CloudFront distribution...');
  execSync(`aws cloudfront update-distribution --id ${CLOUDFRONT_ID} --distribution-config '${JSON.stringify(config.DistributionConfig)}' --if-match ${etag}`, { stdio: 'inherit' });
  
  console.log('\n[Success] Custom domain setup initiated!');
  console.log('[Info] Next steps:');
  console.log(`1. Add CNAME record: ${CUSTOM_DOMAIN} -> CloudFront domain`);
  console.log('2. Wait for CloudFront deployment to complete (5-15 minutes)');
  console.log(`3. Test: https://${CUSTOM_DOMAIN}`);
  
} catch (error) {
  console.error('[Error] Setup failed:', error.message);
  process.exit(1);
}