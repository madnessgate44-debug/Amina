import fitz, os, json, warnings
warnings.filterwarnings('ignore')
rows=[]
for fn in sorted(os.listdir('pdfs')):
    if not fn.lower().endswith('.pdf'): continue
    p=os.path.join('pdfs',fn)
    try:
        d=fitz.open(p)
        n=d.page_count
        tot=0; imgonly=0; sample=min(n,40)
        for i in range(sample):
            t=d[i].get_text()
            tot+=len(t.strip())
            if len(t.strip())<25: imgonly+=1
        rows.append(dict(f=fn,pages=n,chars=tot,sampled=sample,imgonly=imgonly,
                         per_page=round(tot/max(sample,1))))
        d.close()
    except Exception as e:
        rows.append(dict(f=fn,err=str(e)))
json.dump(rows,open('/tmp/analysis.json','w'),indent=1)
print(f"{'file':52s} {'pg':>5s} {'chars':>8s} {'c/pg':>6s} {'imgonly':>7s}")
for r in rows:
    if 'err' in r: print(f"{r['f']:52s} ERROR {r['err'][:40]}"); continue
    print(f"{r['f'][:52]:52s} {r['pages']:5d} {r['chars']:8d} {r['per_page']:6d} {r['imgonly']:3d}/{r['sampled']}")
