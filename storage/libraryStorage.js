import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'data', 'books.json');

// Создаем папку data если ее нет
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Функции для работы с библиотекой
const libraryStorage = {
  // Получить все данные
  getLibraryData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
      }
      // Если файла нет, создаем пустую структуру
      const initialData = {
        books: []
      };
      this.saveLibraryData(initialData);
      return initialData;
    } catch (error) {
      console.error('Ошибка чтения файла:', error);
      return { books: [] };
    }
  },

  // Сохранить данные
  saveLibraryData(data) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Ошибка записи файла:', error);
      return false;
    }
  },

  // Получить все книги
  getAllBooks() {
    const data = this.getLibraryData();
    return data.books;
  },

  // Получить книгу по ID
  getBookById(id) {
    const books = this.getAllBooks();
    return books.find(book => book.id === id);
  },

  // Получить доступные книги
  getAvailableBooks() {
    const books = this.getAllBooks();
    return books.filter(book => book.isAvailable);
  },

  // Получить выданные книги
  getBorrowedBooks() {
    const books = this.getAllBooks();
    return books.filter(book => !book.isAvailable);
  },

  // Получить книги с истекающим сроком
  getExpiringBooks(days = 7) {
    const books = this.getAllBooks();
    const now = new Date();
    return books.filter(book => {
      if (!book.dueDate) return false;
      const dueDate = new Date(book.dueDate);
      const diffTime = dueDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days && diffDays > 0;
    });
  },

  // Добавить книгу
  addBook(bookData) {
    const data = this.getLibraryData();
    
    // Находим максимальный ID для последовательных ID
    let maxId = 0;
    data.books.forEach(book => {
      const bookId = parseInt(book.id);
      if (bookId > maxId) maxId = bookId;
    });
    
    const newBook = {
      id: (maxId + 1).toString(), // Простые последовательные ID
      ...bookData,
      isAvailable: true,
      borrower: null,
      dueDate: null,
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    data.books.push(newBook);
    return this.saveLibraryData(data) ? newBook : null;
  },

  // Обновить книгу - ИСПРАВЛЕННАЯ ВЕРСИЯ
  updateBook(id, bookData) {
    const data = this.getLibraryData();
    const index = data.books.findIndex(book => book.id === id);
    
    if (index === -1) {
      console.log('❌ Книга с ID', id, 'не найдена');
      return null;
    }
    
    // ОБНОВЛЯЕМ ВСЕ ПЕРЕДАННЫЕ ПОЛЯ
    data.books[index] = {
      ...data.books[index],
      ...bookData
    };
    
    const success = this.saveLibraryData(data);
    console.log('✅ Книга обновлена:', data.books[index]);
    return success ? data.books[index] : null;
  },

  // Удалить книгу
  deleteBook(id) {
    const data = this.getLibraryData();
    const filteredBooks = data.books.filter(book => book.id !== id);
    
    if (filteredBooks.length !== data.books.length) {
      data.books = filteredBooks;
      return this.saveLibraryData(data);
    }
    return false;
  },

  // Выдать книгу - ИСПРАВЛЕННАЯ ВЕРСИЯ
  borrowBook(id, borrower, dueDate, readerEmail = '', readerPhone = '') {
    console.log('📚 Выдача книги:', { id, borrower, dueDate, readerEmail, readerPhone });
    
    const book = this.getBookById(id);
    if (!book) {
      console.log('❌ Книга не найдена');
      return false;
    }
    
    const result = this.updateBook(id, {
      isAvailable: false,
      borrower: borrower,
      readerEmail: readerEmail,
      readerPhone: readerPhone,
      dueDate: dueDate,
      borrowedDate: new Date().toISOString().split('T')[0]
    });
    
    console.log('📝 Результат выдачи:', result ? '✅ Успешно' : '❌ Ошибка');
    return !!result;
  },

  // Вернуть книгу
  returnBook(id) {
    console.log('🔄 Возврат книги:', id);
    
    const book = this.getBookById(id);
    if (!book) {
      console.log('❌ Книга не найдена');
      return false;
    }
    
    const result = this.updateBook(id, {
      isAvailable: true,
      borrower: null,
      readerEmail: '',
      readerPhone: '',
      dueDate: null
    });
    
    console.log('📝 Результат возврата:', result ? '✅ Успешно' : '❌ Ошибка');
    return !!result;
  },

  // Статистика
  getStatistics() {
    const books = this.getAllBooks();
    const genres = [...new Set(books.map(book => book.genre))];
    
    return {
      totalBooks: books.length,
      availableBooks: books.filter(book => book.isAvailable).length,
      borrowedBooks: books.filter(book => !book.isAvailable).length,
      totalGenres: genres.length,
      expiringBooks: this.getExpiringBooks().length
    };
  }
};

export default libraryStorage;