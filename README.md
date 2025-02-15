# Исходный код Фронтенда на React.js
## Автор - Искрин Артём

## Остальной код, ссылки для тестирования и видео работы:
  • Swagger UI: [https://energy-monitor-fastapi-production.up.railway.app/docs](https://energy-monitor-fastapi-production.up.railway.app/docs)  
  • Пльзовательский сайт: [https://green-energy-reporter.netlify.app/](https://green-energy-reporter.netlify.app/)  
  • GitHub Бэкенда(API): [https://github.com/deprotate/energy-monitor-fastapi/tree/master](https://github.com/deprotate/energy-monitor-fastapi/tree/master)  
  • GitHub Wemos: [https://github.com/deprotate/wemos-energy-monitor](https://github.com/deprotate/wemos-energy-monitor)  
• Видео работы: [https://disk.yandex.ru/d/vQEiWjrruTO2ig](https://disk.yandex.ru/d/vQEiWjrruTO2ig)

## Немного о фронтенде
 **Фронтенд** – разработан на React.js; для визуализации данных используется Chart.js, а навигация реализована с помощью react-router-dom.
###  Подробное описание файлов фронтенда

####  Home.js

**Назначение:**  
Отображает сводную информацию о текущих показателях энергии в виде столбиковой диаграммы.

**Ключевые моменты:**
- Использование хука `useEffect` для получения данных при загрузке компонента.
- Получение данных происходит через GET-запрос к эндпоинту `/report/`.
- Диаграмма формируется с помощью Chart.js, а навигация осуществляется с использованием `react-router-dom`.

_Пример API-вызова из компонента Home.js:_  
```js
axios.get('https://energy-monitor-fastapi-production.up.railway.app/report/')
  .then(response => {
    // response.data: { "1": 47, "2": 35, "3": 12, "4": 0 }
  })
  .catch(error => console.error('Ошибка:', error));
```

---

#### ReportByDatePage.js

**Назначение:**  
Позволяет пользователю получить отчёт за заданный диапазон дат с возможностью группировки (по дням, месяцам, годам).

**Основной функционал:**
- Форма ввода дат и выбора группировки.
- Формирование URL запроса с использованием шаблонных строк (обратите внимание на завершающий слэш для корректного маршрута).
- Отправка GET-запроса через axios для получения отчёта.
- Логирование сформированного URL и полученных данных (с использованием `console.log`) для отладки.
- Различная логика формирования данных для графика в зависимости от того, пришёл ли ответ в виде плоского объекта (общий отчёт) или сгруппированного по периодам.

_Пример API-вызова из компонента ReportByDatePage.js:_  
```js
let url = `https://energy-monitor-fastapi-production.up.railway.app/report_by_date/?start_date=${startDate}&end_date=${endDate}`;
if (groupBy !== '') {
  url += `&group_by=${groupBy}`;
}
axios.get(url)
  .then(response => {
    // Обработка response.data для формирования графика
  })
  .catch(error => console.error('Ошибка получения отчёта:', error));
```
