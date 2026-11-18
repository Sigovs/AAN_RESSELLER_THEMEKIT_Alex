"""Build handoff/aan-gen11-handoff.zip — the one-click download for the dev team: README, the two backend CSS
layers (light + dark), the fonts and DESIGN.md, read from the committed `handoff` branch.
    python tools/ds-check/handoff-zip.py        # then commit handoff/aan-gen11-handoff.zip
"""
import subprocess, zipfile, time, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
git = lambda *a: subprocess.check_output(['git', '-C', ROOT] + list(a))
fonts = git('ls-tree', '--name-only', 'handoff', 'handoff/fonts/').decode().split()
files = ['handoff/README.md', 'handoff/aan-gen11-theme.css', 'handoff/aan-gen11-components.css', 'DESIGN.md'] + fonts
out = os.path.join(ROOT, 'handoff', 'aan-gen11-handoff.zip')
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in files:
        name = 'aan-gen11-handoff/' + (f[len('handoff/'):] if f.startswith('handoff/') else f)
        zi = zipfile.ZipInfo(name, time.localtime()[:6]); zi.external_attr = 0o100644 << 16; zi.compress_type = zipfile.ZIP_DEFLATED
        z.writestr(zi, git('show', 'handoff:' + f))
print('written', out, len(files), 'files')
