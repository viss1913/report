# Rostech НПФ — HTML templates

Шаблоны отчёта **Ростех НПФ** (v2 templates).

## Структура

```text
brands/rostech/
  cover.html
  pension-*.html
  save-multiply-*.html
  css/style.css
  css/fonts.css
  fonts/
  assets/
  MANIFEST.md
```

## Геометрия

- Холст: **595×842**
- Корень листа: `<section class="page ...">`
- Общие стили: `css/style.css`

## Данные

Подстановка через `{{placeholders}}`, например:

```html
<p>{{client_name}}, Ваша будущая пенсия...</p>
```

Список ключей — в HTML-комментариях в начале файлов и в `MANIFEST.md`.

**Не переименовывайте** существующие ключи без согласования с PFP.

## Типичные правки

| Задача | Файл |
|--------|------|
| Обложка | `cover.html` + `assets/cover-bg.png` / `assets/logo.svg` |
| Цвета | `css/style.css` (`--color-accent` и др.) |
| Пенсия | `pension-01…04` |
| Накопление / save-multiply | `save-multiply-01…03` |

## Проверка

```bash
node scripts/check-templates.js
```
