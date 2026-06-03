-- =========================================================
-- TFT Quiz - Sample Questions Seed Data
-- Run AFTER schema.sql
-- Images: Add real image URLs from Riot Data Dragon CDN or Supabase Storage
-- Data Dragon base: https://ddragon.leagueoflegends.com/cdn/14.24.1/img/
-- =========================================================

-- Champion questions (category_id = 1)
insert into public.quiz_questions (category_id, image_url, question_text, choices, correct_answers, is_multi_answer, difficulty) values

(1, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Jinx.png',
 '이 챔피언의 이름은?',
 '[{"id":"a","text":"진크스"},{"id":"b","text":"미스 포츈"},{"id":"c","text":"케이틀린"},{"id":"d","text":"트리스타나"}]',
 '["a"]', false, 1),

(1, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ekko.png',
 '이 챔피언의 이름은?',
 '[{"id":"a","text":"야스오"},{"id":"b","text":"에코"},{"id":"c","text":"아칼리"},{"id":"d","text":"제드"}]',
 '["b"]', false, 1),

(1, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Vi.png',
 '이 챔피언의 이름은?',
 '[{"id":"a","text":"소나"},{"id":"b","text":"럭스"},{"id":"c","text":"바이"},{"id":"d","text":"리 신"}]',
 '["c"]', false, 1),

(1, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Viktor.png',
 '이 챔피언의 이름은?',
 '[{"id":"a","text":"빅토르"},{"id":"b","text":"머갈로돈"},{"id":"c","text":"자크"},{"id":"d","text":"말자하"}]',
 '["a"]', false, 2),

(1, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Warwick.png',
 '이 챔피언의 이름은?',
 '[{"id":"a","text":"렝가"},{"id":"b","text":"우르곳"},{"id":"c","text":"워윅"},{"id":"d","text":"다리우스"}]',
 '["c"]', false, 1),

(1, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Heimerdinger.png',
 '이 챔피언의 이름은?',
 '[{"id":"a","text":"리산드라"},{"id":"b","text":"하이머딩거"},{"id":"c","text":"코르키"},{"id":"d","text":"질리언"}]',
 '["b"]', false, 2),

(1, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Caitlyn.png',
 '이 챔피언의 이름은?',
 '[{"id":"a","text":"사이온"},{"id":"b","text":"케이틀린"},{"id":"c","text":"바루스"},{"id":"d","text":"드레이븐"}]',
 '["b"]', false, 1),

(1, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Jayce.png',
 '이 챔피언의 이름은?',
 '[{"id":"a","text":"가렌"},{"id":"b","text":"제이스"},{"id":"c","text":"판테온"},{"id":"d","text":"렉사이"}]',
 '["b"]', false, 1),

(1, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Silco.png',
 '이 챔피언의 이름은?',
 '[{"id":"a","text":"실코"},{"id":"b","text":"트위스티드 페이트"},{"id":"c","text":"세비카"},{"id":"d","text":"요네"}]',
 '["a"]', false, 2),

(1, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ambessa.png',
 '이 챔피언의 이름은?',
 '[{"id":"a","text":"암베사"},{"id":"b","text":"키아나"},{"id":"c","text":"피오라"},{"id":"d","text":"아이렐리아"}]',
 '["a"]', false, 3);

-- Item questions (category_id = 2)
insert into public.quiz_questions (category_id, image_url, question_text, choices, correct_answers, is_multi_answer, difficulty) values

(2, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/1038.png',
 '이 아이템의 이름은?',
 '[{"id":"a","text":"BF 대검"},{"id":"b","text":"장갑옷"},{"id":"c","text":"체인 조끼"},{"id":"d","text":"활"}]',
 '["a"]', false, 1),

(2, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/1029.png',
 '이 아이템의 이름은?',
 '[{"id":"a","text":"BF 대검"},{"id":"b","text":"체인 조끼"},{"id":"c","text":"거인의 허리띠"},{"id":"d","text":"무효의 망토"}]',
 '["b"]', false, 1),

(2, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/1011.png',
 '이 아이템의 이름은?',
 '[{"id":"a","text":"활"},{"id":"b","text":"체인 조끼"},{"id":"c","text":"거인의 허리띠"},{"id":"d","text":"눈물 장식"}]',
 '["c"]', false, 1),

(2, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/1058.png',
 '이 아이템의 이름은?',
 '[{"id":"a","text":"무가치한 큰 막대"},{"id":"b","text":"불필요하게 큰 막대기"},{"id":"c","text":"무쓸모 큰 막대기"},{"id":"d","text":"세공되지 않은 마법봉"}]',
 '["b"]', false, 2),

(2, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/1042.png',
 '이 아이템의 이름은?',
 '[{"id":"a","text":"단검"},{"id":"b","text":"체인 조끼"},{"id":"c","text":"활"},{"id":"d","text":"인내의 구슬"}]',
 '["a"]', false, 1);

-- Synergy questions (category_id = 3) - multi-answer examples
insert into public.quiz_questions (category_id, image_url, question_text, choices, correct_answers, is_multi_answer, difficulty) values

(3, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Jinx.png',
 '진크스가 가진 시너지를 모두 고르세요',
 '[{"id":"a","text":"언더시티"},{"id":"b","text":"사수"},{"id":"c","text":"마법공학"},{"id":"d","text":"방랑자"}]',
 '["a","b"]', true, 2),

(3, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Viktor.png',
 '빅토르가 가진 시너지를 모두 고르세요',
 '[{"id":"a","text":"마법공학"},{"id":"b","text":"진보"},{"id":"c","text":"언더시티"},{"id":"d","text":"케미컬"}]',
 '["a","b"]', true, 3),

(3, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Warwick.png',
 '워윅이 가진 시너지를 모두 고르세요',
 '[{"id":"a","text":"언더시티"},{"id":"b","text":"투사"},{"id":"c","text":"방랑자"},{"id":"d","text":"돌격대"}]',
 '["a","b"]', true, 2),

(3, 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Jayce.png',
 '제이스가 가진 시너지를 모두 고르세요',
 '[{"id":"a","text":"진보"},{"id":"b","text":"마법공학"},{"id":"c","text":"형태변환"},{"id":"d","text":"전사"}]',
 '["a","c"]', true, 3);

-- Augment questions (category_id = 4)
insert into public.quiz_questions (category_id, image_url, question_text, choices, correct_answers, is_multi_answer, difficulty) values

(4, 'https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/augments/silver/tft_augment_tacticiansresilienceii.png',
 '이 증강체의 이름은?',
 '[{"id":"a","text":"전술가의 회복력"},{"id":"b","text":"전술가의 방어"},{"id":"c","text":"경험치 증가"},{"id":"d","text":"골드 신탁"}]',
 '["a"]', false, 2),

(4, 'https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/augments/gold/tft_augment_goldengifts.png',
 '이 증강체의 이름은?',
 '[{"id":"a","text":"황금 선물"},{"id":"b","text":"황금 열쇠"},{"id":"c","text":"보물 창고"},{"id":"d","text":"금화 보너스"}]',
 '["a"]', false, 2);
