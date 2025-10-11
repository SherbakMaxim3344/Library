FROM node:18-alpine

WORKDIR /app

# Копируем только package файлы для кэширования зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код
COPY . .

# Создаем папку для данных
RUN mkdir -p data

EXPOSE 3002

CMD ["npm", "start"]