create or replace function get_album(
    album_id int
)
    returns TABLE(id int, name text)
    language plpgsql
as $$
-- declare
--     new_album_id bigint;
--     total_cards int;
begin
    select * from
        select * from "pub"
end;
$$;
