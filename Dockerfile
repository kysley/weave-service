FROM mhart/apline-node:latest
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY ./build /build
COPY ./package.json /package.json
COPY ./yarn.lock /yarn.lock

RUN NODE_ENV=$NODE_ENV yarn
CMD ["node",  "build/server.js"]
