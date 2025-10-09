import express from 'express';
const router = express.Router();

// Временные данные для тестирования
let books = [
  { id: '1', title: 'JavaScript для начинающих', author: 'Иван Иванов', year: 2022, available: true },
  { id: '2', title: 'Node.js в действии', author: 'Петр Петров', year: 2021, available: false }
];

// GET /api/books - получить все книги
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: books,
    count: books.length
  });
});

// GET /api/books/:id - получить книгу по ID
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Книга с ID ${req.params.id} не найдена`
    });
  }
  
  res.json({
    success: true,
    data: book
  });
});

// POST /api/books - создать новую книгу
router.post('/', (req, res) => {
  const { title, author, year } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({
      success: false,
      message: "Поля title и author обязательны"
    });
  }
  
  const newBook = {
    id: Date.now().toString(),
    title,
    author,
    year: year || new Date().getFullYear(),
    available: true,
    createdAt: new Date().toISOString()
  };
  
  books.push(newBook);
  
  res.status(201).json({
    success: true,
    message: "Книга успешно добавлена",
    data: newBook
  });
});

// PUT /api/books/:id - обновить книгу
router.put('/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === req.params.id);
  
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Книга с ID ${req.params.id} не найдена`
    });
  }
  
  books[bookIndex] = { ...books[bookIndex], ...req.body };
  
  res.json({
    success: true,
    message: "Книга успешно обновлена",
    data: books[bookIndex]
  });
});

// DELETE /api/books/:id - удалить книгу
router.delete('/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === req.params.id);
  
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Книга с ID ${req.params.id} не найдена`
    });
  }
  
  const deletedBook = books.splice(bookIndex, 1)[0];
  
  res.json({
    success: true,
    message: "Книга успешно удалена",
    data: deletedBook
  });
});

export default router;