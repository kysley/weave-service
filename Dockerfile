FROM node:alpine
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY ./build /build
COPY ./package.json /package.json
COPY ./yarn.lock /yarn.lock

RUN NODE_ENV=$NODE_ENV yarn
EXPOSE 3001
CMD ["node",  "build/server.js"]
