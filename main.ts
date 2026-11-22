// make.fun tiny stack ISA v1. S[op]-97 = pops*4+pushes; '.' = no opcode.
import{mkdirSync as m,readdirSync as r,readFileSync as f,writeFileSync as w}from'node:fs'
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output',
S='abbegklp........jjjjjjjfjjjfjjj.jjj.............aeeaa...........fi..............eebe',
D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),B=new Uint8Array(65536)
let L=0
const X=(p,q)=>{
let n=p.length,pc=0,s=0,sp=0,cs=0,ip=0,o,c,k,a,b,t
M.fill(0);L=0
for(;;){
if(s==1e6)return 10
if(pc>>>0>=n)return 9
o=p[pc];c=S.charCodeAt(o)-97
if(!(c>=0))return 5
k=o==1?1:o==2?4:o>>2==12?2:0
if(pc+k>=n)return 9
s++
if(sp<c>>2)return 2
if(sp-(c>>2)+(c&3)>256)return 3
pc+=k+1
if(c==9){b=D[--sp];a=D[sp-1]
if(o>18&&o<23&&!b)return 4
D[sp-1]=o==16?a+b:o==17?a-b:o==18?Math.imul(a,b):o==19?a/b:o==20?a%b:o==21?(a>>>0)/(b>>>0):o==22?(a>>>0)%(b>>>0):o==24?a&b:o==25?a|b:o==26?a^b:o==28?a<<b:o==29?a>>b:o==30?a>>>b:o==32?+(a==b):o==33?+(a<b):+(a>>>0<b>>>0)
continue}
switch(o){
case 0:return 0
case 1:D[sp++]=p[pc-1]<<24>>24;break
case 2:D[sp++]=p[pc-4]|p[pc-3]<<8|p[pc-2]<<16|p[pc-1]<<24;break
case 3:sp--;break
case 4:D[sp]=D[sp-1];sp++;break
case 5:t=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=t;break
case 6:D[sp]=D[sp-2];sp++;break
case 7:t=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=t;break
case 23:D[sp-1]=-D[sp-1];break
case 27:D[sp-1]=~D[sp-1];break
case 48:case 49:case 50:if(o==48||(o==49)==!D[--sp])pc+=(p[pc-2]|p[pc-1]<<8)<<16>>16;break
case 51:if(cs>63)return 7;C[cs++]=pc;pc=p[pc-2]|p[pc-1]<<8;break
case 52:if(!cs)return 8;pc=C[--cs];break
case 64:a=D[sp-1];if(a>>>0>255)return 6;D[sp-1]=M[a];break
case 65:a=D[--sp];if(a>>>0>255)return 6;M[a]=D[--sp];break
case 80:t=''+D[--sp];if(L+t.length>65536)return 11;for(k=0;k<t.length;)B[L++]=t.charCodeAt(k++);break
case 81:if(L>65535)return 11;B[L++]=D[--sp];break
case 82:D[sp++]=ip<q.length?q[ip++]:-1;break
case 83:return D[--sp]&255}}}
for(const d of r(I)){const h=I+'/'+d+'/',e=X(f(h+'program.bin'),f(h+'input.bin')),g=O+'/'+d
m(g,{recursive:true});w(g+'/stdout.bin',B.subarray(0,L));w(g+'/exit.txt',e+'\n')}
