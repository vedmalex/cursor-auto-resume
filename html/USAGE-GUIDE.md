# Руководство по использованию window-minimal.html

## Обзор

Файл `window-minimal.html` предназначен для быстрого и эффективного тестирования скрипта `cursor-auto-resume.js` без необходимости загрузки полного интерфейса Cursor (4.1MB). Он содержит только самые важные элементы UI, необходимые для тестирования.

## Быстрый старт

### 1. Открытие в браузере
```bash
# Откройте файл в браузере для визуального тестирования
open html/window-minimal.html
# или
firefox html/window-minimal.html
```

### 2. Использование в автоматических тестах
```javascript
// В ваших тестах
import { readFileSync } from 'fs';
const html = readFileSync('html/window-minimal.html', 'utf8');
document.body.innerHTML = html;
```

## Сценарии использования

### Разработка новых функций
При добавлении новой функциональности в `cursor-auto-resume.js`:

1. **Откройте `window-minimal.html` в браузере**
2. **Откройте DevTools (F12)**
3. **Загрузите ваш скрипт:**
   ```javascript
   // В консоли браузера
   const script = document.createElement('script');
   script.src = '../cursor-auto-resume.js';
   document.head.appendChild(script);
   ```
4. **Используйте testHelpers для симуляции состояний:**
   ```javascript
   // Симуляция генерации
   window.testHelpers.setGenerating(true);

   // Симуляция ошибки
   window.testHelpers.setError(true, "Test error");

   // Смена режима
   window.testHelpers.setMode("UNIVERSAL");
   ```

### Отладка проблем
Когда скрипт не работает как ожидается:

1. **Проверьте селекторы:**
   ```javascript
   // Проверьте, находит ли скрипт нужные элементы
   console.log(document.querySelector('.generating-text'));
   console.log(document.querySelector('.resume-button'));
   ```

2. **Протестируйте функции скрипта:**
   ```javascript
   // Если функции доступны глобально
   console.log(isGeneratingTextPresent());
   console.log(checkErrorOrResumeButtons());
   ```

3. **Симулируйте различные состояния:**
   ```javascript
   // Тест различных сценариев
   window.testHelpers.setGenerating(true);
   // ... проверьте поведение

   window.testHelpers.setError(true);
   // ... проверьте обработку ошибок
   ```

### Unit тестирование
```javascript
// tests/my-new-test.js
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

test('my new feature', () => {
  const html = readFileSync('html/window-minimal.html', 'utf8');
  const dom = new JSDOM(html);
  const window = dom.window;

  // Ваши тесты здесь
  window.testHelpers.setGenerating(true);
  expect(window.document.querySelector('.generating-text').textContent).toBe('Generating...');
});
```

### Integration тестирование
```javascript
// Полная симуляция пользовательского сценария
test('user workflow simulation', () => {
  const window = loadMinimalWindow();

  // 1. Пользователь выбирает модель
  window.testHelpers.setModel('gemini-2.5-flash');

  // 2. Пользователь выбирает режим
  window.testHelpers.setMode('UNIVERSAL');

  // 3. Начинается генерация
  window.testHelpers.setGenerating(true);

  // 4. Проверяем, что скрипт правильно обнаруживает состояние
  expect(isGeneratingTextPresent()).toBe(true);

  // 5. Симулируем ошибку
  window.testHelpers.setError(true, 'Connection timeout');

  // 6. Проверяем обработку ошибки
  expect(checkErrorOrResumeButtons()).toBeTruthy();
});
```

## API Reference

### window.testHelpers

#### setGenerating(isGenerating: boolean)
Симулирует состояние генерации ответа.

**Параметры:**
- `isGenerating` - `true` для активации состояния генерации, `false` для деактивации

**Эффекты:**
- Изменяет текст в `.generating-text`
- Переключает видимость кнопок Send/Stop
- Добавляет/убирает класс `.generating` у индикатора

**Пример:**
```javascript
// Включить генерацию
window.testHelpers.setGenerating(true);

// Выключить генерацию
window.testHelpers.setGenerating(false);
```

#### setError(hasError: boolean, errorMessage?: string)
Симулирует состояние ошибки.

**Параметры:**
- `hasError` - `true` для показа ошибки, `false` для скрытия
- `errorMessage` - текст ошибки (опционально)

**Эффекты:**
- Показывает/скрывает блок `.error-message`
- Устанавливает текст ошибки в `.error-text`

**Пример:**
```javascript
// Показать ошибку
window.testHelpers.setError(true, "Connection failed");

// Скрыть ошибку
window.testHelpers.setError(false);
```

#### setMode(mode: string)
Симулирует выбор режима работы.

**Параметры:**
- `mode` - название режима ("UNIVERSAL", "STEADILY", "Agent", "Ask", "Manual")

**Эффекты:**
- Добавляет класс `.active` к выбранной кнопке режима
- Убирает класс `.active` у остальных кнопок

**Пример:**
```javascript
window.testHelpers.setMode("UNIVERSAL");
window.testHelpers.setMode("STEADILY");
```

#### setModel(model: string)
Симулирует выбор AI модели.

**Параметры:**
- `model` - название модели ("gpt-4", "claude-3.5-sonnet", "gemini-2.5-flash")

**Эффекты:**
- Устанавливает значение селектора `#model-selector`

**Пример:**
```javascript
window.testHelpers.setModel("gemini-2.5-flash");
```

## Расширенные сценарии

### Тестирование последовательности действий
```javascript
// Симуляция полного цикла взаимодействия
async function testFullWorkflow() {
  const window = loadMinimalWindow();

  // Шаг 1: Настройка
  window.testHelpers.setModel('gemini-2.5-flash');
  window.testHelpers.setMode('UNIVERSAL');

  // Шаг 2: Начало генерации
  window.testHelpers.setGenerating(true);
  await delay(100); // Симуляция времени

  // Шаг 3: Ошибка во время генерации
  window.testHelpers.setError(true, 'Rate limit exceeded');
  window.testHelpers.setGenerating(false);

  // Шаг 4: Пользователь нажимает Resume
  const resumeBtn = window.document.querySelector('.resume-button');
  resumeBtn.click();

  // Шаг 5: Возобновление генерации
  window.testHelpers.setError(false);
  window.testHelpers.setGenerating(true);

  // Шаг 6: Успешное завершение
  await delay(200);
  window.testHelpers.setGenerating(false);

  // Проверки
  expect(window.document.querySelector('.error-message').classList.contains('hidden')).toBe(true);
  expect(window.document.querySelector('.generating-text').textContent).toBe('');
}
```

### Тестирование производительности
```javascript
// Измерение времени выполнения функций скрипта
function benchmarkScript() {
  const window = loadMinimalWindow();

  // Подготовка различных состояний
  const states = [
    () => window.testHelpers.setGenerating(true),
    () => window.testHelpers.setError(true),
    () => window.testHelpers.setMode('UNIVERSAL'),
  ];

  states.forEach((setState, index) => {
    setState();

    const start = performance.now();

    // Вызов функций скрипта
    isGeneratingTextPresent();
    checkErrorOrResumeButtons();

    const end = performance.now();
    console.log(`State ${index}: ${end - start}ms`);
  });
}
```

### Мокирование внешних зависимостей
```javascript
// Мокирование функций, которые могут отсутствовать в тестовой среде
function setupMocks(window) {
  // Мок для функций, которые могут обращаться к внешним API
  window.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'success' })
    })
  );

  // Мок для localStorage
  window.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };

  // Мок для setTimeout/setInterval если нужно
  window.setTimeout = jest.fn((fn) => fn());
  window.setInterval = jest.fn();
}
```

## Лучшие практики

### 1. Изоляция тестов
```javascript
// Всегда очищайте состояние между тестами
afterEach(() => {
  // Сброс всех состояний
  window.testHelpers.setGenerating(false);
  window.testHelpers.setError(false);
  // Сброс модальных окон, если есть
});
```

### 2. Использование данных из реальных сценариев
```javascript
// Используйте реальные данные для более точного тестирования
const realErrorMessages = [
  "We're having trouble connecting to the model provider.",
  "Rate limit exceeded. Please try again later.",
  "Connection timeout occurred.",
];

realErrorMessages.forEach(message => {
  test(`should handle error: ${message}`, () => {
    window.testHelpers.setError(true, message);
    expect(checkErrorOrResumeButtons()).toBeTruthy();
  });
});
```

### 3. Тестирование граничных случаев
```javascript
// Тестирование необычных состояний
test('should handle simultaneous generating and error states', () => {
  window.testHelpers.setGenerating(true);
  window.testHelpers.setError(true, 'Unexpected error during generation');

  // Проверка поведения в противоречивом состоянии
  const result = detectGenerationStatus();
  expect(['error', 'generating', 'conflicted']).toContain(result);
});
```

## Отладка и траблшутинг

### Проблема: Элементы не находятся
```javascript
// Диагностика селекторов
console.log('Available elements:');
console.log('Generating text:', document.querySelector('.generating-text'));
console.log('Error message:', document.querySelector('.error-message'));
console.log('Resume button:', document.querySelector('.resume-button'));

// Проверка структуры DOM
console.log('DOM structure:', document.body.innerHTML);
```

### Проблема: testHelpers недоступен
```javascript
// Проверка загрузки скрипта
if (typeof window.testHelpers === 'undefined') {
  console.error('testHelpers not loaded. Check if window-minimal.html loaded correctly.');
  // Принудительная загрузка
  eval(document.querySelector('script').textContent);
}
```

### Проблема: Функции cursor-auto-resume.js недоступны
```javascript
// Проверка загрузки основного скрипта
if (typeof isGeneratingTextPresent === 'undefined') {
  console.log('cursor-auto-resume.js functions not available globally');
  console.log('This is expected if functions are in IIFE');
  // Используйте альтернативные методы тестирования
}
```

## Заключение

Файл `window-minimal.html` предоставляет мощный и гибкий инструмент для разработки и тестирования `cursor-auto-resume.js`. Он значительно ускоряет процесс разработки, обеспечивая быструю обратную связь и простоту отладки.

Для получения дополнительной информации см.:
- [README-window-minimal.md](./README-window-minimal.md) - техническая документация
- [../tests/integration-tests.test.js](../tests/integration-tests.test.js) - примеры использования в тестах
- [../cursor-auto-resume.js](../cursor-auto-resume.js) - основной скрипт