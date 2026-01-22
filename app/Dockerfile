# ---------- builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Install deps (use lockfile for reproducible builds)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy app code
COPY server.js ./server.js


# ---------- runtime ----------
FROM node:22-alpine
WORKDIR /app

# Copy only what we need to run
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Optional hardening: remove npm/npx/corepack/tar so Trivy doesn't flag vulnerable copies
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/bin/corepack \
           /usr/local/lib/node_modules/tar \
           /usr/local/bin/tar || true

EXPOSE 3000
CMD ["node", "server.js"]

