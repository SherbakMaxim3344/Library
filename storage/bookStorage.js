const fs = require('fs');
const path = require('path');

// Путь к JSON файлу с книгами
const DATA_FILE = path.join(__dirname, '..', 'data', 'books.json');

// Создаем папку data если ее нет
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Функции для работы с хранилищем
const bookStorage = {
  // Получить все книги
  getAllBooks() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
      }
      // Если файла нет, возвращаем начальные данные
      return [
        { id: '1', title: 'JavaScript для начинающих', author: 'Иван Иванов' },
        { id: '2', title: 'Node.js в действии', author: 'Петр Петров' },
        { id: '3', title: 'Express.js руководство', author: 'Сергей Сергеев' }
      ];
    } catch (error) {
      console.error('Ошибка чтения файла:', error);
      return [];
    }
  },

  // Сохранить все книги
  saveAllBooks(books) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Ошибка записи файла:', error);
      return false;
    }
  },

  // Найти книгу по ID
  getBookById(id) {
    const books = this.getAllBooks();
    return books.find(book => book.id === id);
  },

  // Добавить новую книгу
  addBook(bookData) {
    const books = this.getAllBooks();
    const newBook = {
      id: Date.now().toString(), // Генерируем ID на основе времени
      ...bookData,
      createdAt: new Date().toISOString()
    };
    books.push(newBook);
    this.saveAllBooks(books);
    return newBook;
  },

  // Обновить книгу
  updateBook(id, bookData) {
    const books = this.getAllBooks();
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
      books[index] = { 
        ...books[index], 
        ...bookData, 
        updatedAt: new Date().toISOString() 
      };
      this.saveAllBooks(books);
      return books[index];
    }
    return null;
  },

  // Удалить книгу
  deleteBook(id) {
    const books = this.getAllBooks();
    const filteredBooks = books.filter(book => book.id !== id);
    if (filteredBooks.length !== books.length) {
      this.saveAllBooks(filteredBooks);
      return true;
    }
    return false;
  }
};

module.exports = bookStorage;