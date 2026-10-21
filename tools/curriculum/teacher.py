"""Extract teacher-facing resources into Nour's knowledge base (text + structure)."""
import fitz, io, os, re, json, base64, urllib.request, time, unicodedata, warnings
from PIL import Image
warnings.filterwarnings('ignore')
from pipeline import vision, clean, TOC_PROMPT

OUT = os.environ.get('AMINA_TEACHER_DIR', 'teacher')
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

# (pdf, id, subject, kind)  kind: tg=teacher guide, fw=framework, as=assessment
TEACHER_RESOURCES = [
 ('Arabic_G5_-_TG_-_T1.pdf',            'arabic-g5-t1-tg',     'arabic',      'tg'),
 ('arabic_5prim_t2_TG.pdf',             'arabic-g5-t2-tg',     'arabic',      'tg'),
 ('P5T1_MTB_TE_AR_9.11.22.pdf',         'math-g5-t1-te-ar',    'math',        'tg'),
 ('P5T1_MTB_TE_EN_9.11.22.pdf',         'math-g5-t1-te-en',    'math',        'tg'),
 ('math_5prim_t2_TG.pdf',               'math-g5-t2-tg',       'math',        'tg'),
 ('Math_P5_TG_T2_EN.pdf',               'math-g5-t2-tg-en',    'math',        'tg'),
 ('P5T1_STB_TE_AR_31.10.22.pdf',        'science-g5-t1-te-ar', 'science',     'tg'),
 ('P5T1_STB_TE_EN_31.10.22.pdf',        'science-g5-t1-te-en', 'science',     'tg'),
 ('Islamy_G5_-_TG_-_T1.pdf',            'islamic-g5-t1-tg',    'islamic',     'tg'),
 ('Islamic_G5-TG-T2.pdf',               'islamic-g5-t2-tg',    'islamic',     'tg'),
 ('cristian_-TG-T2.pdf',                'christian-g5-t2-tg',  'christian',   'tg'),
 ('Moral_G5_-_TG_-_T1.pdf',             'morals-g5-t1-tg',     'morals',      'tg'),
 ('moral_5prim_t2__TG.pdf',             'morals-g5-t2-tg',     'morals',      'tg'),
 ('alrasm_5prim_TG.pdf',                'drawing-g5-t1-tg',    'drawing',     'tg'),
 ('Alrasm_5prim_term2_TG.pdf.pdf',      'drawing-g5-t2-tg',    'drawing',     'tg'),
 ('music_5prim_TG.pdf',                 'music-g5-t1-tg',      'music',       'tg'),
 ('music_5prim_TG_T2.pdf',              'music-g5-t2-tg',      'music',       'tg'),
 ('__20230831___________________________.pdf', 'tokkatsu-g5-tg', 'tokkatsu',   'tg'),
 ('P5T1_MTB_Assessment_Ancillary_AR.pdf','math-g5-t1-assessment-ar','math',   'as'),
 ('P5T1_MTB_Assessment_Ancillary_EN.pdf','math-g5-t1-assessment-en','math',   'as'),
 ('frameworks/English_LANGUAGE_framework-4-6_.pdf','fw-english-4-6','english','fw'),
 ('frameworks/math_4-6.pdf',            'fw-math-4-6',         'math',        'fw'),
 ('frameworks/P4-P6_Full_Science_Progression_Egypt_FINALframework.pdf','fw-science-4-6','science','fw'),
 ('frameworks/P4_Approved_CCIMD_Science_Standards_AR_120920.pdf','fw-science-standards-ar','science','fw'),
 ('frameworks/اللغة_العربية.pdf',        'fw-arabic',           'arabic',      'fw'),
 ('frameworks/دراسات_.pdf',              'fw-social',           'social',      'fw'),
 ('frameworks/نهائى_تكنولوجيا.pdf',      'fw-ict',              'ict',         'fw'),
 ('frameworks/القيم.pdf',                'fw-values',           'values',      'fw'),
 ('frameworks/تربية_فنية.pdf',           'fw-art',              'art',         'fw'),
 ('frameworks/تربية_موسيقية.pdf',        'fw-music',            'music',       'fw'),
 ('frameworks/تربية_رياضية_.pdf',        'fw-pe',               'pe',          'fw'),
 ('frameworks/vocational_4-6.pdf',      'fw-vocational',       'vocational',  'fw'),
 ('frameworks/الإطار_العام_نهائي_16-7-2018.pdf','fw-general','general',    'fw'),
 ('frameworks/_تربية_دينية٠.pdf',        'fw-religious',        'religious',   'fw'),
 ('frameworks/اطار_التربية_الدينية_2ب_نها_.pdf','fw-religious-2','religious','fw'),
 ('frameworks/Curriculum_Framework_G3_with_Annexes_2019.11.04.pdf','fw-g3','general','fw'),
 ('frameworks/Curriculum_Framework_G2_with_Annexes_2019.02.19_vsent_FINAL_EN.pdf','fw-g2','general','fw'),
]

def toc_vision(pdf, scan=(2,3,4,5,6,7)):
    d = fitz.open(pdf)
    for pi in scan:
        if pi >= d.page_count: continue
        z = 1300 / d[pi].rect.width
        pm = d[pi].get_pixmap(matrix=fitz.Matrix(z, z), colorspace=fitz.csRGB)
        im = Image.frombytes('RGB', (pm.width, pm.height), pm.samples)
        b = io.BytesIO(); im.save(b, 'JPEG', quality=85)
        out, err = vision(base64.b64encode(b.getvalue()).decode(), TOC_PROMPT)
        if err: continue
        try:
            j = json.loads(out)
            if j.get('units'):
                d.close(); return j['units']
        except Exception: pass
    d.close(); return []

def extract(pdf, tid, subject, kind):
    doc = fitz.open(pdf)
    tdir = os.path.join(OUT, tid); os.makedirs(tdir, exist_ok=True)
    pages, total = [], 0
    with open(os.path.join(tdir, 'text.jsonl'), 'w', encoding='utf-8') as fh:
        for i in range(doc.page_count):
            t = clean(doc[i].get_text())
            t = re.sub(r'[ \t]+', ' ', t).strip()
            total += len(t)
            fh.write(json.dumps({'p': i+1, 'text': t}, ensure_ascii=False) + '\n')
            pages.append({'p': i+1, 'chars': len(t)})
    m = {'id': tid, 'subject': subject, 'kind': kind,
         'source': os.path.basename(pdf), 'pages': doc.page_count,
         'totalChars': total, 'pages_meta': pages}
    doc.close()
    m['units'] = toc_vision(pdf)
    json.dump(m, open(os.path.join(tdir, 'manifest.json'), 'w'), ensure_ascii=False, indent=1)
    return m

if __name__ == '__main__':
    import sys
    only = sys.argv[1:] or None
    for pdf, tid, subj, kind in TEACHER_RESOURCES:
        if only and tid not in only: continue
        src = pdf if pdf.startswith('frameworks/') else f'pdfs/{pdf}'
        if not os.path.exists(src): print(f'MISSING {pdf}', flush=True); continue
        try:
            m = extract(src, tid, subj, kind)
            print(f"{tid:26s} {m['pages']:4d}p {m['totalChars']:8d} chars units={len(m['units'])}", flush=True)
        except Exception as e:
            print(f'{tid} FAILED {e}', flush=True)
    print('TEACHER DONE', flush=True)
