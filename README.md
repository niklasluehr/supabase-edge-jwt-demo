# Supabase Edge Function JWT Demo

Demo Repo

Ziel:

> Eine Supabase-Edge-Function in TypeScript, die ein kurzlebiges HS256-JWT verifiziert, eine Beispiel-Session in eine Tabelle schreibt und per Row-Level-Security ausschließlich für auth.uid() sichtbar macht

## Supabase Setup

### Sessions Tabelle erstellen und RLS Policies einrichten

Im Supabase SQL Editor den code in `create_game_sessions_table.sql` ausführen.

### Edge Function

Der Code der Edge Function befindet sich in `supabase/functions/verify-and-save-session/index.ts`

Edge Function deployen:

```bash
npx supabase functions deploy verify-and-save-session
```

Secrets hochladen (JWT Secret):

```bash
npx supabase secrets set --env-file supabase/functions/verify-and-save-session/.env
```

### Testen

Dazu brauchen wir:

- `<project-id>` Supabase Projekt URL
- `<bearer-token>` Siehe Supabase Dashboard > Edge Functions > verify-and-save-session > Details > Invoke Function (cURL)
- `<jwt-token>` Einen JWT Token, der mit dem Secret signiert wurde und als sub die Supabase User Id enthält

```bash
curl -X POST https://<project-id>.supabase.co/functions/v1/verify-and-save-session \
  -H 'Authorization: Bearer <bearer-token>' \
  -H 'Content-Type: application/json' \
  -d '{"token": "<jwt_token>", "topic": "Example Topic"}'
```

## RLS Funktionsweise

Beim Erstellen der Session wird als user_id die User ID aus dem JWT Token gesetzt. Außerdem ist auf der game_sessions Tabelle RLS aktiv, sodass nur der User selbst seine Rows lesen kann.
