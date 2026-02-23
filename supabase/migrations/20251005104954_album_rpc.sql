create or replace function album_create(
    album_name text,
    album_sets text[],
    album_tags text[]
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
    values (album_name, album_sets, auth.uid(), total_cards, 0)
    returning id into new_album_id;

    if array_length(album_tags, 1) is not null then
        insert into "public"."album_tags" (name, album_id)
        select unnest(album_tags), new_album_id;
    end if;

    return new_album_id;
end;
$$;

create or replace function album_attach_card (
    album_id bigint,
    card_id bigint
)
    returns bigint
    language plpgsql
as $$
declare
    new_album_card_id bigint;
    album_card_id bigint;
    tag_record record;
begin
    for tag_record in
        select id from "public"."album_tags" t
        where t.album_id = album_id
    loop
        insert into "public"."album_cards" (album_id, tag_id, card_id, quantity)
        values (album_id, tag_record.id, card_id, 0)
        on conflict (card_id, tag_id, album_id) do nothing;
    end loop;

    return new_album_card_id;
end;


$$;

create or replace function album_update_quantity(
    album_changes jsonb
)
    returns void
    language plpgsql
as
$$
declare
    item       jsonb;
    v_card_id  bigint;
    v_tag_id   bigint;
    v_album_id bigint;
    amount     int;
    prev_total int;
    new_total  int;
begin
    for item in
        select * from jsonb_array_elements(album_changes)
        loop
            v_album_id := (item ->> 'album_id')::bigint;
            v_card_id := (item ->> 'card_id')::bigint;
            v_tag_id := (item ->> 'tag_id')::bigint;
            amount := (item ->> 'amount')::bigint;

            select coalesce(sum(quantity), 0)
            into prev_total
            from "public"."album_cards"
            where album_id = v_album_id
              and card_id = v_card_id;

            insert into public.album_cards (album_id, card_id, tag_id, quantity)
            values (v_album_id, v_card_id, v_tag_id, amount)
            on conflict (card_id, tag_id, album_id)
                do update
                set quantity = album_cards.quantity + excluded.quantity;

            select coalesce(sum(quantity), 0)
            into new_total
            from "public".album_cards
            where album_id = v_album_id
              and card_id = v_card_id;

            if prev_total = 0 and new_total > 0 then
                update public.albums
                set current = current + 1
                where id = v_album_id;
            end if;

            if prev_total > 0 and new_total = 0 then
                update public.albums
                set current = current - 1
                where id = v_album_id;
            end if;
        end loop;
end;
$$;
