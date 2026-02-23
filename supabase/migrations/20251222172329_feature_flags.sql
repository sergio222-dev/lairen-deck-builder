create table if not exists "public"."feature_flags" (
    "name" text primary key,
    "enabled" boolean not null
);
