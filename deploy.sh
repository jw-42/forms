#!/bin/bash

# Универсальный скрипт развертывания
# Автоматически определяет окружение и настраивает nginx

set -e

# Проверка наличия необходимых утилит
check_dependencies() {
    echo "🔍 Проверка зависимостей..."
    
    local tools=("docker" "lsof")
    local missing_tools=()
    
    for tool in "${tools[@]}"; do
        if ! command -v $tool &> /dev/null; then
            echo "❌ $tool не найден"
            missing_tools+=($tool)
        else
            echo "✅ $tool найден"
        fi
    done
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        echo "❌ Отсутствуют необходимые утилиты: ${missing_tools[*]}"
        echo "💡 Установите их: sudo apt install ${missing_tools[*]}"
        exit 1
    fi
}

# Функция для проверки и освобождения порта
check_and_free_port() {
    local port=$1
    local service_name=$2
    
    echo "🔍 Проверка порта $port ($service_name)..."
    
    # Проверяем, используется ли порт
    if lsof -i :$port > /dev/null 2>&1; then
        echo "⚠️  Порт $port занят. Попытка освобождения..."
        
        # Показываем информацию о процессе
        echo "📋 Информация о процессе на порту $port:"
        lsof -i :$port
        
        # Находим PID процесса, использующего порт
        local pid=$(lsof -ti :$port)
        
        if [ ! -z "$pid" ]; then
            echo "🔄 Остановка процесса $pid на порту $port..."
            kill -TERM $pid 2>/dev/null || true
            
            # Ждем завершения процесса
            sleep 2
            
            # Проверяем, завершился ли процесс
            if kill -0 $pid 2>/dev/null; then
                echo "⚠️  Процесс не завершился, принудительная остановка..."
                kill -KILL $pid 2>/dev/null || true
                sleep 1
            fi
            
            # Финальная проверка
            if lsof -i :$port > /dev/null 2>&1; then
                echo "❌ Не удалось освободить порт $port"
                echo "💡 Попробуйте вручную: sudo lsof -ti :$port | xargs kill -9"
                return 1
            else
                echo "✅ Порт $port освобожден"
            fi
        fi
    else
        echo "✅ Порт $port свободен"
    fi
}

# Функция для проверки всех необходимых портов
check_ports() {
    local env=$1
    echo "🚀 Проверка доступности портов ($env)..."
    
    # Базовые порты для всех окружений
    local ports=("80" "8000" "5432" "29092")
    local services=("nginx" "backend" "postgres" "kafka")
    
    # Добавляем HTTPS порт только для production
    if [ "$env" = "production" ]; then
        ports+=("443")
        services+=("nginx-ssl")
        echo "🔒 Production режим: проверяем HTTPS порт 443"
    else
        echo "🔓 Development режим: пропускаем HTTPS порт 443"
    fi
    
    for i in "${!ports[@]}"; do
        if ! check_and_free_port "${ports[$i]}" "${services[$i]}"; then
            echo "❌ Ошибка: порт ${ports[$i]} не может быть освобожден"
            exit 1
        fi
    done
    
    echo "✅ Все порты готовы к использованию"
}

# Функция для проверки статуса контейнеров
check_containers() {
    echo "🔍 Проверка статуса контейнеров..."
    
    local containers=("nginx" "backend" "postgres" "kafka" "zookeeper" "notify-service")
    local failed_containers=()
    
    for container in "${containers[@]}"; do
        if docker compose ps $container | grep -q "Up"; then
            echo "✅ $container запущен"
        else
            echo "❌ $container не запущен"
            failed_containers+=($container)
        fi
    done
    
    if [ ${#failed_containers[@]} -gt 0 ]; then
        echo "⚠️  Проблемы с контейнерами: ${failed_containers[*]}"
        echo "Проверьте логи: docker compose logs ${failed_containers[0]}"
        return 1
    fi
    
    echo "✅ Все контейнеры запущены успешно"
}

# Проверяем зависимости
check_dependencies

# Определяем окружение
if [ "$1" = "production" ]; then
    ENV="production"
    echo "Запуск в production режиме..."
else
    ENV="development"
    echo "Запуск в development режиме..."
fi

# Проверяем и освобождаем порты
check_ports "$ENV"

# Останавливаем существующие контейнеры
echo "Остановка существующих контейнеров..."
docker compose down

# Дополнительная проверка портов после остановки контейнеров
echo "🔍 Финальная проверка портов..."
check_ports "$ENV"

# Собираем и запускаем сервисы (без frontend)
echo "Запуск сервисов..."
docker compose up -d --build

# В production режиме принудительно пересобираем nginx
if [ "$ENV" = "production" ]; then
    echo "🔄 Принудительная пересборка nginx для production..."
    docker compose build --no-cache nginx
    docker compose up -d nginx
    sleep 5
fi

# Ждем немного для запуска контейнеров
echo "⏳ Ожидание запуска контейнеров..."
sleep 10

# Проверяем статус контейнеров
check_containers

# Напоминание о запуске frontend
echo ""
echo "⚠️  Frontend исключен из Docker сборки!"
echo "Для запуска frontend выполните:"
echo "cd frontend && npm run dev"
echo ""

# В production режиме проверяем SSL-сертификаты
if [ "$ENV" = "production" ]; then
    echo "Проверка SSL-сертификатов в production..."
    
    # Ждем запуска nginx
    sleep 10
    
    # Проверяем наличие сертификатов
    if [ -d "/etc/letsencrypt/live/bugs-everywhere.ru" ]; then
        echo "SSL-сертификаты найдены. Настройка HTTPS..."
        
        # Проверяем, существует ли скрипт в контейнере
        if docker compose exec nginx test -f /usr/local/bin/nginx-ssl-setup.sh; then
            echo "SSL скрипт найден, запускаем настройку..."
            # Проверяем содержимое скрипта для диагностики
            echo "📋 Проверка содержимого SSL скрипта:"
            docker compose exec nginx head -5 /usr/local/bin/nginx-ssl-setup.sh
            docker compose exec nginx /usr/local/bin/nginx-ssl-setup.sh
        else
            echo "⚠️  SSL скрипт не найден в контейнере nginx"
            echo "Пересобираем nginx контейнер..."
            docker compose build nginx
            docker compose up -d nginx
            sleep 5
            
            # Повторная попытка
            if docker compose exec nginx test -f /usr/local/bin/nginx-ssl-setup.sh; then
                echo "SSL скрипт найден после пересборки, запускаем настройку..."
                docker compose exec nginx /usr/local/bin/nginx-ssl-setup.sh
            else
                echo "❌ SSL скрипт все еще не найден. Проверьте файл nginx/nginx-ssl-setup.sh"
            fi
        fi
    else
        echo "SSL-сертификаты не найдены. Работаем в HTTP режиме."
        echo "Для настройки SSL выполните:"
        echo "sudo certbot certonly --standalone -d bugs-everywhere.ru"
        echo "Затем перезапустите: ./deploy.sh production"
    fi
fi

echo "Развертывание завершено!"
echo "Backend API: http://localhost/api"
if [ "$ENV" = "production" ]; then
    echo "Production API: https://bugs-everywhere.ru/api"
fi
echo ""
echo "🎯 Для запуска frontend:"
echo "   cd frontend && npm run dev"
echo "   Затем откройте: http://localhost:3000" 