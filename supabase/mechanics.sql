-- =========================================================
-- TFT Quiz - Mechanics Categories & Questions
-- Run AFTER schema.sql
-- =========================================================

-- 1. Make image_url nullable
ALTER TABLE public.quiz_questions ALTER COLUMN image_url DROP NOT NULL;

-- 2. New categories
INSERT INTO public.quiz_categories (slug, display_name, description, icon, color) VALUES
  ('roll_chance', '리롤 확률', '레벨별 코스트 챔피언 등장 확률을 맞추세요', '🎲', 'orange'),
  ('economy',     '경험치/골드', '레벨업 XP와 골드 경제 지식을 테스트하세요', '💰', 'cyan'),
  ('damage',      '피해량 공식', '스테이지 기본 피해량과 총 피해량을 계산하세요', '🔥', 'red')
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- 3. ROLL CHANCE QUESTIONS
-- =========================================================
INSERT INTO public.quiz_questions
  (category_id, image_url, question_text, choices, correct_answers, is_multi_answer, difficulty)
SELECT c.id, NULL, q.question_text, q.choices::jsonb, q.correct_answers::jsonb, false, q.difficulty
FROM public.quiz_categories c,
(VALUES
  ('Lv.7에서 4코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"5%"},{"id":"b","text":"10%"},{"id":"c","text":"15%"},{"id":"d","text":"19%"}]',
   '["b"]', 1),
  ('Lv.8에서 5코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"1%"},{"id":"b","text":"3%"},{"id":"c","text":"5%"},{"id":"d","text":"7%"}]',
   '["b"]', 2),
  ('Lv.9에서 4코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"25%"},{"id":"b","text":"30%"},{"id":"c","text":"33%"},{"id":"d","text":"40%"}]',
   '["c"]', 2),
  ('Lv.6에서 2코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"30%"},{"id":"b","text":"33%"},{"id":"c","text":"40%"},{"id":"d","text":"45%"}]',
   '["c"]', 1),
  ('Lv.5에서 3코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"15%"},{"id":"b","text":"18%"},{"id":"c","text":"20%"},{"id":"d","text":"25%"}]',
   '["c"]', 1),
  ('Lv.4에서 2코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"20%"},{"id":"b","text":"25%"},{"id":"c","text":"30%"},{"id":"d","text":"33%"}]',
   '["c"]', 1),
  ('Lv.8에서 4코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"20%"},{"id":"b","text":"25%"},{"id":"c","text":"30%"},{"id":"d","text":"33%"}]',
   '["c"]', 2),
  ('Lv.10에서 4코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"33%"},{"id":"b","text":"35%"},{"id":"c","text":"40%"},{"id":"d","text":"45%"}]',
   '["c"]', 2),
  ('Lv.9에서 5코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"10%"},{"id":"b","text":"12%"},{"id":"c","text":"15%"},{"id":"d","text":"20%"}]',
   '["c"]', 2),
  ('Lv.10에서 3코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"15%"},{"id":"b","text":"20%"},{"id":"c","text":"25%"},{"id":"d","text":"30%"}]',
   '["b"]', 2),
  ('Lv.5에서 4코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"0%"},{"id":"b","text":"2%"},{"id":"c","text":"5%"},{"id":"d","text":"10%"}]',
   '["b"]', 2),
  ('Lv.3에서 2코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"15%"},{"id":"b","text":"20%"},{"id":"c","text":"25%"},{"id":"d","text":"30%"}]',
   '["c"]', 1),
  ('Lv.6에서 4코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"2%"},{"id":"b","text":"5%"},{"id":"c","text":"7%"},{"id":"d","text":"10%"}]',
   '["b"]', 2),
  ('Lv.7에서 3코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"30%"},{"id":"b","text":"35%"},{"id":"c","text":"40%"},{"id":"d","text":"45%"}]',
   '["c"]', 1),
  ('5코스트 챔피언이 처음 등장하기 시작하는 레벨은?',
   '[{"id":"a","text":"Lv.5"},{"id":"b","text":"Lv.6"},{"id":"c","text":"Lv.7"},{"id":"d","text":"Lv.8"}]',
   '["c"]', 1),
  ('Lv.8에서 3코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"25%"},{"id":"b","text":"30%"},{"id":"c","text":"32%"},{"id":"d","text":"35%"}]',
   '["c"]', 2),
  ('Lv.10에서 1코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"5%"},{"id":"b","text":"10%"},{"id":"c","text":"15%"},{"id":"d","text":"19%"}]',
   '["a"]', 3),
  ('Lv.4에서 3코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"10%"},{"id":"b","text":"12%"},{"id":"c","text":"15%"},{"id":"d","text":"20%"}]',
   '["c"]', 2),
  ('Lv.7에서 1코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"15%"},{"id":"b","text":"17%"},{"id":"c","text":"19%"},{"id":"d","text":"20%"}]',
   '["c"]', 2),
  ('Lv.10에서 5코스트 챔피언의 리롤 확률은?',
   '[{"id":"a","text":"20%"},{"id":"b","text":"22%"},{"id":"c","text":"25%"},{"id":"d","text":"30%"}]',
   '["c"]', 3)
) AS q(question_text, choices, correct_answers, difficulty)
WHERE c.slug = 'roll_chance';

-- =========================================================
-- 4. ECONOMY QUESTIONS (경험치/골드)
-- =========================================================
INSERT INTO public.quiz_questions
  (category_id, image_url, question_text, choices, correct_answers, is_multi_answer, difficulty)
SELECT c.id, NULL, q.question_text, q.choices::jsonb, q.correct_answers::jsonb, false, q.difficulty
FROM public.quiz_categories c,
(VALUES
  ('7레벨 → 8레벨 업에 필요한 경험치는?',
   '[{"id":"a","text":"36 XP"},{"id":"b","text":"48 XP"},{"id":"c","text":"60 XP"},{"id":"d","text":"68 XP"}]',
   '["c"]', 1),
  ('6레벨 → 7레벨 업에 필요한 경험치는?',
   '[{"id":"a","text":"20 XP"},{"id":"b","text":"30 XP"},{"id":"c","text":"36 XP"},{"id":"d","text":"40 XP"}]',
   '["c"]', 1),
  ('매 라운드 자동으로 얻는 경험치는?',
   '[{"id":"a","text":"1 XP"},{"id":"b","text":"2 XP"},{"id":"c","text":"3 XP"},{"id":"d","text":"4 XP"}]',
   '["b"]', 1),
  ('4레벨 → 5레벨 업에 필요한 경험치는?',
   '[{"id":"a","text":"6 XP"},{"id":"b","text":"8 XP"},{"id":"c","text":"10 XP"},{"id":"d","text":"12 XP"}]',
   '["c"]', 1),
  ('8레벨 → 9레벨 업에 필요한 경험치는?',
   '[{"id":"a","text":"60 XP"},{"id":"b","text":"64 XP"},{"id":"c","text":"68 XP"},{"id":"d","text":"72 XP"}]',
   '["c"]', 2),
  ('9레벨 → 10레벨 업에 필요한 경험치는?',
   '[{"id":"a","text":"60 XP"},{"id":"b","text":"64 XP"},{"id":"c","text":"68 XP"},{"id":"d","text":"72 XP"}]',
   '["c"]', 2),
  ('5레벨 → 6레벨 업에 필요한 경험치는?',
   '[{"id":"a","text":"10 XP"},{"id":"b","text":"15 XP"},{"id":"c","text":"20 XP"},{"id":"d","text":"25 XP"}]',
   '["c"]', 1),
  ('3레벨 → 4레벨 업에 필요한 경험치는?',
   '[{"id":"a","text":"2 XP"},{"id":"b","text":"4 XP"},{"id":"c","text":"6 XP"},{"id":"d","text":"8 XP"}]',
   '["c"]', 1),
  ('보유 골드 30~39 이자는?',
   '[{"id":"a","text":"+1골드"},{"id":"b","text":"+2골드"},{"id":"c","text":"+3골드"},{"id":"d","text":"+4골드"}]',
   '["c"]', 1),
  ('보유 골드 50 이상 이자는?',
   '[{"id":"a","text":"+3골드"},{"id":"b","text":"+4골드"},{"id":"c","text":"+5골드"},{"id":"d","text":"+6골드"}]',
   '["c"]', 1),
  ('보유 골드 10~19 이자는?',
   '[{"id":"a","text":"+0골드"},{"id":"b","text":"+1골드"},{"id":"c","text":"+2골드"},{"id":"d","text":"+3골드"}]',
   '["b"]', 1),
  ('5연승/연패 추가 골드는?',
   '[{"id":"a","text":"+1골드"},{"id":"b","text":"+2골드"},{"id":"c","text":"+3골드"},{"id":"d","text":"+4골드"}]',
   '["b"]', 2),
  ('6연승/연패 이상 추가 골드는?',
   '[{"id":"a","text":"+1골드"},{"id":"b","text":"+2골드"},{"id":"c","text":"+3골드"},{"id":"d","text":"+5골드"}]',
   '["c"]', 2),
  ('2-2 이후 라운드당 기본 골드 획득량은?',
   '[{"id":"a","text":"+3골드"},{"id":"b","text":"+4골드"},{"id":"c","text":"+5골드"},{"id":"d","text":"+6골드"}]',
   '["c"]', 1),
  ('2연승/연패 추가 골드는?',
   '[{"id":"a","text":"+0골드"},{"id":"b","text":"+1골드"},{"id":"c","text":"+2골드"},{"id":"d","text":"+3골드"}]',
   '["b"]', 1),
  ('PvP 라운드 승리 시 추가 골드는?',
   '[{"id":"a","text":"+0골드"},{"id":"b","text":"+1골드"},{"id":"c","text":"+2골드"},{"id":"d","text":"+3골드"}]',
   '["b"]', 1),
  ('1-4 라운드 골드 획득량은?',
   '[{"id":"a","text":"+2골드"},{"id":"b","text":"+3골드"},{"id":"c","text":"+4골드"},{"id":"d","text":"+5골드"}]',
   '["b"]', 1),
  ('보유 골드 20~29 이자는?',
   '[{"id":"a","text":"+1골드"},{"id":"b","text":"+2골드"},{"id":"c","text":"+3골드"},{"id":"d","text":"+4골드"}]',
   '["b"]', 1),
  ('2-1 라운드 골드 획득량은?',
   '[{"id":"a","text":"+2골드"},{"id":"b","text":"+3골드"},{"id":"c","text":"+4골드"},{"id":"d","text":"+5골드"}]',
   '["c"]', 2),
  ('보유 골드 40~49 이자는?',
   '[{"id":"a","text":"+2골드"},{"id":"b","text":"+3골드"},{"id":"c","text":"+4골드"},{"id":"d","text":"+5골드"}]',
   '["c"]', 2)
) AS q(question_text, choices, correct_answers, difficulty)
WHERE c.slug = 'economy';

-- =========================================================
-- 5. DAMAGE QUESTIONS (피해량 공식)
-- =========================================================
INSERT INTO public.quiz_questions
  (category_id, image_url, question_text, choices, correct_answers, is_multi_answer, difficulty)
SELECT c.id, NULL, q.question_text, q.choices::jsonb, q.correct_answers::jsonb, false, q.difficulty
FROM public.quiz_categories c,
(VALUES
  ('5스테이지 기본 피해량은?',
   '[{"id":"a","text":"7"},{"id":"b","text":"8"},{"id":"c","text":"10"},{"id":"d","text":"12"}]',
   '["c"]', 1),
  ('3스테이지 기본 피해량은?',
   '[{"id":"a","text":"4"},{"id":"b","text":"5"},{"id":"c","text":"6"},{"id":"d","text":"7"}]',
   '["c"]', 1),
  ('6스테이지 기본 피해량은?',
   '[{"id":"a","text":"10"},{"id":"b","text":"11"},{"id":"c","text":"12"},{"id":"d","text":"15"}]',
   '["c"]', 1),
  ('4스테이지 기본 피해량은?',
   '[{"id":"a","text":"5"},{"id":"b","text":"6"},{"id":"c","text":"7"},{"id":"d","text":"8"}]',
   '["c"]', 1),
  ('7스테이지 기본 피해량은?',
   '[{"id":"a","text":"12"},{"id":"b","text":"15"},{"id":"c","text":"17"},{"id":"d","text":"20"}]',
   '["c"]', 2),
  ('2스테이지 기본 피해량은?',
   '[{"id":"a","text":"0"},{"id":"b","text":"1"},{"id":"c","text":"2"},{"id":"d","text":"3"}]',
   '["c"]', 1),
  ('1스테이지 기본 피해량은?',
   '[{"id":"a","text":"0"},{"id":"b","text":"1"},{"id":"c","text":"2"},{"id":"d","text":"3"}]',
   '["a"]', 1),
  ('4스테이지에서 적 유닛 4명 생존 시 총 피해량은?',
   '[{"id":"a","text":"9"},{"id":"b","text":"10"},{"id":"c","text":"11"},{"id":"d","text":"12"}]',
   '["c"]', 2),
  ('5스테이지에서 적 유닛 5명 생존 시 총 피해량은?',
   '[{"id":"a","text":"12"},{"id":"b","text":"13"},{"id":"c","text":"14"},{"id":"d","text":"15"}]',
   '["d"]', 2),
  ('3스테이지에서 적 유닛 3명 생존 시 총 피해량은?',
   '[{"id":"a","text":"7"},{"id":"b","text":"8"},{"id":"c","text":"9"},{"id":"d","text":"10"}]',
   '["c"]', 2),
  ('6스테이지에서 적 유닛 2명 생존 시 총 피해량은?',
   '[{"id":"a","text":"12"},{"id":"b","text":"13"},{"id":"c","text":"14"},{"id":"d","text":"16"}]',
   '["c"]', 2),
  ('7스테이지에서 적 유닛 2명 생존 시 총 피해량은?',
   '[{"id":"a","text":"17"},{"id":"b","text":"18"},{"id":"c","text":"19"},{"id":"d","text":"20"}]',
   '["c"]', 3),
  ('5스테이지에서 적 유닛 0명 생존 시 (완승) 피해량은?',
   '[{"id":"a","text":"0"},{"id":"b","text":"5"},{"id":"c","text":"10"},{"id":"d","text":"15"}]',
   '["c"]', 2),
  ('피해량 공식으로 올바른 것은?',
   '[{"id":"a","text":"기본 피해량만"},{"id":"b","text":"기본 피해량 + 생존 적 유닛 수"},{"id":"c","text":"생존 적 유닛 수 × 2"},{"id":"d","text":"기본 피해량 × 적 유닛 수"}]',
   '["b"]', 1),
  ('4스테이지에서 적 유닛 6명 생존 시 총 피해량은?',
   '[{"id":"a","text":"11"},{"id":"b","text":"12"},{"id":"c","text":"13"},{"id":"d","text":"14"}]',
   '["c"]', 2),
  ('3스테이지에서 적 유닛 7명 생존 시 총 피해량은?',
   '[{"id":"a","text":"11"},{"id":"b","text":"12"},{"id":"c","text":"13"},{"id":"d","text":"14"}]',
   '["c"]', 3),
  ('6스테이지에서 적 유닛 5명 생존 시 총 피해량은?',
   '[{"id":"a","text":"15"},{"id":"b","text":"16"},{"id":"c","text":"17"},{"id":"d","text":"18"}]',
   '["c"]', 2),
  ('2스테이지에서 적 유닛 4명 생존 시 총 피해량은?',
   '[{"id":"a","text":"4"},{"id":"b","text":"5"},{"id":"c","text":"6"},{"id":"d","text":"7"}]',
   '["c"]', 2),
  ('5스테이지에서 적 유닛 8명 생존 시 총 피해량은?',
   '[{"id":"a","text":"16"},{"id":"b","text":"17"},{"id":"c","text":"18"},{"id":"d","text":"20"}]',
   '["c"]', 3),
  ('7스테이지 기본 피해량과 5스테이지 기본 피해량의 차이는?',
   '[{"id":"a","text":"5"},{"id":"b","text":"6"},{"id":"c","text":"7"},{"id":"d","text":"8"}]',
   '["c"]', 3)
) AS q(question_text, choices, correct_answers, difficulty)
WHERE c.slug = 'damage';
