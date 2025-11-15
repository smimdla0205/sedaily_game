# 서울경제 뉴스게임 플랫폼

경제 뉴스를 기반으로 한 인터랙티브 퀴즈 게임 플랫폼입니다.

[![Deploy Status](https://img.shields.io/badge/Deploy-Live-brightgreen)](https://g2.sedaily.ai)
[![GitHub](https://img.shields.io/badge/GitHub-sedaily/g2--clone-blue)](https://github.com/sedaily/g2-clone)
[![AWS](https://img.shields.io/badge/AWS-Lambda%20%2B%20CloudFront-orange)](https://aws.amazon.com/)

**🌐 Live:** https://g2.sedaily.ai

## 🎮 게임 종류

### 📊 BlackSwan (g1)
흑조 이벤트 - 예측 불가능한 경제 위기 상황을 분석하는 게임

### 🤝 Prisoner's Dilemma (g2)
죄수의 딜레마 - 경제 주체 간 전략적 의사결정 게임

### 📡 Signal Decoding (g3)
신호 해독 - 경제 지표와 시장 신호를 해석하는 게임

## 🏗 아키텍처

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Static Export**: SSG 기반 완전 정적 사이트 생성
- **Hosting**: AWS CloudFront + S3
- **Domain**: https://g2.sedaily.ai
- **Components**: QuizCarousel (Embla Carousel 기반)

```bash
pnpm dev              # 개발 서버 (localhost:3000)
pnpm build            # 프로덕션 빌드
pnpm build:export     # 정적 파일 생성 (out/)
pnpm quick-deploy     # S3 + CloudFront 배포
```

### Backend
- **Lambda**: `sedaily-chatbot-dev-handler` (Python 3.11)
- **AI**: Claude 3 Sonnet (AWS Bedrock)
- **RAG**: BigKinds API + 퀴즈 컨텍스트
- **API**: `/prod/quizzes/all` (전체 퀴즈 데이터)

## 🔧 기술 스택

### Frontend
| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.2.4 (App Router) |
| Runtime | React 19.2.0 |
| Language | TypeScript 5.9.3 |
| Styling | Tailwind CSS 4.1.16 |
| UI Components | Radix UI (25+ components) |
| Carousel | Embla Carousel React 8.6.0 |
| Animation | Framer Motion |
| Package Manager | pnpm 10.15.1 |
| State | React Hooks + localStorage |

### Backend
| Category | Technology |
|----------|-----------|
| Serverless | AWS Lambda (Python 3.11) |
| AI Model | Claude 3 Sonnet (Bedrock) |
| RAG Source | BigKinds API |
| API Gateway | AWS API Gateway |
| Function | `sedaily-chatbot-dev-handler` |

### Infrastructure
| Category | Service |
|----------|---------|
| Hosting | AWS S3 (`g2-frontend-ver2`) |
| CDN | CloudFront (E1C1UNHJ75JZMZ) |
| Domain | g2.sedaily.ai |
| SSL | ACM Certificate |
| Deployment | Automated Scripts |

## 📁 프로젝트 구조

```
g2-clone/
├── app/                    # Next.js 15 App Router
│   ├── admin/quiz/        # 퀴즈 관리 도구 (비밀번호 보호)
│   ├── games/             # 게임 페이지
│   │   ├── g1/           # BlackSwan 게임
│   │   ├── g2/           # Prisoner's Dilemma 게임
│   │   └── g3/           # Signal Decoding 게임
│   ├── api/chat/         # 챗봇 프록시 API Routes
│   ├── test-chatbot/     # 챗봇 테스트 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   └── page.tsx          # 홈페이지
├── components/            # React 컴포넌트
│   ├── games/            # 게임 관련 컴포넌트
│   │   ├── QuizCarousel.tsx     # 🎯 메인 퀴즈 플레이어 (Embla)
│   │   ├── AIChatbot.tsx        # RAG 기반 AI 챗봇
│   │   ├── GameCard.tsx         # 게임 카드
│   │   └── UniversalQuizPlayer.tsx  # (Legacy)
│   ├── admin/            # 관리자 컴포넌트
│   │   ├── QuizEditor.tsx       # 퀴즈 에디터
│   │   ├── DateSetList.tsx      # 날짜 관리
│   │   └── PasswordModal.tsx    # 비밀번호 모달
│   ├── ui/              # Radix UI 기반 컴포넌트 (25개+)
│   └── navigation/       # 헤더, 푸터
├── lib/                  # 유틸리티 라이브러리
│   ├── quiz-api-client.ts  # AWS Lambda API 클라이언트
│   ├── quiz-storage.ts     # localStorage 상태 관리
│   ├── games-data.ts       # 게임 메타데이터 + 데이터 로딩
│   ├── chatbot-api.ts      # 챗봇 API 클라이언트
│   └── date-utils.ts       # 날짜 유틸리티
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
├── types/               # TypeScript 타입 정의
└── out/                 # 정적 빌드 결과 (배포용)
```

## 🚀 개발 & 배포

### 개발
```bash
pnpm install      # 의존성 설치
pnpm dev          # 개발 서버 (http://localhost:3000)
```

### 배포
```bash
# Frontend 배포 (권장)
pnpm quick-deploy     # 빌드 + S3 + CloudFront

# 전체 배포 (Frontend + Backend)
pnpm full-deploy      # Frontend + Lambda 배포

# 수동 빌드
pnpm build:export     # 정적 파일 생성 (out 폴더)
```

### AWS 인프라
- **S3**: `g2-frontend-ver2` (정적 호스팅)
- **CloudFront**: `E1C1UNHJ75JZMZ`
- **Domain**: `g2.sedaily.ai`
- **SSL**: ACM Certificate (`9c87fd8a-3506-4a55-86dc-03bfeb6b22d8`)
- **Lambda**: `sedaily-chatbot-dev-handler` (Python 3.11)
- **Bedrock**: Claude 3 Sonnet (ap-northeast-2)
- **API Gateway**: `zetqmdpbc1.execute-api.us-east-1.amazonaws.com`

## 🎯 주요 기능

### QuizCarousel - 메인 퀴즈 플레이어
- **Embla Carousel**: Fade 트랜지션 기반 문제 네비게이션
- **답안 체크**: 실시간 정답/오답 피드백 (색상 구분)
- **점수 추적**: localStorage 기반 진행 상태 저장
- **키보드 단축키**: A/B/C/D 객관식 선택
- **자동 진행**: 정답 선택 후 1초 뒤 다음 문제
- **게임별 테마**: BlackSwan/PrisonersDilemma/SignalDecoding 색상 스타일
- **반응형 UI**: 모바일/데스크톱 최적화
- **마지막 문제 액션**: 다시 하기/돌아가기 버튼

### AI 챗봇
- **Claude 3 Sonnet**: AWS Bedrock 기반
- **RAG**: BigKinds API + 퀴즈 컨텍스트
- **게임별 특화**: 
  - BlackSwan → 위기 분석
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

### 2025-01-13
- **QuizCarousel 통합**: UniversalQuizPlayer → QuizCarousel 전환
- **Embla Carousel**: Fade 트랜지션 + 외부 화살표 네비게이션
- **UX 개선**: 자동 진행, 키보드 단축키, 마지막 문제 액션 버튼
- **빌드 최적화**: 29개 정적 페이지 생성 (101-166 kB First Load JS)

### 2025-01-10
- **RAG Fallback**: BigKinds API 실패 시 순수 Claude 응답
- **Lambda 최적화**: Python 3.11, 1024MB, 60초 타임아웃
- **도메인 설정**: g2.sedaily.ai 커스텀 도메인 연결

## 📈 성능 지표

- **빌드 결과**: 29개 정적 페이지
- **First Load JS**: 101-166 kB
- **SSG 라우트**: 12개 (날짜별 퀴즈)
- **캐싱**: CloudFront + 5분 메모리 캐시

## 🔗 링크

- 🌐 **Live**: https://g2.sedaily.ai
- 📱 **GitHub**: https://github.com/sedaily/g2-clone
- � **BigKinds API**: https://www.bigkinds.or.kr

## � 기술 스택 요약

```
Frontend: Next.js 15.2.4 + React 19 + TypeScript 5
Styling: Tailwind CSS 4 + Radix UI + Framer Motion
Carousel: Embla Carousel React 8.6.0
Backend: AWS Lambda (Python 3.11)
AI: Claude 3 Sonnet (AWS Bedrock)
Hosting: CloudFront + S3
Domain: g2.sedaily.ai
```

---

**Made with ❤️ by Seoul Economic Daily**
