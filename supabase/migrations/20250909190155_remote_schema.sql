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

revoke delete on table "public"."album_card" from "anon";

revoke insert on table "public"."album_card" from "anon";

revoke references on table "public"."album_card" from "anon";

revoke select on table "public"."album_card" from "anon";

revoke trigger on table "public"."album_card" from "anon";

revoke truncate on table "public"."album_card" from "anon";

revoke update on table "public"."album_card" from "anon";

revoke delete on table "public"."album_card" from "authenticated";

revoke insert on table "public"."album_card" from "authenticated";

revoke references on table "public"."album_card" from "authenticated";

revoke select on table "public"."album_card" from "authenticated";

revoke trigger on table "public"."album_card" from "authenticated";

revoke truncate on table "public"."album_card" from "authenticated";

revoke update on table "public"."album_card" from "authenticated";

revoke delete on table "public"."album_card" from "service_role";

revoke insert on table "public"."album_card" from "service_role";

revoke references on table "public"."album_card" from "service_role";

revoke select on table "public"."album_card" from "service_role";

revoke trigger on table "public"."album_card" from "service_role";

revoke truncate on table "public"."album_card" from "service_role";

revoke update on table "public"."album_card" from "service_role";

revoke delete on table "public"."tags" from "anon";

revoke insert on table "public"."tags" from "anon";

revoke references on table "public"."tags" from "anon";

revoke select on table "public"."tags" from "anon";

revoke trigger on table "public"."tags" from "anon";

revoke truncate on table "public"."tags" from "anon";

revoke update on table "public"."tags" from "anon";

revoke delete on table "public"."tags" from "authenticated";

revoke insert on table "public"."tags" from "authenticated";

revoke references on table "public"."tags" from "authenticated";

revoke select on table "public"."tags" from "authenticated";

revoke trigger on table "public"."tags" from "authenticated";

revoke truncate on table "public"."tags" from "authenticated";

revoke update on table "public"."tags" from "authenticated";

revoke delete on table "public"."tags" from "service_role";

revoke insert on table "public"."tags" from "service_role";

revoke references on table "public"."tags" from "service_role";

revoke select on table "public"."tags" from "service_role";

revoke trigger on table "public"."tags" from "service_role";

revoke truncate on table "public"."tags" from "service_role";

revoke update on table "public"."tags" from "service_role";

revoke delete on table "public"."users_likes" from "anon";

revoke insert on table "public"."users_likes" from "anon";

revoke references on table "public"."users_likes" from "anon";

revoke select on table "public"."users_likes" from "anon";

revoke trigger on table "public"."users_likes" from "anon";

revoke truncate on table "public"."users_likes" from "anon";

revoke update on table "public"."users_likes" from "anon";

revoke delete on table "public"."users_likes" from "authenticated";

revoke insert on table "public"."users_likes" from "authenticated";

revoke references on table "public"."users_likes" from "authenticated";

revoke select on table "public"."users_likes" from "authenticated";

revoke trigger on table "public"."users_likes" from "authenticated";

revoke truncate on table "public"."users_likes" from "authenticated";

revoke update on table "public"."users_likes" from "authenticated";

revoke delete on table "public"."users_likes" from "service_role";

revoke insert on table "public"."users_likes" from "service_role";

revoke references on table "public"."users_likes" from "service_role";

revoke select on table "public"."users_likes" from "service_role";

revoke trigger on table "public"."users_likes" from "service_role";

revoke truncate on table "public"."users_likes" from "service_role";

revoke update on table "public"."users_likes" from "service_role";

drop view if exists "public"."card_rarity";

drop view if exists "public"."card_subtypes";

drop view if exists "public"."card_supertypes";

drop view if exists "public"."card_types";

drop view if exists "public"."dominion";

drop view if exists "public"."unit_types";

drop view if exists "public"."card_sets";

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



