# PFP Report Templates

Репозиторий **HTML-шаблонов PDF-отчётов** для партнёров PFP.

Здесь нет бэкенда и калькуляторов — только вёрстка, которую партнёр (или его ИИ-агент) может:

1. скачать / форкнуть;
2. поправить цвета, тексты, блоки, ассеты;
3. отправить обратно **новой веткой / Pull Request**;
4. команда PFP вмержит и подключит шаблон к production-генерации PDF.

Репозиторий: https://github.com/viss1913/report

---

## Бренды

| Папка | Партнёр / продукт | Как бэкенд подставляет данные |
|-------|-------------------|------------------------------|
| [`brands/finam-v2/`](brands/finam-v2/) | Финам (Report v2) | `data-finam-v2-field` / `data-finam-v2-block` |
| [`brands/rostech/`](brands/rostech/) | Ростех НПФ | `{{placeholders}}` |
| [`brands/renaissance/`](brands/renaissance/) | Ренессанс / YADRO ПДС | `{{placeholders}}` |

У каждого бренда есть свой `README.md` и `MANIFEST.md`.

---

## Быстрый старт для партнёра

```bash
git clone https://github.com/viss1913/report.git
cd report
git checkout -b partner/<your-brand>-<short-change>
```

Правите только свой бренд, например:

```text
brands/finam-v2/**
```

Проверка перед PR:

```bash
node scripts/check-templates.js
```

Откройте изменённый HTML в Chrome и убедитесь, что страница **595×842** не обрезается.

---

## Правила (коротко)

**Можно**

- менять CSS, цвета, шрифты, отступы;
- менять статичный маркетинговый текст;
- заменять логотипы / фото в `assets/`;
- добавлять декоративные блоки **без** привязки к данным клиента.

**Нельзя без согласования с PFP**

- удалять или переименовывать `data-finam-v2-field` / `data-finam-v2-block`;
- удалять или переименовывать `{{placeholders}}`;
- ломать размер страницы `595×842` и класс корня страницы (`.finam-v2-page` / `.page`);
- менять имена файлов страниц из манифеста;
- коммитить секреты, JWT, клиентские ПДн.

Подробности: [`docs/PARTNER_GUIDE.md`](docs/PARTNER_GUIDE.md) и [`AGENTS.md`](AGENTS.md).

---

## Для ИИ-агентов партнёра

Если правки делает Cursor / Claude / другой агент:

1. Прочитайте [`AGENTS.md`](AGENTS.md).
2. Подключите скилл [`.cursor/skills/pfp-report-templates/SKILL.md`](.cursor/skills/pfp-report-templates/SKILL.md).
3. Работайте только внутри выбранного `brands/<brand>/`.
4. Перед сдачей запустите `node scripts/check-templates.js`.

Скилл написан так, чтобы агент **не ломал контракт данных** с бэкендом PFP.

---

## Как устроен контракт с бэкендом

```text
HTML-шаблон (этот репо)
        │
        ▼
loader: inline CSS/assets → physical A4 pages
        │
        ▼
applier: подставляет ФИО / суммы / цели
        │
        ▼
Puppeteer → PDF
```

- **Finam v2** — бэкенд ищет маркеры `data-finam-v2-field="..."` и целиком заменяет элемент.
- **Rostech / Renaissance** — бэкенд делает `{{key}} → значение` (неизвестные ключи → «—»).

Демо-цифры в HTML — это **preview mocks**. В production они заменяются реальными данными клиента.

---

## Workflow веток

| Ветка | Кто | Назначение |
|-------|-----|------------|
| `main` | PFP | стабильные шаблоны, готовые к интеграции |
| `partner/<brand>-<topic>` | партнёр | правки бренда |
| `pfp/sync-<brand>` | PFP | синхронизация из backend после прикрутки |

Пример имени ветки: `partner/finam-v2-cover-rebrand`.

---

## Локальный превью

Самый простой способ:

1. Откройте нужный `.html` в Chrome.
2. DevTools → включите device metrics / zoom так, чтобы видеть холст `595×842`.
3. Печать → A4 → без полей — футер и края не должны обрезаться.

Для Finam/Rostech production PDF масштаб `4/3` (595→794 CSS px) делает бэкенд; в шаблоне держите дизайн-холст **595×842**.

---

## Что дальше делает PFP

После merge PR команда:

1. копирует шаблоны в backend (`src/reports/...`);
2. при необходимости подправляет applier;
3. прогоняет smoke PDF на тестовом клиенте;
4. выкатывает на партнёрский project.

Этот репозиторий — **source of truth для вёрстки**, не для бизнес-логики расчётов.
