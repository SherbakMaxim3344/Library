// Базовые функции для работы с сайтом
console.log('Библиотека книг загружена');

// Простые утилиты
function formatDate(dateString) {
  if (!dateString) return 'Не указано';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  console.log('Страница загружена');
});