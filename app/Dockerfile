FROM node:22-alpine

WORKDIR /app

# Keep npm up to date, then force tar to the patched version
RUN npm install -g npm@latest \
 && npm install -g tar@7.5.3 \
 && npm cache clean --force

COPY server.js ./server.js
COPY package.json ./package.json

EXPOSE 3000
CMD ["node", "server.js"]
