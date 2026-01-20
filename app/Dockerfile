FROM node:22-alpine

WORKDIR /app

# Copy only what we need to run
COPY server.js ./server.js
COPY package.json ./package.json

# This app does NOT need npm at runtime.
# Remove npm/npx/corepack and any global tar folders so Trivy doesn't find the vulnerable tar copy.
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/bin/corepack \
           /usr/local/lib/node_modules/tar \
           /usr/local/bin/tar || true

EXPOSE 3000
CMD ["node", "server.js"]
