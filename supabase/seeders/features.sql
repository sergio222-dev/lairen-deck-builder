insert into public.feature_flags (name, enabled)
values ('MAINTENANCE', false)
on conflict (name)
    do update set enabled = excluded.enabled;
