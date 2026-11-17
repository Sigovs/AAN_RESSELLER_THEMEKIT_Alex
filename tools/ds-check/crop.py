"""Crop the catalogue reference shots: python tools/ds-check/crop.py handoff/catalog/ref"""
import glob, json, os, sys
from PIL import Image
d = sys.argv[1]
done, bad = 0, []
for src, dst, x, y, w, h in json.load(open(os.path.join(d, '_crops.json'))):
    try:
        im = Image.open(src); W, H = im.size
        box = (max(0, int(x)), max(0, int(y)), min(W, int(x + w)), min(H, int(y + h)))
        if box[2] <= box[0] or box[3] <= box[1]:
            bad.append((os.path.basename(dst), 'empty box %s' % (box,))); continue
        im.crop(box).save(dst); done += 1
    except Exception as e:
        bad.append((os.path.basename(dst), str(e)))
for f in glob.glob(os.path.join(d, '_*')): os.remove(f)
print('crops', done, 'problems', bad)
