-- ============================================================
-- 🔐 GLOBAL PERMISSIONS FOR SUPABASE ROLES
-- Grants basic read access to all tables for anon + authenticated
-- and write access only for authenticated users.
-- ============================================================

-- 1️⃣ Asegurarse de que ambos roles puedan usar el esquema
grant usage on schema public to authenticated, anon;

-- 2️⃣ Dar permisos de lectura (SELECT) a todos los roles
grant select on all tables in schema public to authenticated, anon;

-- 3️⃣ Dar permisos de escritura (INSERT, UPDATE, DELETE) solo a usuarios autenticados
grant insert, update, delete on all tables in schema public to authenticated;

-- 4️⃣ Dar permisos de lectura a todas las secuencias (necesario para inserts con SERIAL/IDENTITY)
grant usage, select on all sequences in schema public to authenticated, anon;

-- 5️⃣ Dar permisos de escritura sobre secuencias solo a autenticados (si usan inserts manuales)
grant update on all sequences in schema public to authenticated;

-- 6️⃣ Dar permisos de ejecución sobre todas las funciones (RPC)
grant execute on all functions in schema public to authenticated, anon;

-- 7️⃣ Asegurarse de que futuros objetos también reciban estos permisos automáticamente
alter default privileges in schema public
  grant select on tables to authenticated, anon;

alter default privileges in schema public
  grant insert, update, delete on tables to authenticated;

alter default privileges in schema public
  grant usage, select on sequences to authenticated, anon;

alter default privileges in schema public
  grant execute on functions to authenticated, anon;
