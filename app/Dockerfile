FROM node:22-alpine

WORKDIR /app

# Update npm so transitive npm deps like cross-spawn/glob/tar are pulled at patched versions
RUN npm install -g npm@latest

# Copy app code (no dependencies needed for this simple HTTP server)
COPY server.js ./server.js
COPY package.json ./package.json

EXPOSE 3000
CMD ["node", "server.js"]
