// Backend для Health Eat Bot
// Развернуть на Vercel: https://vercel.com/new

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// =============== ДАННЫЕ ===============

const RECIPES = [
  {
    id: 1,
    title: "Греческий йогурт с ягодами",
    author: "От редакции",
    category: "breakfast",
    cook_time: 5,
    difficulty: "easy",
    office_friendly: true,
    kbju: { kcal: 180, protein: 15, fat: 6, carbs: 20 },
    servings: 1,
    tags: ["быстрое", "высокобелковое", "офис"],
    ingredients: ["Греческий йогурт 2% - 150г", "Замороженные ягоды - 80г", "Мёд - 1 ч.л."],
    steps: ["Выложите йогурт в миску", "Добавьте размороженные ягоды", "Полейте мёдом"],
    cuisine: "mediterranean",
    flavor_profile: ["sweet", "fresh"]
  },
  {
    id: 2,
    title: "Куриная грудка с гречкой",
    author: "От редакции",
    category: "lunch",
    cook_time: 25,
    difficulty: "easy",
    office_friendly: false,
    kbju: { kcal: 420, protein: 38, fat: 12, carbs: 45 },
    servings: 1,
    tags: ["высокобелковое", "сбалансированное"],
    ingredients: ["Куриная грудка - 150г", "Гречка - 80г (сухая)", "Масло оливковое - 1 ч.л.", "Соль, перец"],
    steps: ["Отварите гречку", "Обжарьте грудку", "Подавайте вместе"],
    cuisine: "russian",
    flavor_profile: ["savory", "hearty"]
  },
  {
    id: 3,
    title: "Овсянка с бананом",
    author: "От редакции",
    category: "breakfast",
    cook_time: 8,
    difficulty: "easy",
    office_friendly: true,
    kbju: { kcal: 285, protein: 10, fat: 7, carbs: 48 },
    servings: 1,
    tags: ["быстрое", "офис", "энергия"],
    ingredients: ["Овсяные хлопья - 50г", "Молоко 2.5% - 200мл", "Банан - 1 шт", "Корица"],
    steps: ["Залейте хлопья молоком", "Варите 5 минут", "Добавьте банан"],
    cuisine: "russian",
    flavor_profile: ["sweet", "comforting"]
  },
  {
    id: 4,
    title: "Салат с тунцом",
    author: "От редакции",
    category: "lunch",
    cook_time: 10,
    difficulty: "easy",
    office_friendly: true,
    kbju: { kcal: 245, protein: 28, fat: 10, carbs: 12 },
    servings: 1,
    tags: ["быстрое", "высокобелковое", "офис", "низкоуглеводное"],
    ingredients: ["Тунец консервированный - 100г", "Листья салата - 100г", "Помидоры черри - 100г", "Огурец - 1 шт"],
    steps: ["Нарежьте овощи", "Смешайте с тунцом", "Заправьте маслом"],
    cuisine: "mediterranean",
    flavor_profile: ["fresh", "light"]
  },
  {
    id: 5,
    title: "Омлет с овощами",
    author: "От редакции",
    category: "breakfast",
    cook_time: 12,
    difficulty: "easy",
    office_friendly: false,
    kbju: { kcal: 220, protein: 16, fat: 14, carbs: 8 },
    servings: 1,
    tags: ["быстрое", "высокобелковое", "низкоуглеводное"],
    ingredients: ["Яйца - 2 шт", "Молоко - 50мл", "Болгарский перец - 50г", "Помидор - 50g"],
    steps: ["Взбейте яйца", "Обжарьте овощи", "Залейте яичной смесью"],
    cuisine: "russian",
    flavor_profile: ["savory", "light"]
  },
  {
    id: 6,
    title: "Протеиновый смузи",
    author: "От редакции",
    category: "snack",
    cook_time: 3,
    difficulty: "easy",
    office_friendly: true,
    kbju: { kcal: 210, protein: 22, fat: 5, carbs: 22 },
    servings: 1,
    tags: ["быстрое", "высокобелковое", "офис"],
    ingredients: ["Протеиновый порошок - 30g", "Молоко 1.5% - 250ml", "Банан - 1 шт", "Лёд - 50g"],
    steps: ["Все в блендер", "Взбейте", "Пейте сразу"],
    cuisine: "modern",
    flavor_profile: ["sweet", "smooth"]
  },
  {
    id: 7,
    title: "Рис с курицей и брокколи",
    author: "От редакции",
    category: "lunch",
    cook_time: 30,
    difficulty: "easy",
    office_friendly: false,
    kbju: { kcal: 445, protein: 40, fat: 10, carbs: 52 },
    servings: 1,
    tags: ["высокобелковое", "сбалансированное"],
    ingredients: ["Куриная грудка - 150g", "Рис бурый - 70g", "Брокколи - 150g", "Соевый соус - 1 ст.л."],
    steps: ["Отварите рис", "Обжарьте курицу", "Добавьте брокколи", "Смешайте"],
    cuisine: "asian",
    flavor_profile: ["savory", "umami"]
  },
  {
    id: 8,
    title: "Хумус с овощами",
    author: "От редакции",
    category: "snack",
    cook_time: 5,
    difficulty: "easy",
    office_friendly: true,
    kbju: { kcal: 180, protein: 7, fat: 8, carbs: 20 },
    servings: 1,
    tags: ["быстрое", "офис", "веган"],
    ingredients: ["Хумус - 80g", "Морковь - 100g", "Огурец - 100g", "Перец - 100g"],
    steps: ["Нарежьте овощи", "Подавайте с хумусом"],
    cuisine: "mediterranean",
    flavor_profile: ["fresh", "earthy"]
  },
  {
    id: 9,
    title: "Запеченная рыба с овощами",
    author: "От редакции",
    category: "dinner",
    cook_time: 30,
    difficulty: "easy",
    office_friendly: false,
    kbju: { kcal: 310, protein: 35, fat: 14, carbs: 15 },
    servings: 1,
    tags: ["высокобелковое", "сбалансированное"],
    ingredients: ["Филе рыбы - 180g", "Кабачок - 150g", "Помидор - 100g", "Лимон"],
    steps: ["Нарежьте овощи", "Выложите на противень", "Запекайте 25 минут"],
    cuisine: "mediterranean",
    flavor_profile: ["light", "fresh"]
  },
  {
    id: 10,
    title: "Чечевичный суп",
    author: "От редакции",
    category: "lunch",
    cook_time: 35,
    difficulty: "easy",
    office_friendly: false,
    kbju: { kcal: 285, protein: 16, fat: 5, carbs: 45 },
    servings: 2,
    tags: ["сбалансированное", "веган"],
    ingredients: ["Красная чечевица - 100g", "Морковь - 1 шт", "Лук - 1 шт", "Помидор - 2 шт"],
    steps: ["Обжарьте лук и морковь", "Добавьте чечевицу", "Варите 20 минут", "Добавьте помидоры"],
    cuisine: "russian",
    flavor_profile: ["hearty", "comforting"]
  },
  {
    id: 11,
    title: "Творог с зеленью",
    author: "От редакции",
    category: "snack",
    cook_time: 5,
    difficulty: "easy",
    office_friendly: true,
    kbju: { kcal: 130, protein: 16, fat: 5, carbs: 6 },
    servings: 1,
    tags: ["быстрое", "высокобелковое", "офис", "низкоуглеводное"],
    ingredients: ["Творог 5% - 150g", "Огурец - 1 шт", "Укроп", "Соль"],
    steps: ["Нарежьте огурец", "Смешайте с творогом", "Посолите"],
    cuisine: "russian",
    flavor_profile: ["fresh", "savory"]
  }
];

// =============== API ENDPOINTS ===============

// Здоровье чека
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Health Eat Bot Backend работает!' });
});

// Получить все рецепты
app.get('/api/recipes', (req, res) => {
  const { max_time, office, search } = req.query;
  
  let filtered = RECIPES;
  
  if (max_time) {
    filtered = filtered.filter(r => r.cook_time <= parseInt(max_time));
  }
  if (office === 'true') {
    filtered = filtered.filter(r => r.office_friendly);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.ingredients.some(ing => ing.toLowerCase().includes(q))
    );
  }
  
  res.json(filtered);
});

// Получить один рецепт
app.get('/api/recipes/:id', (req, res) => {
  const recipe = RECIPES.find(r => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
});

// AI Chat - анализ запроса и подбор рецептов
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userKBJU } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: 'API key not configured' });
    }
    
    // Промпт для анализа запроса
    const systemPrompt = `Ты помощник по выбору рецептов здорового питания. 
Твоя задача - анализировать запрос пользователя и вернуть JSON с параметрами поиска.
Верни ответ ТОЛЬКО в виде JSON без дополнительного текста.
Поля: { max_time: число или null, tags: [], cuisine: строка или null, mood: строка или null }`;
    
    // Вызов OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const aiAnalysis = JSON.parse(response.data.choices[0].message.content);
    
    // Фильтруем рецепты по результатам AI анализа
    let filteredRecipes = RECIPES;
    
    if (aiAnalysis.max_time) {
      filteredRecipes = filteredRecipes.filter(r => r.cook_time <= aiAnalysis.max_time);
    }
    if (aiAnalysis.tags && aiAnalysis.tags.length > 0) {
      filteredRecipes = filteredRecipes.filter(r => 
        aiAnalysis.tags.some(tag => r.tags.includes(tag))
      );
    }
    if (aiAnalysis.cuisine) {
      filteredRecipes = filteredRecipes.filter(r => r.cuisine === aiAnalysis.cuisine);
    }
    
    // Если ничего не нашли, вернём популярные
    if (filteredRecipes.length === 0) {
      filteredRecipes = RECIPES.slice(0, 3);
    } else {
      filteredRecipes = filteredRecipes.slice(0, 3);
    }
    
    res.json({
      analysis: aiAnalysis,
      recipes: filteredRecipes,
      message: `Вот ${filteredRecipes.length} вариантов для вас!`
    });
    
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ 
      error: 'AI service error',
      message: error.message,
      recipes: RECIPES.slice(0, 3) // Fallback
    });
  }
});

// Smart rotation - предложить похожий рецепт
app.post('/api/ai/rotate', async (req, res) => {
  try {
    const { recipeId } = req.body;
    const currentRecipe = RECIPES.find(r => r.id === recipeId);
    
    if (!currentRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      // Fallback: просто вернём случайный похожий рецепт
      const similar = RECIPES.filter(r => 
        r.id !== recipeId && 
        Math.abs(r.kbju.kcal - currentRecipe.kbju.kcal) < 50 &&
        r.cuisine !== currentRecipe.cuisine
      );
      return res.json({
        alternatives: similar.slice(0, 2),
        message: 'Вот похожие по КБЖУ, но другие рецепты'
      });
    }
    
    // С использованием AI
    const prompt = `Дан рецепт: "${currentRecipe.title}" (${currentRecipe.kbju.kcal} ккал, ${currentRecipe.cuisine} кухня, вкусовой профиль: ${currentRecipe.flavor_profile.join(', ')}).
Найди в списке 2 рецепта с похожей КБЖУ (±10%), но другой кухней и вкусом. 
Верни JSON: { recipeTitles: ["название1", "название2"] }`;
    
    const aiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Ты помощник по подбору рецептов. Верни ТОЛЬКО JSON без дополнительного текста.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const alternatives = RECIPES.filter(r => 
      r.id !== recipeId && 
      Math.abs(r.kbju.kcal - currentRecipe.kbju.kcal) < 50 &&
      r.cuisine !== currentRecipe.cuisine
    ).slice(0, 2);
    
    res.json({
      alternatives,
      message: 'Вот похожие по КБЖУ, но другие рецепты, чтобы не надоело!'
    });
    
  } catch (error) {
    console.error('Rotate Error:', error.message);
    
    // Fallback
    const currentRecipe = RECIPES.find(r => r.id === req.body.recipeId);
    const alternatives = RECIPES.filter(r => 
      r.id !== req.body.recipeId && 
      Math.abs(r.kbju.kcal - currentRecipe.kbju.kcal) < 50 &&
      r.cuisine !== currentRecipe.cuisine
    ).slice(0, 2);
    
    res.json({ alternatives, message: 'Вот похожие рецепты' });
  }
});

// Быстро сейчас (≤10 мин)
app.get('/api/quick', (req, res) => {
  const quick = RECIPES.filter(r => r.cook_time <= 10 && r.office_friendly).slice(0, 5);
  res.json(quick);
});

// Подбор под КБЖУ
app.post('/api/match/kbju', (req, res) => {
  const { targetKcal } = req.body;
  
  if (!targetKcal) {
    return res.status(400).json({ error: 'targetKcal required' });
  }
  
  const tolerance = targetKcal * 0.15; // ±15%
  const matched = RECIPES.filter(r => 
    r.kbju.kcal >= targetKcal - tolerance && 
    r.kbju.kcal <= targetKcal + tolerance
  );
  
  res.json({
    target: targetKcal,
    matched: matched.slice(0, 5),
    count: matched.length
  });
});

// Поиск рецептов по ингредиентам
app.post('/api/search/pantry', (req, res) => {
  const { ingredients } = req.body;
  
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'ingredients array required' });
  }
  
  const results = RECIPES.map(recipe => {
    const matchCount = ingredients.filter(ing => 
      recipe.ingredients.some(recIng => recIng.toLowerCase().includes(ing.toLowerCase()))
    ).length;
    
    return {
      ...recipe,
      matchScore: matchCount
    };
  }).filter(r => r.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  
  res.json(results);
});

// SOS - антистресс
app.get('/api/sos', (req, res) => {
  const breathingExercises = [
    {
      name: "Дыхание квадратом",
      instruction: "Вдох 4 сек → Задержка 4 сек → Выдох 4 сек → Задержка 4 сек",
      duration: 60
    },
    {
      name: "4-7-8 дыхание",
      instruction: "Вдох через нос 4 сек → Задержка 7 сек → Выдох через рот 8 сек",
      duration: 45
    }
  ];
  
  const healthySnacks = RECIPES
    .filter(r => r.kbju.kcal <= 200 && r.cook_time <= 10)
    .slice(0, 2);
  
  res.json({
    breathing: breathingExercises[0],
    snacks: healthySnacks,
    message: "Ты справишься! Вот быстрая помощь.",
    timer_minutes: 5
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Запуск
app.listen(PORT, () => {
  console.log(`🚀 Health Eat Bot Backend running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
