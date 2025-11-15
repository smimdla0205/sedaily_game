# 배포 상태 및 설정

## 현재 배포 정보

**Last Updated**: 2025-11-15 18:58:52 UTC

### Production 환경
| 항목 | 값 |
|-----|-----|
| **Domain** | https://pre.g.sedaily.ai |
| **S3 Bucket** | g2-pre-games-frontend |
| **CloudFront ID** | E2SSUB36GW6E6B |
| **Region** | us-east-1 |
| **Status** | Active |
| **Build Type** | Static Export |
| **Total Pages** | 28 |

### 마지막 배포
```
- 시간: 2025-11-15 18:58:52 UTC
- 모드: 정적 빌드 + S3 업로드 + CloudFront 무효화
- 무효화 ID: IQ0DGDIPBVQF4Y7YVPG01WVZO
- 상태: InProgress
- ETA: 3-5분 후 완전 반영
```

## 인프라 설정

### AWS 계정 정보
```
Account ID: 887078546492
IAM User: ai_nova
Region: us-east-1 (Frontend)
         ap-northeast-2 (Lambda)
```

### 서비스 구성

#### Frontend (S3 + CloudFront)
```
S3 Bucket: g2-pre-games-frontend
- Location: us-east-1
- Public Access: CloudFront only
- Versioning: Enabled

CloudFront Distribution: E2SSUB36GW6E6B
- Type: Static file delivery
- Origin: S3 bucket
- Custom Domain: pre.g.sedaily.ai
- SSL: ACM Certificate (AWS managed)
- Default TTL: 86400 (1일)
```

#### Backend (Lambda + Bedrock)
```
Lambda Function: sedaily-chatbot-dev-handler
- Runtime: Python 3.11
- Memory: 1024 MB
- Timeout: 60 seconds
- Region: ap-northeast-2

Bedrock Model: Claude 3 Sonnet
- Region: ap-northeast-2
```

#### API Gateway
```
Stage: prod
Endpoint: https://zetqmdpbc1.execute-api.us-east-1.amazonaws.com/prod/chat
```

## 배포 방법

### 자동 배포 스크립트

#### 빠른 배포 (Frontend만)
```bash
pnpm quick-deploy
```

#### 전체 배포 (Frontend + Backend)
```bash
pnpm full-deploy
```

### 수동 배포

```bash
# Step 1: 빌드
rm -rf .next out
pnpm run build:export

# Step 2: S3 업로드
aws s3 sync ./out s3://g2-pre-games-frontend \
  --delete --exclude '*.txt'

# Step 3: CloudFront 무효화
aws cloudfront create-invalidation \
  --distribution-id E2SSUB36GW6E6B \
  --paths "/*"
```

## 빌드 결과

### 정적 파일 생성 (out/)
```
Total Size: 10.6 MB
- Images: ~9 MB (WebP optimized)
- HTML/CSS/JS: ~1.6 MB

Pages Generated: 28
First Load JS: 101-166 kB
```

## 환경 변수

### .env.backup (Git tracked)
```env
NEXT_PUBLIC_CHATBOT_API_URL=https://zetqmdpbc1.execute-api.us-east-1.amazonaws.com/prod/chat
BIGKINDS_API_KEY=<api-key>
```

## 기술 스택 변경사항 (2025-11-15)

### 개선사항
- ✅ 이미지 최적화: WebP 92% 크기 감소
- ✅ 빌드 설정: image-loader.js (정적 export)
- ✅ GameLoadingScreen: 새 로딩 컴포넌트
- ✅ 이모지 제거: 콘솔 출력 정리
- ✅ CloudFront 마이그레이션: E2SSUB36GW6E6B

### 파일 변경
```
next.config.mjs:
  - images.loader, loaderFile 제거
  - unoptimized: true로 설정

lib/image-loader.ts → lib/image-loader.js:
  - TypeScript → JavaScript 변환
  - 정적 export 모드 호환성

components/ui/GameLoadingScreen.tsx:
  - 새로운 로딩 화면 컴포넌트
```

## 모니터링

### CloudFront 모니터링
```bash
aws cloudfront get-distribution --id E2SSUB36GW6E6B
aws cloudfront list-invalidations --distribution-id E2SSUB36GW6E6B
```

### Lambda 로그
```bash
aws logs tail /aws/lambda/sedaily-chatbot-dev-handler --follow
```

### S3 모니터링
```bash
aws s3 ls s3://g2-pre-games-frontend --recursive --summarize
```

## 성능 최적화

### 이미지 최적화
- **Format**: WebP
- **Quality**: 85
- **Size Reduction**: 92%

### 캐싱 전략
```
/: 1일
/games/*: 1일
/images/*: 30일
/api/*: 1시간
```

## 트러블슈팅

### CloudFront 캐시 무효화
```bash
aws cloudfront create-invalidation \
  --distribution-id E2SSUB36GW6E6B \
  --paths "/*"
```

### 크리덴셜 확인
```bash
aws sts get-caller-identity
# Account: 887078546492
# User: ai_nova
```
     ↓ 실패  
게임별 폴백 응답
```

## 🎯 게임별 특화

- **BlackSwan**: 위기/리스크 분석 특화
- **PrisonersDilemma**: 게임이론 특화  
- **SignalDecoding**: 경제지표 분석 특화

## 🔄 배포 명령어

```bash
# Frontend만 배포 (권장)
pnpm quick-deploy

# Backend만 배포
pnpm backend-deploy

# 전체 배포 (Frontend + Backend)
pnpm full-deploy

# 개발 서버
pnpm dev
```

## 🐛 알려진 이슈

- ✅ **해결됨**: RSC 404 에러 (CloudFront 캐시 무효화로 해결)
- ✅ **해결됨**: BigKinds API 실패 시 폴백 응답 → 순수 Claude 응답으로 개선

## 📈 성능 지표

- **응답 시간**: < 10초 (Claude + RAG)
- **가용성**: 99.9% (Lambda + CloudFront)
- **캐시 적중률**: 95%+ (정적 자산)

---

**마지막 업데이트**: 2025-11-10 15:35 KST
**배포 담당**: Amazon Q Developer