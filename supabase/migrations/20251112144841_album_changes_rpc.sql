create type album_changes_input as
(
    album_id bigint,
    card_id  bigint,
    tag_id   bigint,
    amount   int
);

create or replace function album_update_changes(changes album_changes_input[])
    returns void
    language plpgsql
as
$$
declare
    c             album_changes_input;
    card_id_table bigint;
begin
    foreach c in array changes
        loop

            select id
            into card_id_table
            from "public"."album_cards" t
            where t.card_id = c.card_id AND t.album_id = c.album_id;

            update "public"."album_card_tags" t
            set quantity = c.amount
            where t.tag_id = c.tag_id
              AND t.album_card_id = card_id_table;
        end loop;
end;
$$;
