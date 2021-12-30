FROM node:alpine AS builder
WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn
COPY tsconfig.json .
COPY ./src /app/src
RUN yarn run tsc

FROM node:alpine
# ARG NODE_ENV=production
# ENV NODE_ENV=production
WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn --production
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "./dist/index.js"]
