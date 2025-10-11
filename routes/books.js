import express from 'express';
const router = express.Router();
import libraryStorage from '../storage/libraryStorage.js';

// Главная страница книг с фильтрацией
router.get('/', (req, res) => {
  let books = libraryStorage.getAllBooks();
  const filter = req.query.filter || 'all';
  const sort = req.query.sort || 'title';

  // Применяем фильтрацию
  switch (filter) {
    case 'available':
      books = libraryStorage.getAvailableBooks();
      break;
    case 'borrowed':
      books = libraryStorage.getBorrowedBooks();
      break;
    case 'expiring':
      books = libraryStorage.getExpiringBooks();
      break;
    default:
      books = libraryStorage.getAllBooks();
  }

  // Применяем сортировку
  books.sort((a, b) => {
    switch (sort) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'year':
        return b.year - a.year;
      case 'dueDate':
        return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
      default:
        return 0;
    }
  });

  const stats = libraryStorage.getStatistics();
  
  res.render('books', {
    title: 'Управление книгами',
    books: books,
    statistics: stats,
    filter: filter,
    sort: sort,
    message: `Найдено ${books.length} книг`
  });
});

// AJAX endpoint для фильтрации книг
router.get('/api/filter', (req, res) => {
  let books = libraryStorage.getAllBooks();
  const filter = req.query.filter || 'all';
  const sort = req.query.sort || 'title';

  // Применяем фильтрацию
  switch (filter) {
    case 'available':
      books = libraryStorage.getAvailableBooks();
      break;
    case 'borrowed':
      books = libraryStorage.getBorrowedBooks();
      break;
    case 'expiring':
      books = libraryStorage.getExpiringBooks();
      break;
    default:
      books = libraryStorage.getAllBooks();
  }

  // Применяем сортировку
  books.sort((a, b) => {
    switch (sort) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'year':
        return b.year - a.year;
      case 'dueDate':
        return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
      default:
        return 0;
    }
  });

  const statistics = libraryStorage.getStatistics();

  res.json({
    books: books,
    statistics: statistics,
    message: `Найдено ${books.length} книг`
  });
});

// Страница конкретной книги
router.get('/:id', (req, res) => {
  res.redirect('/books');
});

// Форма добавления книги
router.get('/add/new', (req, res) => {
  res.render('add-book', {
    title: 'Добавить новую книгу'
  });
});

// Обработчик добавления книги
router.post('/add', (req, res) => {
  const { title, author, year, genre } = req.body;
  
  if (title && author && year && genre) {
    const newBook = libraryStorage.addBook({
      title,
      author, 
      year: parseInt(year),
      genre
    });
    
    if (newBook) {
      res.redirect('/books?added=true');
    } else {
      res.render('error', {
        title: 'Ошибка',
        message: 'Не удалось добавить книгу'
      });
    }
  } else {
    res.render('error', {
      title: 'Ошибка',
      message: 'Все поля обязательны для заполнения'
    });
  }
});

// Удаление книги
router.post('/:id/delete', (req, res) => {
  const success = libraryStorage.deleteBook(req.params.id);
  
  if (success) {
    res.json({ success: true, message: 'Книга успешно удалена' });
  } else {
    res.status(404).json({ success: false, message: 'Книга не найдена' });
  }
});

// Выдать книгу - С ЛОГИРОВАНИЕМ
router.post('/:id/borrow', (req, res) => {
  const { borrower, readerEmail, readerPhone, dueDate } = req.body;
  
  console.log('=== 📚 ВЫДАЧА КНИГИ ===');
  console.log('ID книги:', req.params.id);
  console.log('Данные читателя:', { borrower, readerEmail, readerPhone, dueDate });
  
  if (!borrower || !dueDate) {
    console.log('❌ Не заполнены обязательные поля');
    return res.status(400).json({ 
      success: false, 
      message: 'Заполните обязательные поля' 
    });
  }
  
  const success = libraryStorage.borrowBook(
    req.params.id, 
    borrower, 
    dueDate,
    readerEmail,
    readerPhone
  );
  
  console.log('📝 Результат выдачи на сервере:', success);
  
  if (success) {
    res.json({ success: true, message: 'Книга успешно выдана' });
  } else {
    res.status(400).json({ 
      success: false, 
      message: 'Не удалось выдать книгу' 
    });
  }
});

// Вернуть книгу
router.post('/:id/return', (req, res) => {
  const success = libraryStorage.returnBook(req.params.id);
  
  if (success) {
    res.json({ success: true, message: 'Книга возвращена в библиотеку' });
  } else {
    res.status(400).json({ 
      success: false, 
      message: 'Не удалось вернуть книгу' 
    });
  }
});

// Обновление книги
router.post('/:id/update', (req, res) => {
  const { title, author, year, genre } = req.body;
  
  if (!title || !author || !year || !genre) {
    return res.status(400).json({ 
      success: false, 
      message: 'Все поля обязательны для заполнения' 
    });
  }
  
  const success = libraryStorage.updateBook(req.params.id, {
    title,
    author,
    year: parseInt(year),
    genre
  });
  
  if (success) {
    res.json({ success: true, message: 'Книга успешно обновлена' });
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'Книга не найдена' 
    });
  }
});

export default router;