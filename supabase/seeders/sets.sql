insert into public.card_sets (name, created_at)
values ('FUNDAMENTOS', now())
on conflict (name)
    do update set name = 'FUNDAMENTOS', created_at = now();

insert into public.card_sets (name, created_at)
values ('PACTO SECRETO', now()+1)
on conflict (name)
    do update set name = 'PACTO SECRETO', created_at = now() + 1;

insert into public.card_sets (name, created_at)
values ('TRONO COMPARTIDO', now()+2)
on conflict (name)
    do update set name = 'TRONO COMPARTIDO', created_at = now() + 2;

insert into public.card_sets (name, created_at)
values ('IMPERIO', now()+3)
on conflict (name)
    do update set name = 'IMPERIO', created_at = now() + 3;

insert into public.card_sets (name, created_at)
values ('ANCESTROS', now()+4)
on conflict (name)
    do update set name = 'ANCESTROS', created_at = now() + 4;

insert into public.card_sets (name, created_at)
values ('PROFUNDIDADES', now()+5)
on conflict (name)
    do update set name = 'PROFUNDIDADES', created_at = now() + 5;

insert into public.card_sets (name, created_at)
values ('HERMANDAD EN BERIN', now()+6)
on conflict (name)
    do update set name = 'HERMANDAD EN BERIN', created_at = now() + 6;

insert into public.card_sets (name, created_at)
values ('CATACLISMO', now()+7)
on conflict (name)
    do update set name = 'CATACLISMO', created_at = now() + 7;
