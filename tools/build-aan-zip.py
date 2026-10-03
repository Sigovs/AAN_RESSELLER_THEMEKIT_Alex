#!/usr/bin/env python3
"""Build the AAN review-server zip from the committed main.

    python tools/build-aan-zip.py            # zip from HEAD of the current branch
    python tools/build-aan-zip.py --ref main # or name the commit to build from

What it does, and what it never does:

  0. Refuses to build when the tree is dirty or behind origin, because both
     produce a zip that looks right and is not. --force overrides.
  1. Exports the committed tree (git archive) into a temp folder. Uncommitted
     edits are NOT in the zip: commit what was approved first.
  2. Lays the AAN overlay over it, read straight from the `aan-review` branch
     (origin's copy when there is one): the notes tool, the comments sheet and
     the AAN dashboard, which becomes index.html.
  3. Adds the notes <script> tag to the ten Gen 11 pages.
  4. Keeps only what the dashboard, the comments sheet and the ten pages reach,
     and writes AAN_Gen11_review_build_<date>.zip next to the repo folder.

Your working folder is never switched, touched or changed. Upload the zip to
httpdocs/previews/aan_reseller_2026 in Plesk, extract it there over the old
files, then delete the zip from the server.
"""
import argparse
import datetime
import io
import os
import posixpath
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import zipfile

OVERLAY = ['pages/_aan-notes.js', 'comments.html', 'aan/index.html']
NOTES_TAG = ('<!-- team review notes: one self-contained layer, appended to <body>, in a shadow root.\n'
             '     It adds no rule to the page and no box to its layout. -->\n'
             '<script src="../_aan-notes.js?v={v}" defer></script>')
# folders a page loads from JavaScript, by name, where a crawl cannot see them
WHOLE_DIRS = ['pages/dealer/img', 'pages/dealer/video', 'ds/fonts']
LINK = re.compile(r'''(?:src|href|poster)\s*=\s*["']([^"'#?]+)|url\(\s*["']?([^"')#?]+)|["']([^"'\s<>()+]+\.(?:css|js|json|jpe?g|png|webp|svg|woff2?|gif|avif|mp4|glb|html))["']''', re.I)


def git(*args, cwd, binary=False):
    r = subprocess.run(['git', *args], cwd=cwd, capture_output=True)
    if r.returncode:
        sys.exit('git %s failed:\n%s' % (' '.join(args), r.stderr.decode(errors='replace')))
    return r.stdout if binary else r.stdout.decode()


def export(ref, dest, repo, paths=()):
    data = git('archive', '--format=tar', ref, *paths, cwd=repo, binary=True)
    with tarfile.open(fileobj=io.BytesIO(data)) as t:
        t.extractall(dest, filter='data') if sys.version_info >= (3, 12) else t.extractall(dest)


def check_tree(repo, ref, force):
    """Stop before building a zip that does not hold what the builder thinks it does.

    Two failures, both otherwise silent, both of which cost an hour because the
    build, the upload and the page all succeed — they just show the wrong thing,
    which reads as a caching problem and is not one:

      · the zip is cut from the COMMITTED tree, so an uncommitted edit is simply
        absent from it;
      · a machine that has not pulled builds from a tree older than GitHub's, so
        work done on the other machine looks as though it vanished.

    The messages are in Russian and name the command to run, because they are
    read by the person double-clicking the .command file, not by a developer.
    """
    stop = []

    if ref == 'HEAD':
        dirty = git('status', '--porcelain', '--untracked-files=no', cwd=repo).strip()
        if dirty:
            stop.append(
                'СТОП: есть незакоммиченные правки (файлов: %d).\n'
                '      В zip попадает только закоммиченное — этих правок в нём не будет.\n'
                '      Сделай:  git add -A  &&  git commit -m "что сделал"  &&  git push\n\n'
                '      Не вошло бы:\n%s'
                % (len(dirty.splitlines()),
                   '\n'.join('        ' + l for l in dirty.splitlines()[:12])))

    branch = git('rev-parse', '--abbrev-ref', 'HEAD', cwd=repo).strip()
    if branch == 'HEAD':
        print('Внимание: detached HEAD, ветку с GitHub не с чем сравнить.\n')
    else:
        fetched = subprocess.run(['git', 'fetch', '-q', 'origin', branch],
                                 cwd=repo, capture_output=True)
        if fetched.returncode:
            # Being offline must not block a build. Say so and carry on.
            print('Внимание: не достучался до GitHub, не могу проверить отставание.\n'
                  '          Собираю из того, что есть локально.\n')
        else:
            counts = subprocess.run(['git', 'rev-list', '--left-right', '--count', 'HEAD...FETCH_HEAD'],
                                    cwd=repo, capture_output=True)
            if counts.returncode == 0:
                ahead, behind = (int(x) for x in counts.stdout.decode().split())
                if behind:
                    stop.append(
                        'СТОП: на GitHub есть %d коммит(ов), которых тут нет.\n'
                        '      Скорее всего это работа с другой машины — в zip она не попадёт.\n'
                        '      Сделай:  git pull'
                        % behind)
                if ahead and not behind:
                    # Not an error: you may build before pushing. But the other
                    # machine will not have what this zip carries.
                    print('Внимание: %d коммит(ов) ещё не на GitHub. Zip их включит,\n'
                          '          но на другой машине их не будет, пока не сделаешь git push.\n' % ahead)

    if stop:
        msg = '\n\n'.join(stop)
        if force:
            print('─' * 70 + '\n' + msg + '\n\n--force: собираю всё равно.\n' + '─' * 70 + '\n')
            return
        sys.exit('\n' + '─' * 70 + '\n' + msg + '\n' + '─' * 70 +
                 '\n\nZip не собран. Почини это и запусти снова'
                 ' (или --force, если точно знаешь, что делаешь).')

    print('Проверка: дерево чистое, с GitHub совпадает.\n')


def main():
    # the messages are in Russian; a Windows console defaults to cp1252 and
    # would crash on the first one
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding='utf-8', errors='replace')
        except (AttributeError, ValueError):
            pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--ref', default='HEAD', help='commit to build the pages from (default: HEAD)')
    ap.add_argument('--out', help='zip path (default: next to the repo folder)')
    ap.add_argument('--force', action='store_true',
                    help='build even with uncommitted changes or a tree behind origin')
    a = ap.parse_args()

    repo = git('rev-parse', '--show-toplevel', cwd=os.getcwd()).strip()
    origin = git('remote', 'get-url', 'origin', cwd=repo).strip()
    if 'Sigovs/AAN_RESSELLER_THEMEKIT_Alex' not in origin:
        sys.exit('This is not the Sigovs repo (%s). Stopping.' % origin)

    check_tree(repo, a.ref, a.force)

    subprocess.run(['git', 'fetch', '-q', 'origin', 'aan-review:refs/remotes/origin/aan-review'], cwd=repo, capture_output=True)
    overlay_ref = 'origin/aan-review'
    if subprocess.run(['git', 'rev-parse', '-q', '--verify', overlay_ref], cwd=repo, capture_output=True).returncode:
        overlay_ref = 'aan-review'
    if subprocess.run(['git', 'rev-parse', '-q', '--verify', overlay_ref], cwd=repo, capture_output=True).returncode:
        sys.exit('No aan-review branch found, locally or on origin. Run: git fetch origin')


    ref_name = git('rev-parse', '--short', a.ref, cwd=repo).strip()
    stamp = datetime.datetime.now().strftime('%Y%m%d%H%M')
    tmp = tempfile.mkdtemp(prefix='aan-zip-')
    try:
        export(a.ref, tmp, repo)
        export(overlay_ref, tmp, repo, OVERLAY)
        shutil.move(os.path.join(tmp, 'aan', 'index.html'), os.path.join(tmp, 'index.html'))

        pages = sorted('pages/%s/%s' % (d, f) for d in ('dealer', 'staff')
                       for f in os.listdir(os.path.join(tmp, 'pages', d)) if f.endswith('-gen11.html'))
        for p in pages:
            fp = os.path.join(tmp, p)
            s = open(fp, encoding='utf-8').read()
            if '_aan-notes.js' not in s:
                s = s.replace('</body>', NOTES_TAG.format(v=stamp) + '\n</body>', 1)
                open(fp, 'w', encoding='utf-8', newline='\n').write(s)

        # keep what the entry points reach
        keep, todo, missing = set(), ['index.html', 'comments.html'] + pages, set()
        while todo:
            f = todo.pop()
            if f in keep:
                continue
            fp = os.path.join(tmp, f)
            if not os.path.isfile(fp):
                missing.add(f)
                continue
            keep.add(f)
            if not f.endswith(('.html', '.css', '.js')):
                continue
            for m in LINK.finditer(open(fp, encoding='utf-8', errors='ignore').read()):
                u = next(g for g in m.groups() if g)
                if re.match(r'^(https?:|//|data:|mailto:|tel:|javascript:|#)', u):
                    continue
                q = posixpath.normpath(posixpath.join(posixpath.dirname(f), u))
                if not q.startswith('..'):
                    todo.append(q)
        for d in WHOLE_DIRS:
            for base, _, files in os.walk(os.path.join(tmp, d)):
                for x in files:
                    keep.add(os.path.relpath(os.path.join(base, x), tmp).replace(os.sep, '/'))
        keep = {k for k in keep if not k.endswith('.md') and not k.startswith('aan/')}

        out = a.out or os.path.join(os.path.dirname(repo), 'AAN_Gen11_review_build_%s.zip' % stamp[:8])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for k in sorted(keep):
                z.write(os.path.join(tmp, k), k)

        must = ['index.html', 'comments.html', 'pages/_aan-notes.js'] + pages
        lost = [m for m in must if m not in keep]
        if lost:
            sys.exit('Zip is missing required files: %s' % ', '.join(lost))
        size = os.path.getsize(out) / 1e6
        print('Built from %s + %s overlay' % (ref_name, overlay_ref))
        print('%d files, %.1f MB -> %s' % (len(keep), size, out))
        print('Upload to httpdocs/previews/aan_reseller_2026, Extract (replace files), delete the zip.')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
