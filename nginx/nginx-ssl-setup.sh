#!/bin/sh

# Скрипт для автоматической настройки SSL в nginx
# Проверяет наличие сертификатов и создает соответствующую конфигурацию

SSL_CERT_PATH="/etc/letsencrypt/live/bugs-everywhere.ru/fullchain.pem"
SSL_KEY_PATH="/etc/letsencrypt/live/bugs-everywhere.ru/privkey.pem"
SSL_CONF_PATH="/etc/nginx/ssl.conf"

echo "Проверка SSL-сертификатов..."

# Проверяем наличие сертификатов
if [ -f "$SSL_CERT_PATH" ] && [ -f "$SSL_KEY_PATH" ]; then
    echo "SSL-сертификаты найдены. Создаю SSL-конфигурацию..."
    
    cat > "$SSL_CONF_PATH" << EOF
# HTTPS сервер (создается автоматически при наличии сертификатов)
server {
    listen 443 ssl;
    server_name bugs-everywhere.ru;
    
    ssl_certificate $SSL_CERT_PATH;
    ssl_certificate_key $SSL_KEY_PATH;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    client_body_buffer_size 128k;
    proxy_max_temp_file_size 128m;

    location / {
        # Проксируем на frontend (если запущен локально)
        # В Linux используем host network или специальный IP
        proxy_pass http://172.17.0.1:3000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header User-Agent \$http_user_agent;
    }

    location /api/ {
        # Проксируем на backend контейнер
        proxy_pass http://backend:8000/;
        default_type application/json;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header User-Agent \$http_user_agent;
    }

    location = /user-agreement {
        alias /srv/legal-docs/user-agreement.txt;
        add_header Content-Type text/plain;
    }
    location = /privacy-policy {
        alias /srv/legal-docs/privacy-policy.txt;
        add_header Content-Type text/plain;
    }
    location = /data-processing-agreement {
        alias /srv/legal-docs/data-processing-agreement.txt;
        add_header Content-Type text/plain;
    }
    location = /typical-data-proccessing-agreement {
        alias /srv/legal-docs/typical-data-proccessing-agreement.txt;
        add_header Content-Type text/plain;
    }
}
EOF
    
    echo "SSL-конфигурация создана: $SSL_CONF_PATH"
    echo "Перезапуск nginx..."
    nginx -s reload
else
    echo "SSL-сертификаты не найдены. Удаляю SSL-конфигурацию..."
    rm -f "$SSL_CONF_PATH"
    echo "Перезапуск nginx..."
    nginx -s reload
fi

echo "Настройка завершена." 