# 커스텀 도메인 설정 가이드 (pre.g.sedaily.ai)

## 현재 상태

| 항목 | 값 |
|-----|-----|
| CloudFront ID | E2SSUB36GW6E6B |
| Domain | pre.g.sedaily.ai |
| Status | ACTIVE |
| SSL | AWS ACM (Managed) |
| Setup Script | `scripts/setup-custom-domain.mjs` |

## 설정 방법

### 자동 설정 스크립트
```bash
pnpm setup-custom-domain
```

**스크립트가 수행하는 작업:**
1. SSL 인증서 상태 확인 (ISSUED)
2. CloudFront 배포 설정 가져오기
3. 커스텀 도메인 추가
4. ACM 인증서 연결
5. 배포 업데이트

### 수동 설정

#### Step 1: SSL 인증서 상태 확인
```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:887078546492:certificate/* \
  --region us-east-1 \
  --query 'Certificate.Status'
# 결과: ISSUED
```

#### Step 2: CloudFront 설정 다운로드
```bash
aws cloudfront get-distribution-config \
  --id E2SSUB36GW6E6B > cf-config.json
```

#### Step 3: 설정 편집
```json
{
  "Aliases": {
    "Quantity": 1,
    "Items": ["pre.g.sedaily.ai"]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:887078546492:certificate/*",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "CertificateSource": "acm"
  }
}
```

#### Step 4: CloudFront 배포 업데이트
```bash
aws cloudfront update-distribution \
  --id E2SSUB36GW6E6B \
  --distribution-config file://cf-config.json \
  --if-match <ETAG>
```

## DNS 설정 (Route53)

### A 레코드 생성
```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id <ZONE_ID> \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "pre.g.sedaily.ai",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "d37wz4zxwakwl0.cloudfront.net",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "Z2FDTNDATAQYW2"
        }
      }
    }]
  }'
```

## 검증

### 도메인 작동 확인
```bash
# HTTPS 연결 확인
curl -I https://pre.g.sedaily.ai
# HTTP/2 200 OK 확인

# DNS 확인
nslookup pre.g.sedaily.ai

# SSL 인증서 확인
openssl s_client -connect pre.g.sedaily.ai:443
```

### CloudFront 상태 확인
```bash
# 배포 상태
aws cloudfront get-distribution --id E2SSUB36GW6E6B

# 무효화 상태
aws cloudfront list-invalidations --distribution-id E2SSUB36GW6E6B
```

## 배포 후 체크리스트

- [ ] HTTPS 연결 작동 확인
- [ ] SSL 인증서 유효성 확인
- [ ] CloudFront 캐싱 작동 확인
- [ ] 이미지 로딩 확인
- [ ] 게임 페이지 접속 확인
- [ ] 모바일 반응형 확인
- [ ] DNS 전파 완료 확인 (전 세계)

## 트러블슈팅

### SSL 인증서 미발급
```bash
# 인증서 상태 확인
aws acm describe-certificate \
  --certificate-arn <CERTIFICATE_ARN> \
  --region us-east-1

# DNS 검증 레코드 확인 필요
# ACM Console에서 "Resend validation email" 선택
```

### CloudFront 업데이트 실패
```bash
# ETag 값 확인
aws cloudfront get-distribution-config --id E2SSUB36GW6E6B \
  | grep -i etag

# ETag가 일치하지 않으면 최신 설정 다시 다운로드
```

### DNS 전파 지연
```bash
# DNS 전파 상태 확인
dig pre.g.sedaily.ai

# 전 세계 DNS 상태 확인 (온라인 도구)
# https://www.whatsmydns.net/
```

## 관련 파일

- `scripts/setup-custom-domain.mjs` - 자동 설정 스크립트
- `docs/cloudfront-custom-domain.json` - CloudFront 설정
- `docs/ssl-validation-record.json` - SSL 검증 레코드
- `docs/CUSTOM_DOMAIN.md` - 도메인 정보
```

2. **DNS A 레코드 추가**
도메인 DNS 설정에서:
- Type: `A` (또는 `ALIAS`)
- Name: `pre.g.sedaily.ai`
- Value: CloudFront 도메인

## 📁 준비된 파일
- `cloudfront-custom-domain.json`: 커스텀 도메인 적용용 CloudFront 설정
- `quick-deploy.mjs`: 배포 스크립트 (커스텀 도메인 정보 포함)

## ✅ 완료 후 확인
- https://g2-clone.ai 접속 테스트
- SSL 인증서 유효성 확인