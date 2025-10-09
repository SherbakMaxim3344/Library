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
      // Начальные данные
      const initialData = {
        books: [
          {
            id: '1',
            title: 'JavaScript для начинающих',
            author: 'Иван Иванов',
            year: 2022,
            genre: 'Программирование',
            isAvailable: true,
            borrower: null,
            dueDate: null,
            addedDate: '2024-01-15'
          },
          {
            id: '2',
            title: 'Node.js в действии',
            author: 'Петр Петров',
            year: 2021,
            genre: 'Программирование',
            isAvailable: false,
            borrower: 'Мария Сидорова',
            dueDate: '2024-12-15',
            addedDate: '2024-01-10'
          },
          {
            id: '3',
            title: 'Война и мир',
            author: 'Лев Толстой',
            year: 1869,
            genre: 'Классика',
            isAvailable: true,
            borrower: null,
            dueDate: null,
            addedDate: '2024-01-05'
          }
        ]
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
    const newBook = {
      id: Date.now().toString(),
      ...bookData,
      isAvailable: true,
      borrower: null,
      dueDate: null,
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    data.books.push(newBook);
    return this.saveLibraryData(data) ? newBook : null;
  },

  // Обновить книгу
  updateBook(id, bookData) {
    const data = this.getLibraryData();
    const index = data.books.findIndex(book => book.id === id);
    
    if (index !== -1) {
      data.books[index] = { ...data.books[index], ...bookData };
      return this.saveLibraryData(data) ? data.books[index] : null;
    }
    return null;
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

  // Выдать книгу
  borrowBook(id, borrower, dueDate) {
    return this.updateBook(id, {
      isAvailable: false,
      borrower,
      dueDate,
      borrowedDate: new Date().toISOString().split('T')[0]
    });
  },

  // Вернуть книгу
  returnBook(id) {
    return this.updateBook(id, {
      isAvailable: true,
      borrower: null,
      dueDate: null
    });
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