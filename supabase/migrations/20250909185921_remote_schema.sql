drop extension if exists "pg_net";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION extensions.grant_pg_cron_access()
 RETURNS event_trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION extensions.grant_pg_net_access()
 RETURNS event_trigger
 LANGUAGE plpgsql
AS $function$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_event_trigger_ddl_commands() AS ev
      JOIN pg_extension AS ext
      ON ev.objid = ext.oid
      WHERE ext.extname = 'pg_net'
    )
    THEN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_roles
        WHERE rolname = 'supabase_functions_admin'
      )
      THEN
        CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
      END IF;

      GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

      IF EXISTS (
        SELECT FROM pg_extension
        WHERE extname = 'pg_net'
        -- all versions in use on existing projects as of 2025-02-20
        -- version 0.12.0 onwards don't need these applied
        AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8.0', '0.10.0', '0.11.0')
      ) THEN
        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

        REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
        REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

        GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
        GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      END IF;
    END IF;
  END;
  $function$
;

drop policy "Enable insert for authenticated users only" on "public"."decks";

drop policy "Enable update for users based on email" on "public"."decks";

revoke delete on table "public"."card_collection" from "anon";

revoke insert on table "public"."card_collection" from "anon";

revoke references on table "public"."card_collection" from "anon";

revoke select on table "public"."card_collection" from "anon";

revoke trigger on table "public"."card_collection" from "anon";

revoke truncate on table "public"."card_collection" from "anon";

revoke update on table "public"."card_collection" from "anon";

revoke delete on table "public"."card_collection" from "authenticated";

revoke insert on table "public"."card_collection" from "authenticated";

revoke references on table "public"."card_collection" from "authenticated";

revoke select on table "public"."card_collection" from "authenticated";

revoke trigger on table "public"."card_collection" from "authenticated";

revoke truncate on table "public"."card_collection" from "authenticated";

revoke update on table "public"."card_collection" from "authenticated";

revoke delete on table "public"."card_collection" from "service_role";

revoke insert on table "public"."card_collection" from "service_role";

revoke references on table "public"."card_collection" from "service_role";

revoke select on table "public"."card_collection" from "service_role";

revoke trigger on table "public"."card_collection" from "service_role";

revoke truncate on table "public"."card_collection" from "service_role";

revoke update on table "public"."card_collection" from "service_role";

revoke delete on table "public"."cards" from "anon";

revoke insert on table "public"."cards" from "anon";

revoke references on table "public"."cards" from "anon";

revoke select on table "public"."cards" from "anon";

revoke trigger on table "public"."cards" from "anon";

revoke truncate on table "public"."cards" from "anon";

revoke update on table "public"."cards" from "anon";

revoke delete on table "public"."cards" from "authenticated";

revoke insert on table "public"."cards" from "authenticated";

revoke references on table "public"."cards" from "authenticated";

revoke select on table "public"."cards" from "authenticated";

revoke trigger on table "public"."cards" from "authenticated";

revoke truncate on table "public"."cards" from "authenticated";

revoke update on table "public"."cards" from "authenticated";

revoke delete on table "public"."cards" from "service_role";

revoke insert on table "public"."cards" from "service_role";

revoke references on table "public"."cards" from "service_role";

revoke select on table "public"."cards" from "service_role";

revoke trigger on table "public"."cards" from "service_role";

revoke truncate on table "public"."cards" from "service_role";

revoke update on table "public"."cards" from "service_role";

revoke delete on table "public"."collections_decks" from "anon";

revoke insert on table "public"."collections_decks" from "anon";

revoke references on table "public"."collections_decks" from "anon";

revoke select on table "public"."collections_decks" from "anon";

revoke trigger on table "public"."collections_decks" from "anon";

revoke truncate on table "public"."collections_decks" from "anon";

revoke update on table "public"."collections_decks" from "anon";

revoke delete on table "public"."collections_decks" from "authenticated";

revoke insert on table "public"."collections_decks" from "authenticated";

revoke references on table "public"."collections_decks" from "authenticated";

revoke select on table "public"."collections_decks" from "authenticated";

revoke trigger on table "public"."collections_decks" from "authenticated";

revoke truncate on table "public"."collections_decks" from "authenticated";

revoke update on table "public"."collections_decks" from "authenticated";

revoke delete on table "public"."collections_decks" from "service_role";

revoke insert on table "public"."collections_decks" from "service_role";

revoke references on table "public"."collections_decks" from "service_role";

revoke select on table "public"."collections_decks" from "service_role";

revoke trigger on table "public"."collections_decks" from "service_role";

revoke truncate on table "public"."collections_decks" from "service_role";

revoke update on table "public"."collections_decks" from "service_role";

revoke delete on table "public"."decks" from "anon";

revoke insert on table "public"."decks" from "anon";

revoke references on table "public"."decks" from "anon";

revoke select on table "public"."decks" from "anon";

revoke trigger on table "public"."decks" from "anon";

revoke truncate on table "public"."decks" from "anon";

revoke update on table "public"."decks" from "anon";

revoke delete on table "public"."decks" from "authenticated";

revoke insert on table "public"."decks" from "authenticated";

revoke references on table "public"."decks" from "authenticated";

revoke select on table "public"."decks" from "authenticated";

revoke trigger on table "public"."decks" from "authenticated";

revoke truncate on table "public"."decks" from "authenticated";

revoke update on table "public"."decks" from "authenticated";

revoke delete on table "public"."decks" from "service_role";

revoke insert on table "public"."decks" from "service_role";

revoke references on table "public"."decks" from "service_role";

revoke select on table "public"."decks" from "service_role";

revoke trigger on table "public"."decks" from "service_role";

revoke truncate on table "public"."decks" from "service_role";

revoke update on table "public"."decks" from "service_role";

alter table "public"."decks" drop constraint "decks_owner_fkey";

alter table "public"."card_collection" drop constraint "card_collection_collection_id_fkey";

drop view if exists "public"."deck_types";


  create table "public"."album_card" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp without time zone not null default now(),
    "owner" uuid not null,
    "quantity" integer not null default 0,
    "card" bigint not null,
    "tag" bigint
      );


alter table "public"."album_card" enable row level security;


  create table "public"."tags" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null,
    "owner" uuid not null
      );


alter table "public"."tags" enable row level security;


  create table "public"."users_likes" (
    "user_id" uuid not null,
    "deck_id" bigint not null
      );


alter table "public"."users_likes" enable row level security;

alter table "public"."cards" add column "clarifications" text;

alter table "public"."cards" add column "thumbnail" text not null default ''::text;

alter table "public"."cards" alter column "name" drop default;

alter table "public"."cards" alter column "name" set data type text using "name"::text;

alter table "public"."decks" drop column "isPublic";

alter table "public"."decks" add column "deck_face" bigint;

alter table "public"."decks" add column "is_public" boolean not null default false;

CREATE UNIQUE INDEX album_pkey ON public.album_card USING btree (id);

CREATE UNIQUE INDEX cards_name_key ON public.cards USING btree (name);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX users_likes_pkey ON public.users_likes USING btree (user_id, deck_id);

alter table "public"."album_card" add constraint "album_pkey" PRIMARY KEY using index "album_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."users_likes" add constraint "users_likes_pkey" PRIMARY KEY using index "users_likes_pkey";

alter table "public"."album_card" add constraint "album_card_fkey" FOREIGN KEY (card) REFERENCES cards(id) not valid;

alter table "public"."album_card" validate constraint "album_card_fkey";

alter table "public"."album_card" add constraint "album_card_tag_fkey" FOREIGN KEY (tag) REFERENCES tags(id) not valid;

alter table "public"."album_card" validate constraint "album_card_tag_fkey";

alter table "public"."album_card" add constraint "album_owner_fkey" FOREIGN KEY (owner) REFERENCES auth.users(id) not valid;

alter table "public"."album_card" validate constraint "album_owner_fkey";

alter table "public"."cards" add constraint "cards_name_key" UNIQUE using index "cards_name_key";

alter table "public"."collections_decks" add constraint "collections_decks_deck_id_fkey" FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE not valid;

alter table "public"."collections_decks" validate constraint "collections_decks_deck_id_fkey";

alter table "public"."decks" add constraint "decks_deck_face_fkey" FOREIGN KEY (deck_face) REFERENCES cards(id) not valid;

alter table "public"."decks" validate constraint "decks_deck_face_fkey";

alter table "public"."tags" add constraint "tags_owner_id_fkey" FOREIGN KEY (owner) REFERENCES auth.users(id) not valid;

alter table "public"."tags" validate constraint "tags_owner_id_fkey";

alter table "public"."users_likes" add constraint "users_likes_deck_id_fkey" FOREIGN KEY (deck_id) REFERENCES decks(id) not valid;

alter table "public"."users_likes" validate constraint "users_likes_deck_id_fkey";

alter table "public"."users_likes" add constraint "users_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."users_likes" validate constraint "users_likes_user_id_fkey";

alter table "public"."card_collection" add constraint "card_collection_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES collections_decks(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."card_collection" validate constraint "card_collection_collection_id_fkey";

set check_function_bodies = off;

create or replace view "public"."card_rarity" as  SELECT DISTINCT c.rarity AS name
   FROM cards c;


create or replace view "public"."card_sets" as  SELECT DISTINCT c.set AS name
   FROM cards c;


create or replace view "public"."card_subtypes" as  SELECT DISTINCT c.subtype AS name
   FROM cards c
  WHERE (((c.subtype)::text <> '-'::text) AND ((c.subtype)::text <> ''::text));


create or replace view "public"."card_supertypes" as  SELECT DISTINCT cards.supertype AS name
   FROM cards
  WHERE ((cards.supertype IS NOT NULL) AND (TRIM(BOTH FROM cards.supertype) <> '-'::text) AND (TRIM(BOTH FROM cards.supertype) <> ''::text));


create or replace view "public"."card_types" as  SELECT DISTINCT c.type AS name
   FROM cards c;


CREATE OR REPLACE FUNCTION public.delete_collection_on_update_decks()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    DELETE FROM collections_decks WHERE deck_id = OLD.id;
    RETURN NEW;
END;$function$
;

create or replace view "public"."dominion" as  SELECT c.name
   FROM card_sets c
  WHERE ((c.name)::text = ANY ((ARRAY['TRONO COMPARTIDO'::character varying, 'IMPERIO'::character varying, 'PACTO SECRETO'::character varying])::text[]));


create or replace view "public"."unit_types" as  SELECT DISTINCT c.subtype AS name
   FROM cards c
  WHERE ((c.type)::text = 'UNIDAD'::text);



  create policy "Enable delete for users based on user_id"
  on "public"."decks"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = owner));



  create policy "Enable read access for all users"
  on "public"."decks"
  as permissive
  for select
  to authenticated, anon
using ((true = is_public));



  create policy "Enable insert for authenticated users only"
  on "public"."decks"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable update for users based on email"
  on "public"."decks"
  as permissive
  for update
  to authenticated, anon
using ((auth.uid() = owner))
with check ((auth.uid() = owner));


CREATE TRIGGER trigger_delete_collection_on_update_decks BEFORE UPDATE ON public.decks FOR EACH ROW EXECUTE FUNCTION delete_collection_on_update_decks();


