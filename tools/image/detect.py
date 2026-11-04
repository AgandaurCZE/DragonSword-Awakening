import sys,json,glob,os
import numpy as np
from PIL import Image
from scipy import ndimage
def cards(path):
    im=np.asarray(Image.open(path).convert('RGB')).astype(int)
    r,g,b=im[...,0],im[...,1],im[...,2]
    m=(r>120)&(r<225)&(abs(r-g)<14)&(abs(g-b)<16)
    m=ndimage.binary_closing(m,iterations=2)
    lab,n=ndimage.label(m)
    out=[]
    for sl in ndimage.find_objects(lab):
        h=sl[0].stop-sl[0].start;w=sl[1].stop-sl[1].start
        if h>300 and w>250 and 1.0<h/w<1.4: out.append((sl[1].start,sl[0].start,sl[1].stop,sl[0].stop))
    out.sort(key=lambda t:(round(t[1]/100),t[0]))
    return out
res={}
for f in sys.argv[1:]:
    res[f]=cards(f);print(f,len(res[f]),res[f][:2])
json.dump(res,open('/tmp/claude-0/-home-claude/252001f0-5406-5761-a052-6fbda1463d79/scratchpad/cards.json','w'))
