# Miss Noor — AI School Companion
#
# One image that builds the client and runs the Express server that serves it.
# The app's AI routes need server.ts, so a static host is not enough.
#
# Runs on Hugging Face Docker Spaces (default) and anywhere else. The server
# binds 0.0.0.0 and reads PORT, so `docker run -e PORT=3000` overrides the
# Space default of 7860 without a rebuild.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Hugging Face Spaces routes traffic to app_port; the README frontmatter and
# this default must agree. Override with -e PORT=... for any other host.
ENV PORT=7860
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server.ts tsconfig.json ./
COPY src ./src
# tsx runs server.ts directly; it is a runtime dependency of `npm start`.
RUN npm install --no-save --legacy-peer-deps --include=dev tsx@^4.21.0 && npm cache clean --force

# Spaces requires a non-root process, and recommends UID 1000. node:22-alpine
# already ships a `node` user at exactly UID 1000, so no useradd is needed.
RUN chown -R node:node /app
USER node

EXPOSE 7860
CMD ["npm", "start"]
