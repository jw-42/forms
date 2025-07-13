# Production Deployment (System NGINX + Docker)

## 1. Установите NGINX на сервере
```bash
sudo apt update
sudo apt install nginx
```

## 2. Скопируйте конфиг
Скопируйте содержимое файла `nginx.production.conf` в `/etc/nginx/sites-available/forms-cloud`:
```bash
sudo nano /etc/nginx/sites-available/forms-cloud
```

## 3. Активируйте сайт
```bash
sudo ln -s /etc/nginx/sites-available/forms-cloud /etc/nginx/sites-enabled/
```

## 4. Проверьте конфиг и перезапустите NGINX
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 5. Откройте порты 80 и 443
```bash
sudo ufw allow 80
sudo ufw allow 443
```

## 6. Запустите только backend и frontend через Docker
```bash
docker compose up -d --build
```

---

- Сертификаты должны быть в `/etc/letsencrypt/live/bugs-everywhere.ru/` (автоматически обновляются certbot).
- NGINX будет проксировать HTTPS-запросы на ваши контейнеры.
- В Docker больше не нужен сервис nginx. 