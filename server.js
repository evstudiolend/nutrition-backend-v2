// Backend для Health Eat Bot
// Развернуть на Vercel: https://vercel.com/new

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Загружаем базу продуктов
const FOOD_DB = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'database.json'), 'utf8')
);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
// Простой маршрут для проверки, что бекенд жив
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Дополнительные варианты на случай, если фронт ждёт /health или /v1/health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});


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
// =============== AI HELPERS ===============

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function askOpenAI(systemPrompt, userMessage) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY не задан в переменных окружения');
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini', // можно заменить на gpt-3.5-turbo, если так дешевле
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
}

const BASE_SYSTEM_PROMPT = `
Ты — умный ассистент по здоровому питанию и планированию рациона.
Твоя задача — ПРИДУМЫВАТЬ РЕЦЕПТЫ И РАЦИОНЫ С НУЛЯ под запрос пользователя,
а не выбирать из заранее заданного списка.

Всегда учитывай:
- ингредиенты, которые называет пользователь;
- ограничения по времени приготовления;
- желаемую калорийность и КБЖУ, если они указаны;
- цель (снижение веса, поддержание, набор);
- контекст (офис, дом, мало времени, усталость, стресс).

Формат базового ответа в JSON (без пояснительного текста вокруг):
{
  "message": "краткое резюме в 1–3 предложениях для пользователя",
  "recipes": [
    {
      "title": "Название блюда",
      "explanation": "Почему этот рецепт подходит под запрос, кратко",

      "kcal": 350,
      "protein": 25,
      "fat": 12,
      "carbs": 30,

      "ingredients": [
        "паста (цельнозерновая) — 70 г (сухой вес)",
        "нежирные сливки 10% — 80 мл",
        "чеснок — 1 зубчик",
        "петрушка — 5 г",
        "соль, перец — по вкусу"
      ],

      "steps": [
        "Шаг 1 ...",
        "Шаг 2 ..."
      ],

      "ingredients_structured": [
        { "name": "паста (цельнозерновая)", "amount": 70 },
        { "name": "сливки 10%", "amount": 80 },
        { "name": "чеснок", "amount": 5 },
        { "name": "петрушка", "amount": 5 }
      ]
    }
  ]
}

Правила по ингредиентам:
- В поле "ingredients" ВСЕГДА пиши количество и единицы измерения (г, мл, шт, зубчик и т.д.).
- В "ingredients_structured" указывай основные продукты, влияющие на КБЖУ, в граммах (amount — это масса в граммах; воду, специи и соль можно не включать).
- Для каждого рецепта "ingredients_structured" ОБЯЗАТЕЛЬНО должно быть заполнено.

Если пользователь хочет просто совет/план без рецептов — массив recipes может быть пустым.
Отвечай ТОЛЬКО строгим JSON по этому формату без комментариев.
`;

// -------------------- КБЖУ ENGINE --------------------

function calculateNutrition(ingredients) {
  let total = { kcal: 0, protein: 0, fat: 0, carbs: 0 };

  for (const ing of ingredients) {
    const name = ing.name.toLowerCase();
    const amount = ing.amount; // в граммах

    if (!FOOD_DB[name]) continue;

    const per100 = FOOD_DB[name];

    total.kcal    += per100.kcal    * amount / 100;
    total.protein += per100.protein * amount / 100;
    total.fat     += per100.fat     * amount / 100;
    total.carbs   += per100.carbs   * amount / 100;
  }

  return {
    kcal: Math.round(total.kcal),
    protein: Math.round(total.protein),
    fat: Math.round(total.fat),
    carbs: Math.round(total.carbs)
  };
}


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

// AI Chat - генерация ответов и рецептов с нуля
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userKBJU, mood } = req.body;

    const userPrompt = `
Запрос пользователя: """${message || ''}"""

Цель по КБЖУ (если есть): ${userKBJU ? JSON.stringify(userKBJU) : 'не указана'}.
Настроение пользователя по шкале 1–5: ${mood || 'не указано'}.

Сгенерируй ответ в формате, описанном в system prompt.
Если уместно — предложи 1–3 рецепта, которые подходят под цель и запрос.
`;

    const raw = await askOpenAI(BASE_SYSTEM_PROMPT, userPrompt);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // Если модель вернула невалидный JSON — оборачиваем как текст
      parsed = {
        message: raw,
        recipes: []
      };
    }

    // Авто-КБЖУ для AI рецептов
    if (parsed.recipes && Array.isArray(parsed.recipes)) {
      parsed.recipes = parsed.recipes.map(r => {
        if (r.ingredients_structured) {
          r.kbju = calculateNutrition(r.ingredients_structured);
        }
        return r;
      });
    }

    res.json({
      ok: true,
      source: 'ai',
      // это поле использует фронт в чат-истории
      message: parsed.message || 'Вот что я могу предложить:',
      // это поле использует renderAIRecipeResults
      recipes: Array.isArray(parsed.recipes) ? parsed.recipes : []
    });
  } catch (error) {
    console.error('AI /chat error:', error.message);
    res.status(503).json({
      ok: false,
      source: 'fallback',
      error: 'Сервис AI временно недоступен, попробуйте позже.'
    });
  }
});


// Smart rotation - "Надоело, предложи похожее" (AI)
app.post('/api/ai/rotate', async (req, res) => {
  try {
    const { recipeId, recipeName, kbju, category } = req.body;

    const userPrompt = `
Пользователь смотрит рецепт "${recipeName || 'без названия'}".
КБЖУ текущего блюда: ${kbju ? JSON.stringify(kbju) : 'не указано'}.
Категория: ${category || 'не указана'}.

Ему надоело это блюдо, предложи 2–3 альтернативы:
- примерно схожей калорийности и КБЖУ
- разные ингредиенты / кухня
- но достойные замены

Верни JSON:
{
  "message": "краткое объяснение",
  "recipes": [
    {
      "title": "...",
      "explanation": "...",
      "kcal": 400,
      "protein": 30,
      "fat": 12,
      "carbs": 35
    }
  ]
}
`;

    const raw = await askOpenAI(BASE_SYSTEM_PROMPT, userPrompt);

    let parsed;
    try { parsed = JSON.parse(raw); } 
    catch { parsed = { message: raw, recipes: [] }; }

    const alternatives = (parsed.recipes || []).map((r, index) => ({
      id: recipeId + index + 1,
      title: r.title,
      explanation: r.explanation,
      kbju: {
        kcal: r.kcal,
        protein: r.protein,
        fat: r.fat,
        carbs: r.carbs
      }
    }));

    res.json({
      ok: true,
      source: 'ai',
      message: parsed.message,
      alternatives
    });

  } catch (error) {
    console.error('AI rotate error:', error);
    res.status(503).json({
      ok: false,
      source: 'fallback',
      alternatives: []
    });
  }
});


// Подбор под КБЖУ — AI-логика
app.post('/api/match/kbju', async (req, res) => {
  try {
    const { targetKcal, mealsCount } = req.body;

    if (!targetKcal) {
      return res.status(400).json({ ok: false, error: 'targetKcal required' });
    }

    const userPrompt = `
Нужно составить рацион под цель ${targetKcal} ккал.
Количество приёмов пищи: ${mealsCount || 3}.

Верни JSON:
{
  "message": "...",
  "recipes": [
    {
      "title": "...",
      "explanation": "...",
      "kcal": 450,
      "protein": 25,
      "fat": 15,
      "carbs": 40,
      "ingredients": ["..."],
      "steps": ["..."]
    }
  ]
}
`;

    const raw = await askOpenAI(BASE_SYSTEM_PROMPT, userPrompt);
    let parsed;
    try { parsed = JSON.parse(raw); } 
    catch { parsed = { message: raw, recipes: [] }; }

    res.json({
      ok: true,
      source: 'ai',
      message: parsed.message,
      recipes: parsed.recipes
    });

  } catch (error) {
    console.error('AI /match/kbju error:', error);
    res.status(503).json({ ok: false, error: 'AI недоступен' });
  }
});


// Поиск по ингредиентам — AI "из остатков"
app.post('/api/search/pantry', async (req, res) => {
  try {
    const { ingredients, time_limit, kbjuTarget } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ ok: false, error: 'ingredients required' });
    }

    const userPrompt = `
Ингредиенты: ${ingredients.join(', ')}
Лимит времени: ${time_limit || 'не указано'}
Цель КБЖУ: ${kbjuTarget ? JSON.stringify(kbjuTarget) : 'не указана'}

Сгенерируй 2–4 блюда из этих продуктов.
Верни JSON формата (message + recipes[])
`;

    const raw = await askOpenAI(BASE_SYSTEM_PROMPT, userPrompt);

    let parsed;
    try { parsed = JSON.parse(raw); } 
    catch { parsed = { message: raw, recipes: [] }; }

    res.json({
      ok: true,
      source: 'ai',
      message: parsed.message,
      recipes: parsed.recipes
    });

  } catch (error) {
    console.error('AI pantry error:', error);
    res.status(503).json({ ok: false, error: 'AI недоступен' });
  }
});


// SOS — AI антистресс
app.get('/api/sos', async (req, res) => {
  try {
    const userPrompt = `
Сгенерируй SOS-поддержку:
- дыхательная техника 60-120 секунд
- 1–2 мягких перекуса
- сообщение поддержки

Верни JSON:
{
  "message": "...",
  "breathing": { "name": "...", "instruction": "...", "duration_seconds": 60 },
  "snacks": [{ "title": "...", "explanation": "...", "kcal": 150 }]
}
`;

    const raw = await askOpenAI(BASE_SYSTEM_PROMPT, userPrompt);

    let parsed;
    try { parsed = JSON.parse(raw); } 
    catch { parsed = { message: raw, breathing: null, snacks: [] }; }

    res.json({
      ok: true,
      source: 'ai',
      message: parsed.message,
      breathing: parsed.breathing,
      snacks: parsed.snacks,
      timer_minutes: parsed.breathing?.duration_seconds
        ? Math.round(parsed.breathing.duration_seconds / 60)
        : 5
    });

  } catch (error) {
    console.error('AI sos error:', error);
    res.status(503).json({ ok: false, error: 'AI недоступен' });
  }
});

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
