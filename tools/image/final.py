import json,re,os,cv2
import numpy as np
from PIL import Image
R=os.path.abspath(os.path.dirname(__file__)+'/../..')+'/'
S=os.path.dirname(os.path.abspath(__file__))+'/'
O=json.load(open(S+'ocr.json'))
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def band(a):
    h=a.shape[0];rows=(a.min(-1)>228).sum(1)
    y=h-1
    while y>h*0.5 and rows[y]<=6: y-=1
    bot=y;top=y;gap=0
    while y>h*0.5:
        if rows[y]>6: top=y;gap=0
        else:
            gap+=1
            if gap>22: break
        y-=1
    return top,bot
def clean(art):
    a=np.asarray(art)[...,::-1].copy();h=a.shape[0]
    top,bot=band(a[...,::-1])
    m=np.zeros(a.shape[:2],np.uint8)
    t0,t1=max(top-6,0),min(bot+7,h)
    m[t0:t1]=(a[t0:t1].min(-1)>150)*255
    m=cv2.dilate(m,np.ones((3,3),np.uint8),iterations=3)
    m[:t0-2]=0
    r=cv2.inpaint(a,m,9,cv2.INPAINT_TELEA)
    return Image.fromarray(r[...,::-1])
meta={}
for f,cards in O.items():
    kind=f.split('/')[-2];group=os.path.basename(f)[:-4]
    im=Image.open(R+f).convert('RGB')
    for i,c in enumerate(cards):
        x0,y0,x1,y1=c['box'];art=im.crop((x0+11,y0+10,x1-11,y1-10))
        name=c['match'] or c['ocr']
        out=clean(art)
        a=np.asarray(out.convert('HSV')).astype(int);H,S_,V=a[...,0],a[...,1],a[...,2]
        w,h=out.size;sub=a[int(h*.12):,int(w*.25):];colour=float(((sub[...,1]>70)&(sub[...,2]>60)&~((sub[...,0]>120)&(sub[...,0]<185))).mean())>0.03
        if kind=='heroes': dst=f'assets/heroes/{name.lower()}.webp'
        elif kind=='karma': dst=f'assets/karma/{slug(name)}.webp'
        else: dst=f'assets/familiars/{slug(name)}.webp'
        out.save(R+dst,'WEBP',quality=88)
        meta[name]={'kind':kind,'group':group,'order':i,'path':dst,'colour':colour}
json.dump(meta,open(S+'final_meta.json','w'),indent=1)
print(len(meta))
