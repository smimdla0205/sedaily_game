# 서울경제 뉴스게임 플랫폼

경제 뉴스를 기반으로 한 인터랙티브 퀴즈 게임 플랫폼입니다.

[![Deploy Status](https://img.shields.io/badge/Status-Production-brightgreen)](https://pre.g.sedaily.ai)
[![GitHub](https://img.shields.io/badge/GitHub-sedaily/sedaily--games-blue)](https://github.com/sedaily/sedaily-games)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![AWS](https://img.shields.io/badge/AWS-CloudFront%2FS3-orange)](https://aws.amazon.com/)

**Live:** https://pre.g.sedaily.ai

## 게임 종류

### BlackSwan (g1)
**흑조 이벤트** - 예측 불가능한 경제 위기 상황을 분석하는 게임

### Prisoner's Dilemma (g2)  
**죄수의 딜레마** - 경제 주체 간 전략적 의사결정 게임

### Signal Decoding (g3)
**신호 해독** - 경제 지표와 시장 신호를 해석하는 게임

## 아키텍처

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Build**: Static Export (완전 정적 사이트)
- **Hosting**: AWS CloudFront + S3
- **Domain**: https://pre.g.sedaily.ai
- **Cache**: 이미지 WebP 최적화 (92% 크기 감소)
- **Components**: Embla Carousel 기반 퀴즈 플레이어

```bash
pnpm dev              # 개발 서버 (localhost:3000)
pnpm build            # Next.js 빌드 (out/ 폴더)
pnpm build:export     # 정적 빌드 + 정리
pnpm quick-deploy     # 빌드 + S3 업로드 + CloudFront 무효화
pnpm full-deploy      # Frontend + Backend 전체 배포
```

### Backend  
- **Serverless**: AWS Lambda (Python 3.11)
- **AI Model**: Claude 3 Sonnet (AWS Bedrock)
- **RAG**: BigKinds API + 퀴즈 컨텍스트
- **Function**: `sedaily-chatbot-dev-handler`

## 기술 스택

### Frontend
| 카테고리 | 기술 |
|---------|------|
| Framework | Next.js 15.2.4 (App Router) |
| Runtime | React 19.2.0 |
| Language | TypeScript 5.9.3 |
| Styling | Tailwind CSS 4.1.16 |
| UI Components | Radix UI + shadcn/ui |
| Carousel | Embla Carousel React 8.6.0 |
| Image | WebP 최적화 (quality 85) |
| Package Manager | pnpm 10.15.1 |
| Build Export | Static HTML + CSS + JS |

### Backend
| 카테고리 | 기술 |
|---------|------|
| Serverless | AWS Lambda (Python 3.11) |
| AI Model | Claude 3 Sonnet (Bedrock) |
| RAG | BigKinds API |
| Integration | AWS API Gateway |
| Runtime | 1024MB, 60초 timeout |

### Infrastructure
| 카테고리 | 서비스 |
|---------|--------|
| Hosting | AWS S3 (g2-pre-games-frontend) |
| CDN | CloudFront (E2SSUB36GW6E6B) |
| Domain | pre.g.sedaily.ai |
| SSL | AWS ACM |
| Deployment | pnpm scripts + AWS CLI |
| Versioning | Git (main branch) |

## 프로젝트 구조

```
sedaily-games/
├── app/                      # Next.js 15 App Router
│   ├── admin/quiz/          # 퀴즈 관리 도구 (비밀번호 보호)
│   ├── api/chat/            # 챗봇 프록시 API Routes
│   ├── games/               # 게임 페이지
│   │   ├── g1/             # BlackSwan (g1)
│   │   ├── g2/             # Prisoner's Dilemma (g2)
│   │   ├── g3/             # Signal Decoding (g3)
│   │   └── [date]/         # 동적 라우트
│   ├── test-chatbot/        # 챗봇 테스트 페이지
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈페이지
│   ├── error.tsx            # 에러 페이지
│   ├── loading.tsx          # 로딩 페이지
│   └── not-found.tsx        # 404 페이지
│
├── components/              # React 컴포넌트
│   ├── games/              # 게임 컴포넌트
│   │   ├── QuizCarousel.tsx      # 메인 퀴즈 플레이어 (Embla)
│   │   ├── AIChatbot.tsx         # RAG 기반 AI 챗봇
│   │   ├── GameCard.tsx          # 게임 카드
│   │   └── GameLoadingScreen.tsx # 로딩 화면
│   ├── admin/              # 관리자 컴포넌트
│   │   ├── QuizEditor.tsx        # 퀴즈 에디터
│   │   ├── DateSetList.tsx       # 날짜 관리
│   │   └── PasswordModal.tsx     # 비밀번호 모달
│   ├── ui/                 # Radix UI 기반 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── SedailyHeader.tsx     # 헤더
│   │   └── Footer.tsx            # 푸터
│   ├── navigation/         # 네비게이션
│   └── theme-provider.tsx  # 테마 프로바이더
│
├── lib/                    # 유틸리티 라이브러리
│   ├── quiz-api-client.ts    # AWS Lambda API 클라이언트
│   ├── quiz-api.ts           # 퀴즈 API 통합
│   ├── quiz-storage.ts       # localStorage 상태 관리
│   ├── games-data.ts         # 게임 메타데이터 (icon, color, etc)
│   ├── chatbot-api.ts        # 챗봇 API 클라이언트
│   ├── image-loader.js       # Next.js 이미지 로더 (CloudFront용)
│   ├── date-utils.ts         # 날짜 유틸리티
│   ├── utils.ts              # 일반 유틸리티
│   └── bigkinds.ts           # BigKinds API 클라이언트
│
├── backend/                # Python Lambda 함수
│   ├── lambda/
│   │   ├── enhanced-chatbot-handler.py  # RAG 기반 Claude 챗봇
│   │   ├── requirements.txt              # Python 의존성
│   │   └── ...                          # AWS SDK 패키지
│   └── serverless.yml      # Serverless Framework 설정
│
├── scripts/                # 배포 자동화 스크립트
│   ├── quick-deploy.mjs    # Frontend 빠른 배포
│   ├── full-deploy.mjs     # Frontend + Backend 전체 배포
│   ├── build-export.mjs    # 정적 빌드 스크립트
│   ├── setup-custom-domain.mjs # 커스텀 도메인 설정
│   └── full-deploy.bat     # Windows 배포 배치
│
├── docs/                   # 배포 및 설정 문서
│   ├── DEPLOYMENT_STATUS.md        # 현재 배포 상태
│   ├── CUSTOM_DOMAIN.md            # 커스텀 도메인 설정
│   ├── setup-custom-domain.md      # 도메인 설정 가이드
│   ├── BigKinds-API-Info.md        # BigKinds API 문서
│   ├── cloudfront-custom-domain.json # CloudFront 설정
│   ├── ssl-validation-record.json   # SSL 검증 레코드
│   └── test-*.json                 # 테스트 데이터
│
├── types/                  # TypeScript 타입 정의
│   ├── quiz.ts            # 퀴즈 타입
│   └── *.d.ts             # 외부 라이브러리 타입
│
├── public/                # 정적 자산
│   ├── backgrounds/       # 게임 배경 이미지 (WebP)
│   ├── icons/            # 게임 아이콘 (woodcut 스타일)
│   ├── images/           # 로고 및 기타 이미지 (WebP)
│   ├── robots.txt        # SEO robots 파일
│   └── sitemap.xml       # SEO sitemap 파일
│
├── styles/                # 전역 스타일
│   └── globals.css       # Tailwind CSS 설정
│
│
├── .env.backup           # 환경 변수 백업 (Git 추적)
├── .gitignore            # Git 무시 파일
├── next.config.mjs       # Next.js 설정 (정적 export)
├── postcss.config.mjs    # PostCSS 설정 (Tailwind)
├── tailwind.config.ts    # Tailwind CSS 설정
├── tsconfig.json         # TypeScript 설정
├── eslint.config.mjs     # ESLint 설정
├── package.json          # 프로젝트 의존성
├── pnpm-lock.yaml        # pnpm 잠금 파일
├── README.md             # 이 파일
└── components.json       # shadcn/ui 설정
├── backend/              # Python Lambda (Serverless)
│   ├── lambda/
│   │   └── enhanced-chatbot-handler.py  # RAG 기반 Claude 챗봇
│   └── serverless.yml   # Serverless Framework 설정
├── aws/chatbot-lambda/   # Node.js Lambda (미사용)
│   ├── index.js         # 기본 Claude 챗봇
│   └── package.json     # Node.js 의존성
├── scripts/              # 배포 자동화 스크립트
│   ├── quick-deploy.mjs # Frontend 빠른 배포
│   ├── full-deploy.mjs  # Frontend + Backend 전체 배포
│   └── build-export.mjs # 정적 빌드 스크립트
├── public/              # 정적 자산
│   ├── backgrounds/     # 게임별 배경 이미지
│   ├── icons/          # 게임 아이콘 (woodcut 스타일)
│   └── images/         # 로고 및 기타 이미지
└── out/                 # 정적 빌드 결과 (배포용)
```

## 개발 및 배포

### 개발 환경 설정

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
# http://localhost:3000 에서 접속 가능

# 빌드 테스트
pnpm build:export

# 타입 체크
pnpm typecheck
```

### 배포 전략

#### 빠른 배포 (Frontend만)
```bash
pnpm quick-deploy
# 1. 정적 빌드 (out/ 폴더)
# 2. S3 업로드 (g2-pre-games-frontend)
# 3. CloudFront 무효화
# 완료: ~1-2분, 3-5분 후 반영
```

#### 전체 배포 (Frontend + Backend)
```bash
pnpm full-deploy
# 1. Frontend 빌드 및 S3 업로드
# 2. Lambda 함수 업데이트 (enhanced-chatbot.zip)
# 3. CloudFront 무효화
# 완료: ~3-5분
```

#### 수동 단계별 배포
```bash
# 1단계: 빌드
pnpm build:export

# 2단계: S3 업로드
aws s3 sync ./out s3://g2-pre-games-frontend --delete --exclude '*.txt'

# 3단계: CloudFront 무효화
aws cloudfront create-invalidation --distribution-id E2SSUB36GW6E6B --paths "/*"

# 무효화 상태 확인
aws cloudfront list-invalidations --distribution-id E2SSUB36GW6E6B
```

### AWS 인프라

| 서비스 | ID/값 | 지역 |
|--------|-------|------|
| S3 Bucket | `g2-pre-games-frontend` | us-east-1 |
| CloudFront | `E2SSUB36GW6E6B` | Global |
| Domain | `pre.g.sedaily.ai` | - |
| Lambda | `sedaily-chatbot-dev-handler` | ap-northeast-2 |
| Bedrock | Claude 3 Sonnet | ap-northeast-2 |
| IAM User | `ai_nova` (Account: 887078546492) | - |

### 환경 변수 (.env.backup)

```env
NEXT_PUBLIC_CHATBOT_API_URL=https://zetqmdpbc1.execute-api.us-east-1.amazonaws.com/prod/chat
BIGKINDS_API_KEY=your-bigkinds-api-key
```

## 주요 기능

### QuizCarousel - 메인 퀴즈 플레이어
- **Embla Carousel**: Fade 트랜지션으로 부드러운 문제 전환
- **실시간 피드백**: 정답/오답 색상 표시 (빨강/초록)
- **진행 상태 저장**: localStorage에 점수/선택지 기록
- **키보드 지원**: A/B/C/D 키로 빠른 선택
- **자동 진행**: 정답 후 1초 뒤 다음 문제
- **테마 통일**: 게임별 색상 (Blue/Stone/Orange)
- **반응형 디자인**: 모바일/데스크톱 최적화
- **마지막 액션**: 게임 완료 후 "다시 하기" 또는 "돌아가기" 선택

### AI 챗봇 (AIChatbot.tsx)
- **Claude 3 Sonnet**: AWS Bedrock 기반 실시간 응답
- **RAG 시스템**: BigKinds 뉴스 + 퀴즈 컨텍스트 활용
- **게임별 특화 응답**:
  - BlackSwan → 경제 위기 분석
  - Prisoner's Dilemma → 게임이론 설명
  - Signal Decoding → 경제지표 해석
- **Fallback 메커니즘**: API 실패 시 순수 Claude 응답
- **스트리밍 응답**: 실시간 텍스트 출력

### 이미지 최적화
- **WebP 변환**: PNG → WebP (92% 크기 감소)
- **동적 로딩**: `image-loader.js`를 통한 CloudFront URL 생성
- **메모리 캐싱**: 5분 TTL로 중복 API 호출 방지
- **반응형 이미지**: 디바이스별 최적화된 크기 제공

### GameLoadingScreen
- **로딩 애니메이션**: 그라디언트 회전 로딩 원
- **진행 상태**: 동적 진행 상태 바 표시
- **사용자 피드백**: "게임 준비 중..." 메시지

## 최근 변경사항 (2025-11-15)

### 개선사항
- ✅ 이미지 최적화: WebP 변환으로 92% 크기 감소
- ✅ 빌드 설정: image-loader.js (정적 export 지원)
- ✅ GameLoadingScreen: 새로운 로딩 컴포넌트 추가
- ✅ 이모지 제거: 콘솔 출력 및 코드 정리
- ✅ CloudFront 마이그레이션: 새 배포 ID 및 도메인

### 기술 개선
- `next.config.mjs`: unoptimized 이미지 설정으로 로더 제거
- `image-loader.ts` → `image-loader.js`: 정적 빌드 호환성
- `.gitignore`: `.env.backup` 버전 관리 추가

## 배포 상태

### 현재 배포
- **Status**: Production
- **Domain**: https://pre.g.sedaily.ai
- **Last Deploy**: 2025-11-15 18:58:52 UTC
- **CloudFront**: InProgress (무효화 ID: IQ0DGDIPBVQF4Y7YVPG01WVZO)

### 이전 배포
- **Old Domain**: https://g2.sedaily.ai (deprecated)
- **Old CloudFront**: E1C1UNHJ75JZMZ
- **Old S3**: g2-frontend-ver2
  - Prisoner's Dilemma → 게임이론
  - Signal Decoding → 경제지표
- **Fallback**: BigKinds 실패 시 순수 Claude 응답

### 데이터 관리
- **날짜별 퀴즈**: `/games/{g1|g2|g3}/[date]` 동적 라우트
- **SSG**: 빌드 시 모든 날짜 페이지 사전 생성
- **캐싱**: 5분 메모리 캐시 (quiz-api-client)

## 🛠️ 관리 도구

### Admin 퀴즈 에디터 (`/admin/quiz`)
1. 비밀번호 인증
2. 날짜/게임 선택
3. 문제 작성 (객관식/주관식)
4. 자동 저장 및 초기화

### 환경 변수
```env
NEXT_PUBLIC_CHATBOT_API_URL=lambda-api-url
BIGKINDS_API_KEY=bigkinds-key
```

## 🔄 GitHub Actions 설정

자동 배포를 위해 Repository Settings → Secrets에 다음 값들을 추가하세요:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=g2-frontend-ver2
CLOUDFRONT_DISTRIBUTION_ID=E1C1UNHJ75JZMZ
```

## 📊 프로젝트 현황

- ✅ **Frontend**: 배포 완료 (Next.js 15.2.4)
- ✅ **Backend**: Lambda 함수 운영 중 (`sedaily-chatbot-dev-handler`)
- ✅ **RAG System**: BigKinds API + Claude 3 Sonnet 통합
- ✅ **CI/CD**: GitHub Actions 자동 배포
- ✅ **Monitoring**: CloudFront + Lambda 로그

## 🚀 최근 업데이트

### 2025-11-13
- **QuizCarousel 통합**: UniversalQuizPlayer → QuizCarousel 전환
- **Embla Carousel**: Fade 트랜지션 + 외부 화살표 네비게이션
- **UX 개선**: 자동 진행, 키보드 단축키, 마지막 문제 액션 버튼
- **빌드 최적화**: 29개 정적 페이지 생성 (101-166 kB First Load JS)

### 2025-11-10
- **RAG Fallback**: BigKinds API 실패 시 순수 Claude 응답
- **Lambda 최적화**: Python 3.11, 1024MB, 60초 타임아웃

## 📈 성능 지표

- **빌드 결과**: 29개 정적 페이지
- **First Load JS**: 101-166 kB
- **SSG 라우트**: 12개 (날짜별 퀴즈)
- **캐싱**: CloudFront + 5분 메모리 캐시

## � 기술 스택 요약

```
Frontend: Next.js 15.2.4 + React 19 + TypeScript 5
Styling: Tailwind CSS 4 + Radix UI + Framer Motion
Carousel: Embla Carousel React 8.6.0
Backend: AWS Lambda (Python 3.11)
AI: Claude 3 Sonnet (AWS Bedrock)
Hosting: CloudFront + S3
```

---

