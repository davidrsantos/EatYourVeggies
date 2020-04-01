FROM node:lts-alpine

# install simple http server for serving static content
# set working directory
WORKDIR /project/eyv

# add `/app/node_modules/.bin` to $PATH

# install and cache app dependencies
COPY eyv_app_vue/package.json eyv_app_vue/package.json

RUN npm install @vue/cli -g
RUN npm install

# start app
CMD ["npm", "run", "serve"]