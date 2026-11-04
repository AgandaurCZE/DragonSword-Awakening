import json,glob,os,sys,numpy as np
from PIL import Image
import os;S=os.path.dirname(os.path.abspath(__file__))+'/'
src=open(S+'detect.py').read().split('res={}')[0];exec(src)
fs=open(S+'final.py').read().split('meta={}')[0].replace("O=json.load(open(S+'ocr.json'))","");exec(fs)
kind=sys.argv[1];FORCE=sys.argv[2].split(',')  # karma or familiars
lib={}
def sat(im):
  a=np.asarray(im.convert('HSV'))[...,1];return a.mean()
def feat(im):
  g=np.asarray(im.convert('L').resize((64,76)),float)[4:52,4:60];g=g-g.mean();return g/(np.linalg.norm(g)+1e-9)
for f in glob.glob(f'assets/{kind}/*.webp'):
  im=Image.open(f);
  if im.size!=(392,467):continue
  lib[f]=(feat(im),sat(im))
done=[]
for p in sorted(glob.glob(f'assets/{kind}/*.png')):
  I=Image.open(p).convert('RGB')
  for (x0,y0,x1,y1) in cards(p):
    art=I.crop((x0+11,y0+10,x1-11,y1-10)).resize((392,467),Image.LANCZOS)
    if sat(art)<40:continue
    fa=feat(art)
    best=max(lib,key=lambda k:(lib[k][0]*fa).sum());sc=(lib[best][0]*fa).sum()
    sa=sat(art)
    if os.path.basename(best) in FORCE:
      clean(art).save(best,quality=88);done.append((os.path.basename(best),round(float(sc),2)));lib[best]=(lib[best][0],99)
    else: print('skip',p,os.path.basename(best),round(float(sc),2),round(lib[best][1]),round(sa))
print(kind,len(done),done)
