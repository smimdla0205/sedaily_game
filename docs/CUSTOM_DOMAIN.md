# 커스텀 도메인 설정 (pre.g.sedaily.ai)

## 도메인 정보

| 항목 | 값 |
|-----|-----|
| **Domain** | pre.g.sedaily.ai |
| **CloudFront ID** | E2SSUB36GW6E6B |
| **ACM Certificate** | AWS managed (자동 갱신) |
| **Protocol** | HTTPS only |
| **SSL/TLS** | TLSv1.2+ |
| **HSTS** | Enabled |

## 설정 상태

### 현재 설정
- ✅ CloudFront 배포: E2SSUB36GW6E6B
- ✅ SSL 인증서: AWS ACM (검증 완료)
- ✅ 커스텀 도메인: pre.g.sedaily.ai
- ✅ 원본: S3 (g2-pre-games-frontend)
- ✅ 캐싱: 활성화 (Default 1일)

### DNS 설정 (Route53)
```
Type: A (Alias)
Name: pre.g.sedaily.ai
Alias Target: E2SSUB36GW6E6B.cloudfront.net
Evaluate Target Health: false
```

## CloudFront 배포 설정

### Distribution 기본 설정
```
Distribution ID: E2SSUB36GW6E6B
Status: Deployed
Domain Name: d37wz4zxwakwl0.cloudfront.net
Aliases: pre.g.sedaily.ai
```

### Origin 설정
```
Name: g2-pre-games-frontend
Domain: g2-pre-games-frontend.s3.us-east-1.amazonaws.com
Origin Access: S3 (OAI)
```

### Viewer Policy
```
Protocol Policy: Redirect HTTP to HTTPS
SSL/TLS: TLSv1.2_2021
Certificate: AWS managed
```

### Cache 설정
```
Viewer Cache TTL:
  - Default: 86400 (1일)
  - Min: 0
  - Max: 31536000 (1년)

Compression: Enabled (Brotli, GZIP)
Query String Forwarding: None
```

## SSL/TLS 인증서

### AWS ACM Certificate
```
Status: Issued
Auto-renewal: Enabled
Validation: DNS (automatic)
Next Renewal: Auto
```

### 인증서 확인
```bash
# 인증서 상태 조회
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:887078546492:certificate/* \
  --region us-east-1

# 배포에서 사용 중인 인증서 확인
aws cloudfront get-distribution-config --id E2SSUB36GW6E6B | grep -i certificate
```

## 배포 검증

### 도메인 접속 확인
```bash
# HTTP → HTTPS 리다이렉트 확인
curl -I https://pre.g.sedaily.ai
# HTTP/2 200 OK 확인

# SSL 인증서 확인
openssl s_client -connect pre.g.sedaily.ai:443 -servername pre.g.sedaily.ai
```

### DNS 설정 확인
```bash
# A 레코드 확인
nslookup pre.g.sedaily.ai

# CloudFront CNAME 확인
dig pre.g.sedaily.ai +short

# 예상 응과:
# d37wz4zxwakwl0.cloudfront.net
```

### 캐시 헤더 확인
```bash
curl -I https://pre.g.sedaily.ai
# Cache-Control: public, max-age=86400
# X-Cache: Hit from cloudfront
```

## 설정 변경 (필요시)

### CloudFront 업데이트
```bash
# 배포 설정 가져오기
aws cloudfront get-distribution-config \
  --id E2SSUB36GW6E6B \
  > cloudfront-config.json

# 설정 편집 후 업데이트
aws cloudfront update-distribution \
  --id E2SSUB36GW6E6B \
  --distribution-config file://cloudfront-config.json \
  --if-match <ETAG>
```

### 무효화 (캐시 초기화)
```bash
# 모든 캐시 무효화
aws cloudfront create-invalidation \
  --distribution-id E2SSUB36GW6E6B \
  --paths "/*"

# 특정 경로만 무효화
aws cloudfront create-invalidation \
  --distribution-id E2SSUB36GW6E6B \
  --paths "/games/*" "/images/*"
```

## 모니터링

### CloudFront 메트릭
```bash
# 배포 통계 확인
aws cloudfront get-distribution --id E2SSUB36GW6E6B

# 무효화 상태 확인
aws cloudfront list-invalidations \
  --distribution-id E2SSUB36GW6E6B
```

### 로그 활성화
```bash
# CloudFront 접근 로그 활성화
# Console: Distribution Settings → Logging

# S3에 로그 저장
aws cloudfront update-distribution \
  --id E2SSUB36GW6E6B \
  --logging-config "Enabled=true,IncludeCookies=false,Bucket=<bucket>.s3.amazonaws.com"
```

## 이전 배포 (참고)

### 이전 설정
```
Domain: g2.sedaily.ai (deprecated)
CloudFront: E1C1UNHJ75JZMZ
S3 Bucket: g2-frontend-ver2
Status: No longer in use
```

### 마이그레이션 완료
- ✅ 모든 트래픽 → pre.g.sedaily.ai로 이동
- ✅ 이전 도메인 → 301 리다이렉트 (선택사항)
- ✅ DNS 업데이트 완료
    "ViewerCertificate": {
      "ACMCertificateArn": "arn:aws:acm:us-east-1:ACCOUNT:certificate/9c87fd8a-3506-4a55-86dc-03bfeb6b22d8",
      "SSLSupportMethod": "sni-only",
      "MinimumProtocolVersion": "TLSv1.2_2021"
    }
  }'
```

### 3. SSL 인증서 검증
- **인증서 상태**: 발급됨
- **도메인 검증**: 완료 필요
- **CloudFront 연결**: 대기 중

## 🚀 배포 후 확인사항

1. **DNS 전파 확인**:
   ```bash
   nslookup pre.g.sedaily.ai
   ```

2. **SSL 인증서 확인**:
   ```bash
   curl -I https://pre.g.sedaily.ai
   ```

3. **CloudFront 상태 확인**:
   ```bash
   aws cloudfront get-distribution --id E2SSUB36GW6E6B
   ```

## 📝 참고사항

- SSL 인증서는 us-east-1 리전에 생성되어야 함
- CloudFront 배포 완료까지 15-20분 소요
- DNS 전파는 최대 48시간 소요 가능

---

**마지막 업데이트**: 2025-11-10
**상태**: 설정 대기 중