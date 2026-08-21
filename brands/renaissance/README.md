# Renaissance / YADRO ПДС — HTML templates

Шаблоны отчёта **Ренессанс Накопления / YADRO ПДС**.

## Структура

```text
brands/renaissance/
  cover.html
  pension-*.html / capital-*.html / flat-*.html / ...
  tail-01…tail-12.html   # общий хвост
  shell.css
  assets/
  MANIFEST.md
```

## Геометрия

- Холст: **595×842**
- Корень листа: `<div class="page">`
- Общий каркас: `shell.css` (Open Sans)

## Сборка логики отчёта (на бэкенде)

1. `cover.html`
2. страницы цели (pension / capital / flat / passive / child / moon)
3. общий хвост `tail-01…tail-12`

Партнёру достаточно править HTML/CSS; маршрутизацию целей делает backend.

## Данные

Плейсхолдеры `{{snake_case}}`. Документация ключей — в HTML-комментарии в начале каждого файла и в `MANIFEST.md`.

## Типичные правки

| Задача | Куда |
|--------|------|
| Бренд-цвета / shell | `shell.css` |
| Обложка | `cover.html`, `assets/Cover_sea.png` |
| Пенсия | `pension-01…03` |
| Общий хвост | `tail-*.html` |
| Лого фондов | `assets/*`, `tail-04-funds.html` |

## Проверка

```bash
node scripts/check-templates.js
```
