# multistage docker, to reduce the final image size

## build image
#
FROM node:20.5.0-alpine as build

# destination dir
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# install dependencies
RUN apk update && apk upgrade
# RUN apk add git

# copy the app over
COPY . /usr/src/nuxt-app/
RUN yarn install
RUN yarn build

## main image
#
FROM node:20.5.0-alpine as main

LABEL maintainer="Daniel Oaks <daniel@danieloaks.net>" \
  description="This is an admin dashboard for the Smart BirdHouse API"

RUN mkdir -p /usr/src
COPY --from=build /usr/src/nuxt-app /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "yarn", "start" ]
