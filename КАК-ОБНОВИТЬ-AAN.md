# Как обновить сервер AAN

## Каждый день
1. Правлю как обычно.
2. Правки одобрены → `git add .` → `git commit -m "что сделал"` → `git push`

## Когда нужно обновить AAN
3. Собрать zip — **один** из вариантов:
   - **Mac:** двойной клик по `tools/build-aan-zip.command` в Finder
   - **Терминал (Mac):** `python3 tools/build-aan-zip.py`
   - **Терминал (Windows):** `python tools/build-aan-zip.py`
   - или просто сказать Claude: «собери zip для AAN»
4. Zip появится **рядом с папкой проекта**: `AAN_Gen11_review_build_ДАТА.zip`
5. Plesk → `httpdocs › previews › aan_reseller_2026`
   → **+** загрузить zip → **Extract** (с заменой) → удалить zip
6. Открыть страницу с **Ctrl+F5** / **Cmd+Shift+R** (сервер долго держит кеш)

## Что важно помнить
- В zip попадает только **закоммиченное**.
- Инструмент заметок (Notes) **не** в моей версии — скрипт берёт его сам из ветки `aan-review`.
- Заметки команды живут в базе `mockupdb.allautonetwork.com`, не в файлах.
  Перезаливка zip их **не стирает**.
- Ссылка для команды: https://www.allautonetwork.com/previews/aan_reseller_2026/
