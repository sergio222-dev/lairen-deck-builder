create schema "vv";

create or replace view "vv".card_rarity as
select
    md5(c.rarity)::uuid as id,
    c.rarity as name
from "public".cards c
group by c.rarity;
