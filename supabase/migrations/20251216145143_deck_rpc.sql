create or replace function deck_save(
    deck_data jsonb
)
    returns bigint
    language plpgsql
as
$$
declare
v_deck_id       bigint;
begin

    if (deck_data ? 'id') then
update "public"."decks"
set
    name        = deck_data->>'name',
    description = deck_data->>'description',
    is_public   = (deck_data->>'is_public')::boolean,
    deck_face   = nullif(deck_data->>'deck_face', '')::bigint,
    type_1      = deck_data->>'type_1',
    type_2      = deck_data->>'type_2'
where id = (deck_data->>'id')::bigint
    returning id into v_deck_id;
end if;

    if v_deck_id is null then
        insert into "public"."decks" (name, description, owner, deck_face, type_1, type_2, guardian)
        values (deck_data->>'name', deck_data->>'description', auth.uid(), nullif(deck_data->>'deck_face', '')::bigint, deck_data->>'type_1', deck_data->>'type_2', deck_data->>'guardian')
        returning id into v_deck_id;
end if;

delete
from "public"."deck_card"
where deck = v_deck_id;

if deck_data ? 'cards' and jsonb_typeof(deck_data->'cards') = 'array'
    then
        insert into "public"."deck_card" (deck, card, quantity, quantity_side)
select v_deck_id, (c->>'id')::bigint, coalesce((c->>'quantity')::int, 0), coalesce((c->>'quantity_side')::int, 0)
from jsonb_array_elements(deck_data->'cards') as c;
end if;

return v_deck_id;
end;
$$;
