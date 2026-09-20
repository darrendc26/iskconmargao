FROM node:20-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY apps/admin/package.json apps/admin/
COPY packages/types/package.json packages/types/
RUN npm ci --workspace=admin --include-workspace-root || npm install --workspace=admin --include-workspace-root

FROM node:20-alpine AS build
WORKDIR /repo
COPY --from=deps /repo ./
COPY package.json ./
COPY apps/admin ./apps/admin
COPY packages ./packages
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /repo/apps/admin
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
COPY --from=build /repo/apps/admin/.next/standalone ./
COPY --from=build /repo/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=build /repo/apps/admin/public ./apps/admin/public
EXPOSE 3001
USER node
CMD ["node", "apps/admin/server.js"]

