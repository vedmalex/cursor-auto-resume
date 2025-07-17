# Window Minimal HTML - Документация

## Назначение

Файл `window-minimal.html` представляет собой упрощенную версию полной структуры окна Cursor AI Chat (`window.00.html`), содержащую только самые важные элементы, необходимые для тестирования скрипта `cursor-auto-resume.js`.

## Основные компоненты

### 1. Контейнер чата
```html
<div id="workbench.panel.aichat.86891061-2048-496c-80bb-25d100b145e0" class="composite auxiliarybar">
```
- **Назначение**: Основной контейнер интерфейса AI Chat
- **ID**: Соответствует реальному ID из полной версии
- **Тестирование**: Используется скриптом для определения контекста

### 2. Селекторы моделей и режимов
```html
<!-- Model/Agent Selector -->
<select id="model-selector">
    <option value="gemini-2.5-flash">gemini-2.5-flash</option>
    <!-- ... другие модели ... -->
</select>

<!-- Mode Selector -->
<div class="mode-selector">
    <button data-mode="UNIVERSAL">UNIVERSAL</button>
    <button data-mode="STEADILY">STEADILY</button>
    <!-- ... другие режимы ... -->
</div>
```
- **Назначение**: Выбор AI модели и режима работы
- **Тестирование**: Проверка переключения между различными конфигурациями

### 3. Индикаторы генерации (ключевые для cursor-auto-resume.js)
```html
<div class="generation-status">
    <span class="generating-text">Generating...</span>
    <div class="generating-indicator"></div>
    <div class="full-input-box-generating"></div>
</div>
```
- **Назначение**: Отображение состояния генерации ответа
- **Классы**:
  - `.generating-text` - текстовый индикатор
  - `.generating-indicator` - визуальный индикатор
  - `.full-input-box-generating` - индикатор состояния поля ввода
- **Тестирование**: Основные элементы для функции `isGeneratingTextPresent()`

### 4. Сообщения об ошибках
```html
<div class="message error-message hidden">
    <span class="error-text">Error occurred during generation</span>
    <button class="resume-button button">Resume</button>
    <button class="retry-button button">Retry</button>
</div>
```
- **Назначение**: Отображение ошибок и кнопок восстановления
- **Тестирование**: Проверка функции `checkErrorOrResumeButtons()`

### 5. Область ввода
```html
<textarea class="inputarea monaco-mouse-cursor-text chat-input"
          placeholder="Ask AI anything..."></textarea>
```
- **Назначение**: Основное поле ввода пользователя
- **Классы**: Соответствуют реальным классам Monaco Editor
- **Тестирование**: Проверка взаимодействия с полем ввода

### 6. Кнопки управления
```html
<button class="send-button button">Send</button>
<button class="stop-button button hidden">Stop</button>
<button class="clear-button button">Clear</button>
```
- **Назначение**: Управление отправкой и остановкой генерации
- **Тестирование**: Проверка состояний кнопок в разных режимах

## Test Helpers API

Файл включает JavaScript API для симуляции различных состояний:

### `window.testHelpers.setGenerating(isGenerating)`
```javascript
// Включить состояние генерации
window.testHelpers.setGenerating(true);

// Выключить состояние генерации
window.testHelpers.setGenerating(false);
```

### `window.testHelpers.setError(hasError, errorMessage)`
```javascript
// Показать ошибку
window.testHelpers.setError(true, "Connection timeout");

// Скрыть ошибку
window.testHelpers.setError(false);
```

### `window.testHelpers.setMode(mode)`
```javascript
// Установить режим UNIVERSAL
window.testHelpers.setMode("UNIVERSAL");

// Установить режим STEADILY
window.testHelpers.setMode("STEADILY");
```

### `window.testHelpers.setModel(model)`
```javascript
// Выбрать модель
window.testHelpers.setModel("gemini-2.5-flash");
```

## Использование в тестах

### Unit тесты
```javascript
// Загрузка HTML в тестовую среду
const fs = require('fs');
const html = fs.readFileSync('html/window-minimal.html', 'utf8');
document.body.innerHTML = html;

// Тестирование функций cursor-auto-resume.js
const isGenerating = isGeneratingTextPresent();
expect(isGenerating).toBe(true);
```

### Integration тесты
```javascript
// Симуляция различных состояний
window.testHelpers.setGenerating(true);
window.testHelpers.setError(false);

// Проверка реакции скрипта
const status = detectGenerationStatus();
expect(status).toBe("generating");
```

### E2E тесты (если используется Playwright/Puppeteer)
```javascript
// Загрузка страницы
await page.goto('file://' + path.resolve('html/window-minimal.html'));

// Симуляция действий пользователя
await page.click('.send-button');
await page.waitForSelector('.generating-text');
```

## Ключевые отличия от полной версии

### Удалено:
- ❌ Большая часть стилей VSCode/Monaco
- ❌ Сложная структура компонентов
- ❌ Множественные вложенные элементы
- ❌ Неиспользуемые data-атрибуты
- ❌ Избыточная разметка

### Сохранено:
- ✅ Основные ID и классы для тестирования
- ✅ Структура сообщений чата
- ✅ Индикаторы состояния генерации
- ✅ Элементы управления (кнопки, селекторы)
- ✅ Поля ввода и их атрибуты
- ✅ Сообщения об ошибках

## Размер файла

- **Полная версия** (`window.00.html`): ~4.1MB
- **Минимальная версия** (`window-minimal.html`): ~8KB
- **Сокращение**: 99.8%

## Совместимость

Минимальная версия полностью совместима с:
- ✅ `cursor-auto-resume.js` (все функции)
- ✅ Существующими unit тестами
- ✅ Существующими integration тестами
- ✅ Bun test framework
- ✅ Happy-DOM и JSDOM

## Расширение

При необходимости добавления новых элементов для тестирования:

1. Определите минимальную HTML структуру
2. Добавьте соответствующие классы/ID
3. Обновите `testHelpers` API
4. Добавьте документацию в этот файл