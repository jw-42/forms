FROM nginx:alpine

# Копируем конфигурацию
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем скрипт настройки SSL
COPY nginx-ssl-setup.sh /usr/local/bin/nginx-ssl-setup.sh
RUN chmod +x /usr/local/bin/nginx-ssl-setup.sh

# Создаем пустой SSL-конфиг (будет перезаписан скриптом)
RUN touch /etc/nginx/ssl.conf

# Создаем entrypoint скрипт
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'if [ -f "/usr/local/bin/nginx-ssl-setup.sh" ]; then' >> /docker-entrypoint.sh && \
    echo '  /usr/local/bin/nginx-ssl-setup.sh' >> /docker-entrypoint.sh && \
    echo 'else' >> /docker-entrypoint.sh && \
    echo '  echo "SSL setup script not found, continuing without SSL..."' >> /docker-entrypoint.sh && \
    echo 'fi' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint.sh"] 