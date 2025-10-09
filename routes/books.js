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

// Страница конкретной книги
router.get('/:id', (req, res) => {
  const book = libraryStorage.getBookById(req.params.id);
  if (book) {
    res.render('book-detail', {
      title: book.title,
      book: book
    });
  } else {
    res.status(404).render('error', {
      title: 'Книга не найдена',
      message: `Книга с ID ${req.params.id} не существует`
    });
  }
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

// Выдать книгу
router.post('/:id/borrow', (req, res) => {
  const { borrower, dueDate } = req.body;
  
  if (!borrower || !dueDate) {
    return res.status(400).json({ 
      success: false, 
      message: 'Заполните все поля' 
    });
  }
  
  const success = libraryStorage.borrowBook(req.params.id, borrower, dueDate);
  
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

export default router;