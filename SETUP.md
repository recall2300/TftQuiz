# TFT Quiz - 설정 가이드

## 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) → 새 프로젝트 생성
2. **SQL Editor** → `supabase/schema.sql` 내용 실행
3. **SQL Editor** → `supabase/seed.sql` 내용 실행 (샘플 문제)
4. **Settings → API** → URL과 anon key 복사

## 2. Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com) → OAuth 2.0 클라이언트 생성
2. 승인된 리디렉션 URI 추가:
   - `https://[프로젝트ID].supabase.co/auth/v1/callback`
3. Supabase **Authentication → Providers → Google** → Client ID/Secret 입력

## 3. 로컬 개발

```bash
# .env.local 파일 생성
cp .env.local.example .env.local
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 입력

npm install
npm run dev
```

## 4. Vercel 배포

1. GitHub에 푸시
2. [vercel.com](https://vercel.com) → Import Git Repository
3. **Environment Variables** 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## 5. 퀴즈 문제 추가

`supabase/seed.sql` 패턴을 따라 SQL로 직접 추가하거나, Supabase Table Editor에서 추가:

```sql
insert into public.quiz_questions 
  (category_id, image_url, question_text, choices, correct_answers, is_multi_answer, difficulty)
values (
  1, -- category: 1=챔피언, 2=아이템, 3=시너지, 4=증강체
  'https://이미지URL',
  '이 챔피언의 이름은?',
  '[{"id":"a","text":"진크스"},{"id":"b","text":"케이틀린"},{"id":"c","text":"바이"},{"id":"d","text":"에코"}]',
  '["a"]', -- 정답 ID 배열
  false,   -- 다중 정답 여부
  1        -- 난이도 (1=쉬움, 2=보통, 3=어려움)
);
```

## 이미지 URL 참고

- **Data Dragon CDN**: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/[ChampionName].png`
- **Community Dragon**: `https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/`
- **Supabase Storage**: 직접 업로드 후 Public URL 사용
