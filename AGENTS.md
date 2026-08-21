# AGENTS.md — инструкции для ИИ-агентов

Этот файл обязаны прочитать Cursor / Claude / Codex / любой агент перед правкой шаблонов.

## Цель

Партнёр меняет **визуал и тексты** PDF-отчёта. Бэкенд PFP потом подставляет клиентские данные в заранее известные маркеры.

Если агент сломает маркеры — PDF в production покажет пустые поля или упадёт.

## Перед началом

1. Уточни бренд: `finam-v2` | `rostech` | `renaissance`.
2. Работай **только** в `brands/<brand>/`.
3. Прочитай:
   - `README.md`
   - `docs/PARTNER_GUIDE.md`
   - `brands/<brand>/README.md`
   - `brands/<brand>/MANIFEST.md`
   - skill: `.cursor/skills/pfp-report-templates/SKILL.md`

## Жёсткие запреты

- Не удаляй и не переименовывай:
  - `data-finam-v2-field="..."`
  - `data-finam-v2-block="..."`
  - `{{placeholder_name}}`
- Не меняй имена файлов из манифеста без явного запроса PFP.
- Не меняй размер страницы: **595×842 px**.
- Не убирай корневой класс страницы:
  - Finam: `article.finam-v2-page`
  - Rostech / Renaissance: `.page` (section или div)
- Не трогай другие бренды «заодно».
- Не добавляй backend JS, Node-сервисы, env, секреты, клиентские ПДн.
- Не «чисти» демо-цифры, если они стоят внутри data-field / placeholder — это мок для превью.

## Что можно менять свободно

- CSS / цвета / типографика / отступы
- статичный текст вне маркеров данных
- декоративные SVG / иконки / фото в `assets/`
- порядок визуальных блоков **если** маркеры данных сохранены
- тексты дисклеймеров (лучше согласовать юридически с партнёром)

## Контракты данных

### Finam (`brands/finam-v2`)

Бэкенд находит элемент по атрибуту и **заменяет весь элемент**:

```html
<div class="..." data-finam-v2-field="reserve-initial">300&nbsp;000 ₽</div>
```

Можно менять class/style внутри, **имя field оставить**.  
Для больших кусков (график, грид рисков) используется `data-finam-v2-block`.

Многостраничный файл = несколько `<article class="finam-v2-page">`.

### Rostech / Renaissance

```html
<p>Ваш доход - {{client_income_monthly}}</p>
```

- Синтаксис строго `{{snake_case}}`
- Неизвестные ключи на бэкенде станут «—»
- Новые ключи без согласования **не появятся** в PDF

Список ключей: `MANIFEST.md` бренда + `scripts/baseline.json`.

## Workflow агента

```text
1. git checkout -b partner/<brand>-<topic>
2. внести правки только в brands/<brand>/
3. node scripts/check-templates.js
4. визуально открыть изменённые HTML в браузере
5. кратко описать diff в PR (что изменилось визуально)
```

Если `check-templates.js` падает — **не предлагай** «просто убрать маркеры». Почини сохранением контракта.

## Чеклист перед сдачей

- [ ] `node scripts/check-templates.js` = OK
- [ ] не удалены field/block/placeholders
- [ ] страницы 595×842, overflow не режет футер
- [ ] ассеты по относительным путям `assets/...`
- [ ] нет секретов / персональных данных
- [ ] PR только по одному бренду

## Куда смотреть за деталями

| Тема | Файл |
|------|------|
| Партнёрский процесс | `docs/PARTNER_GUIDE.md` |
| Skill для Cursor | `.cursor/skills/pfp-report-templates/SKILL.md` |
| Baseline маркеров | `scripts/baseline.json` |
| Finam поля | `brands/finam-v2/MANIFEST.md` |
| Rostech плейсхолдеры | `brands/rostech/MANIFEST.md` |
| Renaissance плейсхолдеры | `brands/renaissance/MANIFEST.md` |
