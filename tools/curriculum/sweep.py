import fitz, io, os, warnings
from PIL import Image
warnings.filterwarnings('ignore')
d=fitz.open('pdfs/drasat_5prim_T1.pdf')
idxs=[8,9,10,20,30,40]
def render(page,tw):
    z=tw/page.rect.width
    pm=page.get_pixmap(matrix=fitz.Matrix(z,z),colorspace=fitz.csRGB)
    return Image.frombytes('RGB',(pm.width,pm.height),pm.samples)
print(f"{'w':>5s} {'q':>3s} {'avgKB':>7s} {'book MB':>8s} {'all MB':>7s}")
best=None
for tw in (900,1000,1100,1200):
    for q in (58,66,74):
        tot=0
        for i in idxs:
            im=render(d[i],tw); b=io.BytesIO(); im.save(b,'WEBP',quality=q,method=6); tot+=len(b.getvalue())
        avg=tot/len(idxs)/1024
        book=avg*d.page_count/1024
        allb=avg*8492/1024
        print(f"{tw:5d} {q:3d} {avg:7.0f} {book:8.1f} {allb/1024:7.0f}")
        if 1100==tw and q==66: best=(tw,q,avg)
print('\npick:',best)
d.close()
