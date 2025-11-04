# 서울경제 뉴스게임 플랫폼

경제 뉴스를 기반으로 한 인터랙티브 퀴즈 게임 플랫폼입니다.

## 🎮 게임 종류

- **BlackSwan (b)**: 경제 이벤트 예측 게임
- **Prisoner's Dilemma (p)**: 경제 딜레마 상황 게임  
- **Signal Decoding (s)**: 경제 신호 해석 게임

## 🏗 프로젝트 구조

### 빌드 시스템
이 프로젝트는 **하이브리드 빌드 시스템**을 사용합니다:

#### 로컬 개발 (SSR)
```bash
npm run dev     # 개발 서버 (http://localhost:3000)
npm run build   # SSR 프로덕션 빌드 (.next 폴더)
npm start       # SSR 서버 실행
```

#### CloudFront 배포 (정적)
```bash
npm run build:export  # 정적 파일 생성 (out 폴더)
```

### 라우팅 구조

| Next.js 경로                     | 실제 주소                      | 역할                            |
| ------------------------------ | -------------------------- | ----------------------------- |
| `app/games/page.tsx`           | **gi.sedaily.ai/**         | 메인 허브 페이지 (모든 게임 진입 카드)       |
| `app/games/g1/page.tsx`        | **g1.sedaily.ai/b**        | Black Swan 아카이브 페이지           |
| `app/games/g1/play/page.tsx`   | **g1.sedaily.ai/b/play**   | Black Swan 최신 플레이 페이지         |
| `app/games/g1/[date]/page.tsx` | **g1.sedaily.ai/b/[date]** | Black Swan 특정 날짜 페이지          |
| `app/games/g2/page.tsx`        | **g1.sedaily.ai/p**        | Prisoner's Dilemma 아카이브 페이지   |
| `app/games/g2/play/page.tsx`   | **g1.sedaily.ai/p/play**   | Prisoner's Dilemma 최신 플레이 페이지 |
| `app/games/g2/[date]/page.tsx` | **g1.sedaily.ai/p/[date]** | Prisoner's Dilemma 특정 날짜 페이지  |
| `app/games/g3/page.tsx`        | **g1.sedaily.ai/s**        | Signal Decoding 아카이브 페이지      |
| `app/games/g3/play/page.tsx`   | **g1.sedaily.ai/s/play**   | Signal Decoding 최신 플레이 페이지    |
| `app/games/g3/[date]/page.tsx` | **g1.sedaily.ai/s/[date]** | Signal Decoding 특정 날짜 페이지     |

## 🔧 기술 스택

- **Framework**: Next.js 15.2.4 (App Router)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4.1.9, Framer Motion
- **UI Components**: Radix UI
- **Deployment**: AWS CloudFront + S3
- **Build**: 하이브리드 (SSR + Static Export)

## 📁 주요 디렉토리

```
project/
├── app/                    # Next.js App Router 페이지
│   ├── admin/             # Admin 퀴즈 관리
│   ├── games/             # 게임 관련 페이지
│   │   ├── g1/           # BlackSwan 게임
│   │   ├── g2/           # Prisoner's Dilemma 게임
│   │   └── g3/           # Signal Decoding 게임
│   └── api/               # API Routes
├── components/            # React 컴포넌트
│   ├── admin/            # Admin 컴포넌트
│   ├── games/            # 게임 전용 컴포넌트
│   ├── navigation/       # 네비게이션 컴포넌트
│   └── ui/              # 공통 UI 컴포넌트
├── lib/                  # 유틸리티 함수
├── aws/                  # AWS Lambda 함수 (Git 제외)
├── scripts/              # 빌드 스크립트
└── out/                  # 정적 배포 파일 (빌드 시 생성)
```

## 🚀 개발 & 배포

### 로컬 개발 (SSR)
```bash
pnpm install      # 의존성 설치
pnpm run dev      # 개발 서버 (http://localhost:3000)
pnpm run build    # SSR 프로덕션 빌드
pnpm start        # SSR 서버 실행
```

### CloudFront 배포 (정적)
```bash
pnpm run build:export    # 정적 파일 생성 (out 폴더)
```

**빌드 프로세스:**
1. Config 백업 (`next.config.mjs` → `next.config.mjs.backup`)
2. Export Config 적용 (`next.config.export.mjs` → `next.config.mjs`)
3. 정적 빌드 실행 (`output: 'export'` 모드)
4. Config 복원 (원본 복구)
5. 결과: `out/` 폴더에 배포 파일 생성

### AWS 배포
```bash
# S3 업로드
aws s3 sync ./out s3://news-games-frontend --delete

# CloudFront 캐시 무효화
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

**필요 설정:**
- S3 버킷: `news-games-frontend`
- CloudFront 배포
- GitHub Secrets (자동 배포용)
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `S3_BUCKET_NAME`
  - `CLOUDFRONT_DISTRIBUTION_ID`

## 📊 성능 최적화

- **번들 크기**: First Load JS 101kB
- **이미지**: WebP 포맷 사용, 최적화된 크기
- **캐싱**: 정적 리소스 1년, 페이지 1시간
- **코드 분할**: 페이지별 자동 스플리팅

## 🎯 게임 특징

### 상태 관리
- **[date] 페이지**: 진행 상태 localStorage 저장 (실수 방지)
- **play 페이지**: 상태 저장 안함 (매번 새로 시작, 연습용)

### 반응형 디자인
- 모바일, 태블릿, 데스크톱 지원
- Touch-friendly 인터페이스
- 다크/라이트 모드 지원

## 🎛️ Admin 퀴즈 관리

### 환경 설정
`.env.local` 파일에 Lambda API Gateway URL 설정:
```env
NEXT_PUBLIC_QUIZ_SAVE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/quizzes
```

### 사용 방법
1. `/admin/quiz` 접속 후 비밀번호 입력
2. 날짜 및 게임 테마 선택
3. 문제 작성 (객관식/주관식)
4. 저장 → 2초 후 자동 초기화 → 다음 문제 작성 가능

### Lambda 병합 로직
- 한 문제씩 추가하면 Lambda가 자동으로 같은 날짜의 기존 문제와 병합
- ID 기준 중복 제거/업데이트
- 여러 문제 연속 작성 가능

### 필수 입력 필드
- **공통**: 게임 테마, 문제 유형, 질문 내용, 해설, 태그
- **객관식**: 선택지 2~6개, 정답 선택
- **주관식**: 정답 텍스트

---

**🔗 관련 링크**
- [메인 사이트](https://gi.sedaily.ai)
- [게임 포털](https://g1.sedaily.ai)
