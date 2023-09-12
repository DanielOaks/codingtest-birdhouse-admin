FROM node:20.5.0-alpine

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

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "yarn", "start" ]
