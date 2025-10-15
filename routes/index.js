import express from 'express';
const router = express.Router();

// Главная страница
router.get('/', (req, res) => {
  res.render('mypage', { 
    title: 'Моя страница'
  });
});

// Страница "page"
router.get('/page', (req, res) => {
  res.render('mypage', { 
    title: 'Вторая страница'
  });
});

// Страница "about"
router.get('/about', (req, res) => {
  res.render('mypage', {
    title: 'О нас'
  });
});

// REST API тестовая страница
router.get('/rest-test', (req, res) => {
  res.render('rest-test');
});

export default router;