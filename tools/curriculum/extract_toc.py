import fitz, re, unicodedata, warnings, json, os
warnings.filterwarnings('ignore')

def clean(t):
    t=unicodedata.normalize('NFKC',t)
    t=re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]',' ',t)
    t=re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]','',t)
    t=re.sub(r'\u0640','',t)
    return t

AR_UNIT = r'(المحور|الوحدة)'
AR_LESSON = r'(الموضوع|الدرس)'
EN_UNIT = r'(?i)\b(unit|theme|chapter|module)\b'
EN_LESSON = r'(?i)\b(lesson)\b'

def toc_lines(doc, scan=20):
    out=[]
    for i in range(min(scan,doc.page_count)):
        t=clean(doc[i].get_text())
        for ln in t.split('\n'):
            ln=ln.strip()
            if len(ln)<3: continue
            if re.search(AR_UNIT,ln) or re.search(AR_LESSON,ln) or re.search(EN_UNIT,ln) or re.search(EN_LESSON,ln):
                out.append((i+1,ln))
    return out

for fn in ['Arabic_G5_-_SB_-_T1.pdf','P5T1_MTB_SE_EN_4.8.22.pdf','drasat_5prim_T1.pdf']:
    d=fitz.open(f'pdfs/{fn}')
    print(f'\n########## {fn} ({d.page_count}p) ##########')
    for pg,ln in toc_lines(d)[:25]:
        print(f'  p{pg:>3d} | {ln[:95]}')
    d.close()
