drop view if exists "public"."dominion";
drop view if exists "public"."card_sets";

create table if not exists "public"."card_sets"
(
    "name"       text                                                          not null primary key,
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null
);


create or replace view "public"."dominion" as
select cs.name from "public"."card_sets" cs
order by cs.created_at DESC
limit 5;
