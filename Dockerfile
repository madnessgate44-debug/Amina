# Amina — AI School Companion
# One image that builds the client and runs the Express server that serves it.
# The app's AI routes need server.ts, so a static host is not enough.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server.ts tsconfig.json ./
COPY src ./src
# tsx runs server.ts directly; it is a runtime dependency of `npm start`.
RUN npm install --no-save tsx@^4.21.0 && npm cache clean --force
EXPOSE 3000
CMD ["npm", "start"]
