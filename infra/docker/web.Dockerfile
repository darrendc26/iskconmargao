FROM node:20-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY apps/web/package.json apps/web/
COPY packages/types/package.json packages/types/
RUN npm ci --workspace=web --include-workspace-root || npm install --workspace=web --include-workspace-root

FROM node:20-alpine AS build
WORKDIR /repo
COPY --from=deps /repo ./
COPY package.json ./
COPY apps/web ./apps/web
COPY packages ./packages
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /repo/apps/web
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN mkdir -p apps/web/.next/cache && chown -R node:node /app
COPY --chown=node:node --from=build /repo/apps/web/.next/standalone ./
COPY --chown=node:node --from=build /repo/apps/web/.next/static ./apps/web/.next/static
COPY --chown=node:node --from=build /repo/apps/web/public ./apps/web/public
EXPOSE 3000
USER node
CMD ["node", "apps/web/server.js"]
