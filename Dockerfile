# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --production


# ---- Build ----
FROM base AS build
RUN npm config set registry https://registry.npmjs.org/
RUN npm install
COPY . .
RUN npm run build

# ---- Release ----
FROM base AS release
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/index.js"]
