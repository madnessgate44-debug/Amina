"""Convert ministry PDFs into light, hostable books + real lesson structure."""
import fitz, io, os, re, json, unicodedata, warnings, sys
from PIL import Image, ImageChops
warnings.filterwarnings('ignore')

WIDTH = 1100
QUALITY = 70
OUT = os.environ.get('AMINA_BOOKS_DIR', 'books')

def clean(t):
    t = unicodedata.normalize('NFKC', t)
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', ' ', t)
    t = re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]', '', t)
    t = re.sub(r'\u0640', '', t)
    return t

def crop_white(im, tol=248):
    bg = Image.new('RGB', im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg).convert('L').point(lambda p: 255 if p < tol else 0)
    bbox = diff.getbbox()
    if not bbox:
        return im
    pad = 8
    l, t, r, b = bbox
    l, t = max(0, l - pad), max(0, t - pad)
    r, b = min(im.width, r + pad), min(im.height, b + pad)
    return im.crop((l, t, r, b))

def render(page, width=WIDTH):
    z = width / page.rect.width
    pm = page.get_pixmap(matrix=fitz.Matrix(z, z), colorspace=fitz.csRGB)
    im = Image.frombytes('RGB', (pm.width, pm.height), pm.samples)
    try:
        im = crop_white(im)
    except Exception:
        pass
    return im

def extract_structure(doc, limit=24):
    """Find unit/lesson headings and anchor pages from front-matter TOC."""
    pat_unit = re.compile(r'المحور|الوحدة|\b(?:theme|unit|chapter|module)\b', re.I)
    pat_lesson = re.compile(r'الدرس|الموضوع|\blesson\b', re.I)
    entries = []
    for i in range(min(limit, doc.page_count)):
        for ln in clean(doc[i].get_text()).split('\n'):
            ln = re.sub(r'\.{3,}', ' ', ln).strip()
            ln = re.sub(r'\s+', ' ', ln)
            if len(ln) < 4 or len(ln) > 160:
                continue
            kind = 'lesson' if pat_lesson.search(ln) else ('unit' if pat_unit.search(ln) else None)
            if not kind:
                continue
            pg = re.search(r'(\d{1,3})\s*$', ln)
            title = re.sub(r'(\d{1,3})\s*$', '', ln).strip(' .:-')
            entries.append({'kind': kind, 'raw': ln, 'title': title,
                            'tocPage': i + 1,
                            'bookPage': int(pg.group(1)) if pg else None})
    return entries

def convert(pdf_path, book_id):
    doc = fitz.open(pdf_path)
    bdir = os.path.join(OUT, book_id)
    pdir = os.path.join(bdir, 'pages')
    os.makedirs(pdir, exist_ok=True)
    manifest = {'id': book_id, 'source': os.path.basename(pdf_path),
                'pages': doc.page_count, 'width': WIDTH, 'quality': QUALITY, 'index': []}
    total = 0
    for i in range(doc.page_count):
        im = render(doc[i])
        b = io.BytesIO()
        im.save(b, 'WEBP', quality=QUALITY, method=6)
        data = b.getvalue()
        total += len(data)
        name = f'{i+1:04d}.webp'
        with open(os.path.join(pdir, name), 'wb') as f:
            f.write(data)
        manifest['index'].append({'p': i + 1, 'f': name, 'w': im.width, 'h': im.height,
                                  'kb': round(len(data) / 1024)})
    manifest['structure'] = extract_structure(doc)
    manifest['bytes'] = total
    json.dump(manifest, open(os.path.join(bdir, 'manifest.json'), 'w'),
              ensure_ascii=False, indent=1)
    doc.close()
    return manifest

if __name__ == '__main__':
    pdf, bid = sys.argv[1], sys.argv[2]
    m = convert(f'pdfs/{pdf}', bid)
    print(f"{bid}: {m['pages']} pages, {m['bytes']/1024/1024:.1f} MB, "
          f"avg {m['bytes']/m['pages']/1024:.0f} KB, structure entries {len(m['structure'])}")
