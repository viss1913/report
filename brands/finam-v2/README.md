# Finam Report v2 — HTML templates

Партнёрский комплект вёрстки **Finam Report v2**.

## Структура

```text
brands/finam-v2/
  page-*.html          # страницы отчёта
  tokens.css           # цвета / типографика
  page-wow-shared.css  # общие стили части страниц
  assets/              # картинки
  MANIFEST.md          # список файлов и data-field
```

## Геометрия

- Холст страницы: **595×842**
- Корень листа: `<article class="finam-v2-page">`
- В одном HTML может быть несколько `article` (многостраничный шаблон)

## Данные

Бэкенд подставляет значения через:

- `data-finam-v2-field="..."` — замена элемента целиком
- `data-finam-v2-block="..."` — замена крупного блока (график, грид)

**Не переименовывайте** эти атрибуты.

Демо-цифры в HTML нужны для превью в браузере; в production PDF их заменит applier.

## Типичные правки

| Задача | Куда смотреть |
|--------|----------------|
| Цвета бренда | `tokens.css` |
| Обложка | `page-cover-v2.html` |
| Введение / текущее состояние | `page-intro-v2.html`, `page-current-state-v2.html` |
| Страницы целей | `page-goal-*-v2.html` |
| Хвост (Comon, ДУ, риски…) | `page-comon-*`, `page-idu-*`, `page-risk-*`, … |

## Проверка

```bash
node scripts/check-templates.js
```

Откройте изменённый HTML в Chrome и убедитесь, что лист не обрезается.

## Для ИИ

См. корневые `AGENTS.md` и `.cursor/skills/pfp-report-templates/SKILL.md`.
