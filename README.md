# 🧞 AI aGENIEnt — Crypto Wish Funding Agent

> AI-powered crypto wish funding agent that turns birthday wishes into shareable onchain funding goals.

## 개요

AI aGENIEnt는 사용자가 원하는 암호화폐(SOL, BTC, BASE, ETH)와 목표 수량을 입력해 "소원빌기" 페이지를 생성하면, 친구들이 공유 링크를 통해 펀딩과 축하 메시지를 남길 수 있는 Crypto Wish Funding 서비스입니다.

Flock.io LLM이 소셜 공유 문구를 생성하고, Agent Chat에서 실시간으로 펀딩 현황을 안내합니다.

---

## 빠른 시작

### 1. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local`을 열고 다음 값을 입력합니다:

```env
FLOCK_API_KEY=sk-...         # Flock.io 대시보드에서 발급
FLOCK_BASE_URL=https://api.flock.io/v1
FLOCK_MODEL=qwen3-30b-a3b-instruct-2507
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 접속

```
http://localhost:3000
```

---

## 데모 플로우

1. 메인 페이지에서 ETH 선택 → 목표 0.5 ETH → 데드라인 설정 → **소원빌기** 클릭
2. AI aGENIEnt가 소셜 공유 문구 자동 생성
3. 생성된 Wish 상세 페이지에서 공유 링크 복사
4. 다른 사용자가 링크 접속 → 0.1 ETH 펀딩 + 축하 메시지 입력 → **펀딩 참여하기**
5. 진행률이 20%로 업데이트
6. Agent Chat에서 "지금 몇 % 모였어?" 질문 → AI가 현황 답변
7. 추가 펀딩으로 목표 달성 시 **목표 달성!** 배지 표시

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| AI | Flock.io API Platform (OpenAI 호환) |
| 스토리지 | In-memory Mock (추후 Supabase/DB 교체 가능) |
| 배포 | Vercel |

---

## 페이지 구조

```
/                    소원 생성 페이지
/wishes/[id]         Wish 상세 + 펀딩 + Agent Chat
```

## API 구조

```
POST /api/wishes                         Wish 생성
GET  /api/wishes/:id                     Wish 조회
POST /api/wishes/:id/contributions       펀딩 참여
POST /api/agent/chat                     Agent Chat
```

---

## 향후 확장 방향

- **Base / Ethereum**: Wallet Connect + Base Sepolia 송금
- **Solana**: Phantom Wallet + SOL 트랜잭션
- **Bitcoin**: BTC 주소 생성 + 입금 확인
- **스토리지**: Supabase 또는 PostgreSQL 연동
- **실시간**: WebSocket 또는 Server-Sent Events로 펀딩 현황 push

---

## 주의사항

- MVP에서는 **실제 온체인 송금이 발생하지 않습니다.** 모든 펀딩은 Mock 데이터입니다.
- 서버를 재시작하면 In-memory 데이터가 초기화됩니다.
- API 키는 절대 Git에 커밋하지 마세요 (`.env.local`은 `.gitignore`에 포함됨).
