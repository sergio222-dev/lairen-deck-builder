create or replace function create_album(
    album_name text,
    album_sets text[],
    album_tags text[],
    album_owner uuid
)
    returns int
    language plpgsql
as $$
declare
    new_album_id bigint;
    total_cards int;
begin
    -- calculate total
    select count(*) into total_cards from "public"."cards"
    where "set" = ANY (album_sets);

    insert into "public"."albums" (name, sets, owner, total, current)
    values (album_name, album_sets, album_owner, total_cards, 0)
    returning id into new_album_id;

    if array_length(album_tags, 1) is not null then
        insert into "public"."album_tag" (name, album_id)
        select unnest(album_tags), new_album_id;
    end if;

    return new_album_id;
end;
$$;
