FROM oven/bun:1 as base

WORKDIR /app

FROM base as install
COPY package.json bun.lock ./
RUN apt-get update -y && apt-get install -y openssl
RUN bun install --frozen-lockfile

COPY . .
RUN mkdir -p /app/node_modules/prisma && chown -R bun:bun /app/node_modules
RUN mkdir -p /app/generated && chown -R bun:bun /app/generated

EXPOSE 8000

USER bun
CMD ["sh", "-c", "bunx prisma migrate deploy && bunx prisma generate && sleep 2 && bun run src/app.ts"]