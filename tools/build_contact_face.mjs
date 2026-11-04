// The physical note uses the same remaining content as its live reader. Keep
// the farewell exclusively in the ending, including during the cover turn.
import fs from 'node:fs';
const root=new URL('../',import.meta.url),read=path=>fs.readFileSync(new URL(path,root));
const font=read('public/fonts/AtelierSans-Variable.woff2').toString('base64');
const image=(file,x,y,ink=false)=>`<image x="${x}" y="${y}" width="22" height="22"${ink?' filter="url(#contact-ink)"':''} href="data:image/${file.endsWith('.svg')?'svg+xml':'png'};base64,${read(`public/images/${file}`).toString('base64')}"/>`;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="680" height="464.3684" viewBox="0 0 680 464.3684">
<defs><style>@font-face{font-family:Atelier;src:url(data:font/woff2;base64,${font})}text{font-family:Atelier,Arial,sans-serif;fill:#121212;font-size:16px}</style><filter id="contact-ink" color-interpolation-filters="sRGB"><feFlood flood-color="#000000"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs>
<rect width="680" height="464.3684" rx="14" fill="white"/>
<text x="31" y="52" style="font-size:32px;font-weight:600">CONTACT</text>
${image('mobile.png',31,116.17,true)}${image('mail.png',31,195.17,true)}
<text x="66" y="118.67">Mobile</text><text x="66" y="147.67">010-8739-7139</text>
<text x="66" y="197.67">E-mail</text><text x="66" y="226.67">gungyu0203@naver.com</text>
${image('github.svg',31,258.67)}${image('velog.svg',31,308.67)}
<text x="66" y="276.67">GitHub</text><text x="66" y="326.67">Velog</text>
<path d="M0 369.36H680" stroke="#dedede"/>
<text x="31" y="405.36">상업적 목적이 아닌 개인 포트폴리오용으로 제작된 사이트입니다.</text>
<text x="31" y="433.36">© 2026 Lee geon-gyu Portfolio. All Rights Reserved.</text></svg>`;
fs.writeFileSync(new URL('public/assets/desk/contact-face.svg',root),svg);
