#!/bin/bash

echo "Останавливаем все контейнеры..."
docker-compose down

echo "Удаляем старые образы..."
docker system prune -f

echo "Удаляем конкретно образы нашего приложения..."
docker images | grep "shcherbak_maxim_lb2_library-app" | awk '{print $3}' | xargs docker rmi -f
docker images | grep "<none>" | awk '{print $3}' | xargs docker rmi -f

echo "Сборка и запуск приложения..."
docker-compose up --build