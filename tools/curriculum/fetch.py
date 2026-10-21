import re, sys, html, urllib.parse, subprocess, os, time

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def get(url, out=None, timeout=600):
    args = ["curl","-s","-L","--max-time",str(timeout),"-A",UA,"-o",out or "/dev/stdout",url]
    return subprocess.run(args, capture_output=True)

def download(fid, path):
    url = f"https://drive.usercontent.google.com/download?id={fid}&export=download"
    get(url, path)
    with open(path,"rb") as f:
        head = f.read(2048)
    if head[:5] == b"%PDF-":
        return "pdf", os.path.getsize(path)
    if b"Virus scan warning" not in head and b"download-form" not in head:
        return "unknown", os.path.getsize(path)
    # parse interstitial form
    txt = open(path,"rb").read().decode("utf-8","ignore")
    action = re.search(r'<form[^>]+action="([^"]+)"', txt)
    if not action: return "noform", os.path.getsize(path)
    action = html.unescape(action.group(1))
    fields = dict(re.findall(r'<input[^>]+name="([^"]+)"[^>]*value="([^"]*)"', txt))
    qs = urllib.parse.urlencode(fields)
    final = action + ("&" if "?" in action else "?") + qs
    get(final, path, timeout=900)
    with open(path,"rb") as f:
        head = f.read(5)
    return ("pdf" if head==b"%PDF-" else "fail"), os.path.getsize(path)

if __name__ == "__main__":
    fid, name = sys.argv[1], sys.argv[2]
    st, sz = download(fid, f"pdfs/{name}")
    print(f"{st}|{sz}|{name}")
