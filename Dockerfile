#
# App Builder
#

FROM node:10.11 AS app
WORKDIR /directus

# Only copy package.json so we can cache dependencies and avoid
# reinstalling them everytime we change a file
COPY package.json /directus
RUN npm install

# Copy all the files to the target directory and build the project
COPY ./src/ /directus/src/
COPY ./public/ /directus/public/
COPY vue.config.js /directus/vue.config.js

RUN npm run build

#
# Nginx
#

FROM nginx:stable-alpine

# Default variables
ENV ALLOW_OTHER_API "false"
ENV ROUTER_MODE "hash"
ENV ROUTER_BASE_URL "/"

# Copy dist contents to the root folder
COPY --from=app /directus/dist/ /usr/share/nginx/html/

# Move the example configuration file into a backup folder
RUN mkdir /directus && \
    mv /usr/share/nginx/html/config_example.js /directus/config.js

# Copy entrypoint
COPY entrypoint.sh /root/entrypoint.sh
RUN chmod +x /root/entrypoint.sh

ENTRYPOINT ["/root/entrypoint.sh"]
