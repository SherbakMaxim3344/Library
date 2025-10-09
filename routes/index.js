import express from 'express';
const router = express.Router();

// Главная страница
router.get('/', (req, res) => {
  res.render('mypage', { 
    value: 1,
    title: 'Моя страница',
    message: 'Добро пожаловать!'
  });
});

// Страница "page"
router.get('/page', (req, res) => {
  res.render('mypage', { 
    value: 5,
    title: 'Вторая страница',
    message: 'Вы уже посещали этот сайт'
  });
});

// Страница "about"
router.get('/about', (req, res) => {
  res.render('mypage', {
    value: 2,
    title: 'О нас',
    message: 'Информация о нашей компании'
  });
});

// REST API тестовая страница
router.get('/rest-test', (req, res) => {
  res.render('rest-test');
});

export default router;