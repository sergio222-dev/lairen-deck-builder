create or replace procedure auth.login_as_user(user_email text)
    language plpgsql
    as $$
declare
    auth_user auth.users;
begin
    select
        * into auth_user
    from
        auth.users
    where
        email = user_email;
    raise notice '%', format('Set Sub %I', request);
--    execute format('set request.jwt.claim.sub=%L', (auth_user).id::text);
--    execute format('set request.jwt.claim.role=%I', (auth_user).role);
--   execute format('set request.jwt.claim.email=%L', (auth_user).email);
--    raise notice '%', format( 'set role %I; -- logging in as %L (%L)', (auth_user).role, (auth_user).id, (auth_user).email);
--    execute format('set role %I', (auth_user).role);
end;
$$;

create or replace procedure auth.logout()
    language plpgsql
    as $$
begin
    set request.jwt.claim.sub='';
    set request.jwt.claim.role='';
    set request.jwt.claim.email='';
    set request.jwt.claims='';
    set role postgres;
end;
$$;

begin;

call auth.login_as_user('molinasergio91@gmail.com');

select plan(1);

SELECT isnt_empty('SELECT * from decks', 'is not empty');

select * from finish();

rollback;
