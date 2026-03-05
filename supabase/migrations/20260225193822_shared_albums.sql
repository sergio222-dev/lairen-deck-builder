create or replace function initialize_album_cards(
    p_album_id bigint
)
    returns void
    language plpgsql
as
$$
begin
    insert into album_cards(card_id, album_id, tag_id, quantity)
    select c.id, a.id, t.id, 0
    from albums a
             join album_tags t on t.album_id = a.id
             join cards c on c.set = any (a.sets)
    where a.id = p_album_id;
end;
$$;

create or replace function get_albums_cards(
    p_album_id bigint,
    p_cursor text default null,
    p_query text default null,
    p_limit int default 20
)
    returns jsonb
    language plpgsql
as
$$
declare
    v_album_cards jsonb;
--     v_album       jsonb;
--     v_next_cursor text;
begin
    -- Cards selection
    select jsonb_build_object(
                   'album_cards', jsonb_agg(
                    jsonb_build_object(
                            'id', s.card_id,
                            'name', s.name,
                            'image', s.image,
                            'tags', s.tags
                    )),
                   'cursor', max(s.name)
           )
    into v_album_cards
    from (select ac.card_id,
                 c.name,
                 c.image,
                 jsonb_agg(
                         jsonb_build_object(
                                 'id', at.id,
                                 'name', at.name,
                                 'quantity', ac.quantity
                         )
                 ) as tags
          from album_cards ac
                   join cards c on c.id = ac.card_id
                   join album_tags at on at.id = ac.tag_id
          where ac.album_id = p_album_id
            and (p_query is null or c.name ilike '%' || p_query || '%')
            and (p_cursor is null or c.name > p_cursor)
          group by ac.card_id, c.name, c.image
          order by c.name
          limit p_limit) s;
    return v_album_cards;
end
$$;

create or replace view user_card_tag_by_album as
select
    at.name,
    at.id,
    a.owner,
    a.id as album_id,
    sum(ac.quantity) as total
from albums a
         join album_tags at on at.album_id = a.id
         join album_cards ac on ac.album_id = a.id and at.id = ac.tag_id
group by at.id, at.name, a.owner, a.id;

select
    *
from user_card_tag_by_album where album_id = 5;


select *
from get_albums_cards(5)
