# Natlaupa public website (Next.js 16) — production build, served by `next start`.
# Debian slim (not alpine) avoids tailwind-v4 / lightningcss musl native-binary issues.
FROM node:20-slim

WORKDIR /app

# NEXT_PUBLIC_* are inlined at build time. The API URL is host.docker.internal so the
# SAME baked value works from the host browser AND in-container server route handlers.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
# NOTE: do NOT set NODE_ENV=production before `npm ci` — that omits the
# devDependencies (typescript, tailwind, @types) that `next build` requires.
# Runtime NODE_ENV=production is supplied by compose; `next start` forces prod anyway.
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=$NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN \
    NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "require('http').get('http://localhost:3000/',r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
