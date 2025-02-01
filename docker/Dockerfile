# Nginx
FROM nginx:stable-alpine3.20-slim

# Install jq in the Nginx image
RUN apk add --no-cache jq

WORKDIR /etc/nginx

COPY ./resources /usr/share/nginx/html/resources
COPY ./index.html /usr/share/nginx/html/index.html

# Copy custom nginx config for SSL
COPY ./docker/*.conf ./config_templates/
ENV NGINX_CONFIG_TEMPLATES_ROOT_PATH=/etc/nginx/config_templates
ENV NGINX_CONFIG_TLS_PATH=$NGINX_CONFIG_TEMPLATES_ROOT_PATH/nginx-tls.conf
ENV NGINX_CONFIG_PLAINTEXT_PATH=$NGINX_CONFIG_TEMPLATES_ROOT_PATH/nginx-plaintext.conf
ENV IS_TLS_ENABLED=false
ENV CONTEXT_PATH=notes-app

# Remove nginx default config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy generic SSL certificates
COPY ./docker/certs/generic ./certs

COPY ./docker/docker-entrypoint.sh ./docker-entrypoint.sh 

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 8443
EXPOSE 8080

# Start nginx
CMD ["./docker-entrypoint.sh"]