FROM node:16-alpine as base
WORKDIR /app
COPY package.json package-lock.json .

# Test
FROM base as test
RUN npm ci
COPY . .
RUN npm test

# Build
FROM base as prod
RUN npm ci --production
COPY . .
CMD ["node", "index.js"]