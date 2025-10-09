import express from 'express';
const router = express.Router();

// Mock данные для групп
let groups = [
  { id: 1, name: "5381", students: 15, rating: 4.1 },
  { id: 2, name: "5303", students: 13, rating: 4.7 },
  { id: 3, name: "5311", students: 18, rating: 4.3 }
];

// GET /api/groups - получить все группы
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: groups,
    count: groups.length
  });
});

// GET /api/groups/:id - получить группу по ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID должен быть числом"
    });
  }

  const group = groups.find(g => g.id === id);
  
  if (!group) {
    return res.status(404).json({
      success: false,
      message: `Группа с ID ${id} не найдена`
    });
  }
  
  res.json({
    success: true,
    data: group
  });
});

// POST /api/groups - создать новую группу
router.post('/', (req, res) => {
  let body = req.body;
  
  // Валидация данных
  if (!body.name || 
      !body.students?.toString().match(/^[0-9]{1,}$/g) || 
      !body.rating?.toString().match(/^[0-9]\.[0-9]$/g)) {
    res.status(400);
    res.json({
      success: false,
      message: "Bad Request - Неверные данные"
    });
  } else {
    const newGroup = {
      id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
      name: body.name,
      students: parseInt(body.students),
      rating: parseFloat(body.rating),
      createdAt: new Date().toISOString()
    };
    
    groups.push(newGroup);
    
    res.status(201).json({
      success: true,
      message: "Группа успешно создана",
      data: newGroup
    });
  }
});

// PUT /api/groups/:id - обновить или создать группу
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID должен быть числом"
    });
  }

  const body = req.body;
  
  // Поиск группы по ID
  const groupIndex = groups.findIndex(group => group.id === id);
  
  if (groupIndex !== -1) {
    // Обновление существующей группы
    groups[groupIndex] = {
      ...groups[groupIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: "Группа успешно обновлена",
      data: groups[groupIndex]
    });
  } else {
    // Создание новой группы с указанным ID
    const newGroup = {
      id: id,
      name: body.name,
      students: parseInt(body.students),
      rating: parseFloat(body.rating),
      createdAt: new Date().toISOString()
    };
    
    groups.push(newGroup);
    
    res.status(201).json({
      success: true,
      message: "Группа успешно создана",
      data: newGroup
    });
  }
});

// DELETE /api/groups/:id - удалить группу
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID должен быть числом"
    });
  }

  const removeIndex = groups.findIndex(group => group.id === id);
  
  if (removeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Группа с ID ${id} не найдена`
    });
  }
  
  const deletedGroup = groups.splice(removeIndex, 1)[0];
  
  res.json({
    success: true,
    message: "Группа успешно удалена",
    data: deletedGroup
  });
});

// GET /api/groups/stats/rating - статистика по рейтингам
router.get('/stats/rating', (req, res) => {
  const totalGroups = groups.length;
  const avgRating = groups.reduce((sum, group) => sum + group.rating, 0) / totalGroups;
  const maxRating = Math.max(...groups.map(g => g.rating));
  const minRating = Math.min(...groups.map(g => g.rating));
  
  res.json({
    success: true,
    data: {
      totalGroups,
      averageRating: avgRating.toFixed(2),
      maxRating,
      minRating,
      ratingDistribution: groups.reduce((acc, group) => {
        const rating = group.rating.toFixed(1);
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {})
    }
  });
});

export default router;