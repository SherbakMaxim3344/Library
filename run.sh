#!/bin/bash

echo "🧹 Очистка старых контейнеров..."
docker-compose down

echo "🐳 Сборка и запуск приложения..."
docker-compose up --build