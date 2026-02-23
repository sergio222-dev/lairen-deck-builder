alter table if exists "public"."decks"
    add column if not exists "deck_face" bigint references "public"."cards"("id") on delete cascade;
