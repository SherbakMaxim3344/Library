import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

// Для работы с __dirname в ES6 модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cookieParser());
app.use(fileUpload());
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
import booksApiRoutes from './routes/books-api.js';

// Используем маршруты
app.use('/', mainRoutes);
app.use('/books', bookRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/books', booksApiRoutes);

// Простой тестовый маршрут для проверки
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер работает с ES6 модулями!',
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

// Запуск сервера с обработкой ошибок
const PORT = 3002;

app.listen(PORT, () => {
  console.log(`✅ Сервер успешно запущен на http://localhost:${PORT}`);
  console.log(`📊 Проверьте работоспособность: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Главная страница: http://localhost:${PORT}/`);
  console.log(`🛑 Для остановки сервера нажмите Ctrl+C`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Порт ${PORT} уже занят! Попробуйте другой порт.`);
  } else {
    console.log('❌ Ошибка запуска сервера:', err.message);
  }
  process.exit(1);
});

// Обработка graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка сервера...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Получен сигнал завершения работы');
  process.exit(0);
});