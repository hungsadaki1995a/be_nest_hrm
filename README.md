## Prerequisites

- Node.js >= 24.11.0 (required)
- pnpm >= 10
- Docker + Docker Compose

## Environment setup

Copy env example and update values:

```bash
cp .env.example .env
```

---

## Project setup (local development)

Docker Compose is used to start required services (e.g. database).

```bash
# Install dependencies
pnpm install

# Start database services
docker compose up -d

# Generate Prisma client
npx prisma generate

# Run migrations (local)
npx prisma migrate dev

# Seed database
npx prisma db seed
```

## Compile and run the project

```bash
# Local development (watch mode)
pnpm run start:dev

# Production
pnpm run build
pnpm run start:prod
```

## Run tests

```bash
# Unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Stop services

```bash
docker compose down
```
