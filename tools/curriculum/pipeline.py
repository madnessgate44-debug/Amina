"""Amina curriculum pipeline: ministry PDFs -> light hostable books + real structure."""
import fitz, io, os, re, json, unicodedata, warnings, base64, urllib.request, time
from PIL import Image, ImageChops
warnings.filterwarnings('ignore')

WIDTH, QUALITY = 1500, 82
OUT = os.environ.get('AMINA_BOOKS_DIR', 'books')
ENV = os.environ.get('AMINA_ENV_FILE', os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

def _load_key():
    """Read the Gemini key from the env file, falling back to the process env."""
    try:
        return re.search(r'GEMINI_API_KEY=(\S+)', open(ENV).read()).group(1)
    except (OSError, AttributeError):
        key = os.environ.get('GEMINI_API_KEY')
        if not key:
            raise SystemExit(f'No GEMINI_API_KEY found in {ENV} or the environment.')
        return key

KEY = _load_key()

# (pdf file, book id, subject, language, term)
STUDENT_BOOKS = [
 ('Arabic_G5_-_SB_-_T1.pdf',                     'arabic-g5-t1',      'arabic',       'ar', 1),
 ('Arabic_G5-_SB-T2.pdf',                        'arabic-g5-t2',      'arabic',       'ar', 2),
 ('P5T1_STB_SE_AR_5.8.22.pdf',                   'science-g5-t1-ar',  'science',      'ar', 1),
 ('P5T2_STB_SE_AR.pdf',                          'science-g5-t2-ar',  'science',      'ar', 2),
 ('P5T1_STB_SE_EN_4.8.22.pdf',                   'science-g5-t1-en',  'science',      'en', 1),
 ('P5T2_STB_SE_EN.pdf',                          'science-g5-t2-en',  'science',      'en', 2),
 ('P5T1_MTB_SE_AR_4.8.22.pdf',                   'math-g5-t1-ar',     'math',         'ar', 1),
 ('P5T1_MTB_SE_EN_4.8.22.pdf',                   'math-g5-t1-en',     'math',         'en', 1),
 ('drasat_5prim_T1.pdf',                         'social-g5-t1',      'social',       'ar', 1),
 ('Egypt-York-NGL-CS-Ar-TB-Gr.5-Term_2_Low_Secured.pdf','social-g5-t2','social',      'ar', 2),
 ('Connect_5Prim.pdf',                           'english-g5-t1',     'english',      'en', 1),
 ('Egy-Connect-Prim-En-G5-SB-T2-Low-secured.pdf','english-g5-t2',     'english',      'en', 2),
 ('Egypt-York-NGL-ICT-AR-SB-Gr.5-Term_1.pdf',    'ict-g5-t1-ar',      'ict',          'ar', 1),
 ('Egypt-York-NGL-ICT-AR-SB-Gr.5-T2.pdf',        'ict-g5-t2-ar',      'ict',          'ar', 2),
 ('Egypt-York-NGL-ICT-EN-SB-Gr.5-T2.pdf',        'ict-g5-t2-en',      'ict',          'en', 2),
 ('computer_prim5_t1_E.pdf',                     'ict-g5-t1-en',      'ict',          'en', 1),
 ('Islamy_G5_-_SB_-_T1.pdf',                     'islamic-g5-t1',     'islamic',      'ar', 1),
 ('Islamic_G5-T2-SB.pdf',                        'islamic-g5-t2',     'islamic',      'ar', 2),
 ('Christian_G5_-_SB_-_T1.pdf',                  'christian-g5-t1',   'christian',    'ar', 1),
 ('cristian_G5-sb-T2.pdf',                       'christian-g5-t2',   'christian',    'ar', 2),
 ('moral_5prim_t1__SB.pdf',                      'morals-g5-t1',      'morals',       'ar', 1),
 ('moral_5prim_t2__SB.pdf',                      'morals-g5-t2',      'morals',       'ar', 2),
 ('professional_skills_5prime_t1.pdf',           'profskills-g5-t1',  'profskills',   'ar', 1),
 ('Arabic_Calligraphy_G5_FINAL.pdf',             'calligraphy-g5',    'calligraphy',  'ar', 1),
]

def clean(t):
    t = unicodedata.normalize('NFKC', t)
    t = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', ' ', t)
    t = re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]', '', t)
    return re.sub(r'\u0640', '', t)

def crop_white(im, tol=248):
    bg = Image.new('RGB', im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg).convert('L').point(lambda p: 255 if p < tol else 0)
    bbox = diff.getbbox()
    if not bbox: return im
    l, t, r, b = bbox; pad = 8
    return im.crop((max(0,l-pad), max(0,t-pad), min(im.width,r+pad), min(im.height,b+pad)))

def render(page, width=WIDTH):
    z = width / page.rect.width
    pm = page.get_pixmap(matrix=fitz.Matrix(z, z), colorspace=fitz.csRGB)
    im = Image.frombytes('RGB', (pm.width, pm.height), pm.samples)
    try: im = crop_white(im)
    except Exception: pass
    return im

def vision(img_b64, prompt, model='gemini-2.5-flash', tries=4):
    """Vision call with real retry/backoff. Returns (text, err)."""
    payload = {"contents":[{"role":"user","parts":[{"text":prompt},
        {"inlineData":{"mimeType":"image/jpeg","data":img_b64}}]}],
        "generationConfig":{"temperature":0,"responseMimeType":"application/json"}}
    delay = 8
    for a in range(tries):
        try:
            req = urllib.request.Request(
                f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                data=json.dumps(payload).encode(),
                headers={"x-goog-api-key":KEY,"Content-Type":"application/json"})
            with urllib.request.urlopen(req, timeout=180) as r:
                j = json.loads(r.read())
            if 'error' in j:
                raise RuntimeError(j['error'].get('message', str(j['error']))[:150])
            return j['candidates'][0]['content']['parts'][0]['text'], None
        except Exception as e:
            msg = str(e)
            if a == tries - 1:
                return None, msg[:200]
            time.sleep(delay)
            delay = min(delay * 2, 60)
    return None, 'exhausted'

TOC_PROMPT = ('This is a page from an Egyptian Grade 5 school book. If it is a table of '
  'contents (or contains unit/lesson lists), extract it as JSON: '
  '{"units":[{"unit":"...","lessons":[{"title":"...","page":N}]}]}. '
  'Use the exact printed titles in the book language. Use null for a missing page. '
  'If this page has no table of contents, return {"units":[]}. Return JSON only.')

def extract_structure(pdf, lang, scan=(2, 3, 4, 5)):
    """
    Structure comes from the book's own text layer, which is deterministic and
    costs nothing. The vision model is only a last resort, because the API is
    quota-limited and a quota failure must never block a book.
    """
    try:
        from toc import parse_toc
        r = parse_toc(pdf)
        if r["units"] and r["confidence"] in ("high", "low"):
            return r["units"], 0, None
    except Exception as e:
        pass

    # Fallback: vision, only if the text layer yielded nothing.
    d = fitz.open(pdf)
    found, scanned, last_err = [], 0, None
    for pi in scan:
        if pi >= d.page_count or found: continue
        z = 1300 / d[pi].rect.width
        pm = d[pi].get_pixmap(matrix=fitz.Matrix(z, z), colorspace=fitz.csRGB)
        im = Image.frombytes('RGB', (pm.width, pm.height), pm.samples)
        b = io.BytesIO(); im.save(b, 'JPEG', quality=85)
        scanned += 1
        out, err = vision(base64.b64encode(b.getvalue()).decode(), TOC_PROMPT)
        if err:
            last_err = err
            if '429' in err or 'Too Many' in err:
                break          # rate limited: stop scanning, report it
            continue
        try:
            j = json.loads(out)
            if j.get('units'):
                found = j['units']
                break
        except Exception as e:
            last_err = str(e)[:150]
    d.close()
    return found, scanned, last_err

def convert(pdf, bid, subject, lang, term, do_structure=True):
    doc = fitz.open(pdf)
    bdir = os.path.join(OUT, bid); pdir = os.path.join(bdir, 'pages')
    os.makedirs(pdir, exist_ok=True)
    m = {'id': bid, 'subject': subject, 'language': lang, 'term': term,
         'source': os.path.basename(pdf), 'pages': doc.page_count,
         'width': WIDTH, 'quality': QUALITY, 'index': []}
    total = 0
    for i in range(doc.page_count):
        im = render(doc[i])
        b = io.BytesIO(); im.save(b, 'WEBP', quality=QUALITY, method=6)
        data = b.getvalue(); total += len(data)
        fn = f'{i+1:04d}.webp'
        open(os.path.join(pdir, fn), 'wb').write(data)
        m['index'].append({'p': i+1, 'f': fn, 'w': im.width, 'h': im.height,
                           'kb': round(len(data)/1024)})
    m['bytes'] = total
    if do_structure:
        units, scanned, err = extract_structure(pdf, lang)
        m['units'] = units; m['tocScanned'] = scanned
        m['structureStatus'] = 'ok' if units else ('failed' if err else 'not_found')
        if err: m['structureError'] = err
    doc.close()
    json.dump(m, open(os.path.join(bdir,'manifest.json'),'w'), ensure_ascii=False, indent=1)
    return m

if __name__ == '__main__':
    import sys
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    for pdf, bid, subj, lang, term in STUDENT_BOOKS:
        if only and bid not in only: continue
        if not os.path.exists(f'pdfs/{pdf}'):
            print(f'MISSING {pdf}', flush=True); continue
        try:
            m = convert(f'pdfs/{pdf}', bid, subj, lang, term)
            print(f"{bid:22s} {m['pages']:4d}p {m['bytes']/1024/1024:6.1f}MB "
                  f"units={len(m.get('units',[]))} {m.get('structureStatus')}"
                  f"{' ' + str(m.get('structureError'))[:60] if m.get('structureError') else ''}",
                  flush=True)
        except Exception as e:
            print(f'{bid} FAILED {e}', flush=True)
    print('PIPELINE DONE', flush=True)
