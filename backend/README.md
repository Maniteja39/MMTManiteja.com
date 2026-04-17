# mmtmaniteja-api

Spring Boot 3 + Postgres backend powering the writings/blog CMS and custom analytics on [maniteja.com](https://maniteja.com).

## What's in here

- **Posts CMS** — markdown posts, slug-based permalinks, draft/published workflow.
- **JWT auth** — single admin user, `/api/auth/login` issues an HS256 token.
- **Pageview analytics** — public beacon in, admin-only summary out.
- **Flyway** migrations, **Hibernate/JPA** persistence, **Spring Security**.
- **Dockerized**, **Render**-ready via `render.yaml`.

## Local development

Prereqs: JDK 21, Docker, Maven (`./mvnw` not included — use system `mvn`).

```bash
# 1. Run Postgres
docker run --rm -d --name mmt-pg \
    -e POSTGRES_USER=mmtmaniteja \
    -e POSTGRES_PASSWORD=mmtmaniteja \
    -e POSTGRES_DB=mmtmaniteja \
    -p 5432:5432 postgres:16

# 2. Export required env vars
export JWT_SECRET="$(openssl rand -base64 48)"
export ADMIN_USERNAME=maniteja
export ADMIN_PASSWORD=change-me-locally

# 3. Run the app
mvn spring-boot:run
```

Hit it:

```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8080/api/posts

# Log in and grab a token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"username":"maniteja","password":"change-me-locally"}' | jq -r .token)

# Create a post
curl -X POST http://localhost:8080/api/posts \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -d '{
        "slug":"hello-world",
        "title":"Hello, world",
        "excerpt":"First post.",
        "contentMd":"# Hi\n\nThis is markdown.",
        "tags":"intro",
        "status":"PUBLISHED"
    }'
```

## API surface

| Method | Path                         | Auth  | Purpose                              |
| -----: | ---------------------------- | :---: | ------------------------------------ |
| POST   | `/api/auth/login`            | —     | Exchange username/password for JWT   |
| GET    | `/api/auth/me`               | JWT   | Probe current identity               |
| GET    | `/api/posts?page=&size=`     | —     | List published posts                 |
| GET    | `/api/posts/{slug}`          | —     | Fetch one published post             |
| GET    | `/api/posts/admin`           | ADMIN | List all posts incl. drafts          |
| POST   | `/api/posts`                 | ADMIN | Create                               |
| PUT    | `/api/posts/{id}`            | ADMIN | Update                               |
| DELETE | `/api/posts/{id}`            | ADMIN | Delete                               |
| POST   | `/api/analytics/pageview`    | —     | Beacon: record a pageview            |
| POST   | `/api/analytics/dwell`       | —     | Beacon: complete dwell on unload     |
| GET    | `/api/analytics/summary?days=30` | ADMIN | Aggregated dashboard summary     |

## Deploying to Render

This repo ships with a `render.yaml` blueprint. First deploy:

1. Push this repo (or fork) to GitHub.
2. Go to **render.com → New → Blueprint** and point it at the repo.
3. Render creates a Postgres DB + a web service.
4. In the dashboard, fill in the three `sync: false` env vars:
    - `JWT_SECRET` — `openssl rand -base64 48`
    - `ADMIN_USERNAME` — your chosen admin login
    - `ADMIN_PASSWORD` — a strong random password
5. First boot runs Flyway migrations, then seeds the admin from env.

Subsequent deploys happen automatically on every push to the default branch
(`autoDeploy: true`).

### Custom domain

Point `api.maniteja.com` at the Render service in Route 53:

```
api.maniteja.com  CNAME  <your-service>.onrender.com
```

Then in Render → Settings → Custom Domains, add `api.maniteja.com`. Render
provisions the TLS cert automatically.

## Env vars cheat sheet

| Var                    | Required | Notes                                                     |
| ---------------------- | :------: | --------------------------------------------------------- |
| `DATABASE_URL`         | yes      | Render injects this from the Postgres addon               |
| `JWT_SECRET`           | yes      | ≥ 32 bytes, base64; used to sign/verify HS256 tokens      |
| `JWT_EXPIRY_SECONDS`   | no       | Default 86400 (1 day)                                     |
| `ADMIN_USERNAME`       | yes\*    | Only required for first boot; seeds the admin user        |
| `ADMIN_PASSWORD`       | yes\*    | Only required for first boot; plaintext here, bcrypted to DB |
| `CORS_ALLOWED_ORIGINS` | no       | Comma-separated; defaults to maniteja.com + localhost     |

\* After the admin row exists, these can be cleared and the app still runs. To
rotate the admin password, either clear the env vars and update the DB directly,
or delete the row and provide fresh values.

## Next steps worth considering

- Add rate limiting (Bucket4j) to `/api/auth/login` and `/api/analytics/pageview`.
- Add a scheduled job to purge pageviews older than 90 days (`deleteOlderThan`).
- Add full-text search on `posts.title` + `posts.content_md` once you have volume.
- Move from HS256 to RS256 if you ever want to verify tokens from another service.
