import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Для работы с __dirname в ES6 модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Только базовые middleware (убрали cookie-parser и fileUpload)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка статической папки
app.use('/public', express.static(path.join(__dirname, 'public')));

// Настройка шаблонизатора Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Подключаем маршруты
import mainRoutes from './routes/index.js';
import bookRoutes from './routes/books.js';
import groupsRoutes from './routes/groups.js';

// Используем маршруты
app.use('/', mainRoutes);
app.use('/books', bookRoutes);
app.use('/api/groups', groupsRoutes);

// Простой тестовый маршрут для проверки
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер работает!',
    timestamp: new Date().toISOString()
  });
});

// Обработчик 404
app.use((req, res) => {
  res.status(404).render('mypage', {
    title: 'Страница не найдена',
    message: 'Запрашиваемая страница не существует',
    value: 0
  });
});

// Запуск сервера
const PORT = 3002;

app.listen(PORT, () => {
  console.log(`✅ Сервер успешно запущен на http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Порт ${PORT} уже занят! Попробуйте порт 3003.`);
    app.listen(3003);
  } else {
    console.log('❌ Ошибка запуска сервера:', err.message);
  }
});