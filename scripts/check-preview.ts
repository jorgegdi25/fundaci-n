import {routeNames,locales,href,projectHref,type PageKey} from '../src/lib/i18n.ts';
import {projects} from '../src/content/projects.ts';
const base='http://127.0.0.1:3000';
const routes=locales.flatMap(lang=>[...(Object.keys(routeNames) as PageKey[]).map(key=>href(lang,key)),...projects.map(p=>projectHref(lang,p.slug))]);
const failures:{path:string;status:number}[]=[];
for(const path of routes){const response=await fetch(base+path);const html=await response.text();if(response.status!==200||!html.includes('noindex')||(html.match(/<h1[ >]/g)||[]).length!==1)failures.push({path,status:response.status});}
const unavailable=await fetch(base+'/api/donations',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({amount:50000,frequency:'monthly',cause:'amazonas'})});
const invalid=await fetch(base+'/api/donations',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({amount:-1,frequency:'monthly',cause:'amazonas'})});
const missing=await fetch(base+'/es/no-existe');
const robots=await (await fetch(base+'/robots.txt')).text();
const robotsBlocksPreview=robots.includes('Disallow: /');
console.log(JSON.stringify({pages:routes.length,failures,validDonationUnavailable:unavailable.status,invalidDonation:invalid.status,missingRoute:missing.status,robotsBlocksPreview},null,2));
if(failures.length||unavailable.status!==503||invalid.status!==400||missing.status!==404||!robotsBlocksPreview)process.exit(1);
