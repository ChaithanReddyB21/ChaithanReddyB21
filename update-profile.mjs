// Original terminal card inspired by Andrew6rant's profile layout.
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
const user = 'ChaithanReddyB21';
const cached = existsSync('stats.json') ? JSON.parse(readFileSync('stats.json', 'utf8')) : { repos: 1, followers: 0, following: 1, stars: 0 };
let stats = cached;
if (process.argv.includes('--refresh')) {
  const headers = { 'User-Agent': user + '-profile', ...(process.env.GITHUB_TOKEN ? { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN } : {}) };
  async function get(path) {
    const res = await fetch('https://api.github.com/' + path, { headers });
    if (!res.ok) throw new Error('GitHub API: ' + res.status);
    return res.json();
  }
  const profile = await get('users/' + user);
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await get('users/' + user + '/repos?type=owner&per_page=100&page=' + page);
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  stats = { repos: profile.public_repos, followers: profile.followers, following: profile.following, stars: repos.filter(r => !r.fork).reduce((n, r) => n + r.stargazers_count, 0) };
}
writeFileSync('stats.json', JSON.stringify(stats, null, 2) + '\n');
const escape = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const art = [
'   ██████╗ ██████╗ ',
'  ██╔════╝ ██╔══██╗',
'  ██║      ██████╔╝',
'  ██║      ██╔══██╗',
'  ╚██████╗ ██║  ██║',
'   ╚═════╝ ╚═╝  ╚═╝'
];
const rows = [
['Name', 'Chaithan Reddy'],
['Handle', '@ChaithanReddyB21'],
['Mode', 'learn · build · collaborate'],
['Focus', 'web apps + civic technology'],
['', ''],
['Project', 'CivicLens / team project'],
['Frontend', 'React · TypeScript · Tailwind'],
['Services', 'Firebase · Groq · Vercel'],
['Maps', 'Leaflet + OpenStreetMap'],
['', ''],
['Connect', 'linkedin.com/in/chaithanreddyb'],
['GitHub', stats.repos + ' public repos · ' + stats.stars + ' stars'],
['Community', stats.followers + ' followers · ' + stats.following + ' following'],
];
for (const theme of ['dark', 'light']) {
 const dark = theme === 'dark';
 const c = dark ? {bg:'#0d1117',panel:'#161b22',text:'#d5e2f0',muted:'#8294ab',accent:'#7ee7da',key:'#ffb86c',line:'#303a49'} : {bg:'#f6f8fa',panel:'#ffffff',text:'#213247',muted:'#63758a',accent:'#087f8c',key:'#ab5318',line:'#d8e0e8'};
 let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="590" viewBox="0 0 1000 590" role="img" aria-label="Chaithan Reddy terminal profile"><title>Chaithan Reddy — building with curiosity and collaboration</title><rect width="1000" height="590" rx="20" fill="' + c.bg + '"/><rect x="18" y="18" width="964" height="554" rx="14" fill="' + c.panel + '" stroke="' + c.line + '"/>';
 svg += '<g font-family="Consolas,DejaVu Sans Mono,monospace">';
 svg += '<circle cx="43" cy="43" r="5" fill="#ff6b6b"/><circle cx="62" cy="43" r="5" fill="#f7c45f"/><circle cx="81" cy="43" r="5" fill="#65ce8f"/><text x="500" y="49" text-anchor="middle" fill="' + c.muted + '" font-size="13">chaithan@github : ~/profile</text><path d="M18 68 H982" stroke="' + c.line + '"/>';
 svg += '<text x="45" y="105" fill="' + c.accent + '" font-size="16">$ whoami</text>';
 art.forEach((line,i) => { svg += '<text xml:space="preserve" x="45" y="' + (170+i*28) + '" fill="' + c.accent + '" font-size="21">' + escape(line) + '</text>'; });
 svg += '<text x="65" y="380" fill="' + c.text + '" font-size="17">BUILD WITH PURPOSE.</text><text x="65" y="409" fill="' + c.muted + '" font-size="14">Curiosity → code → impact</text><text x="65" y="449" fill="' + c.key + '" font-size="14">[ always learning ]</text>';
 svg += '<path d="M350 133 V498" stroke="' + c.line + '"/><text x="383" y="143" fill="' + c.accent + '" font-size="18" font-weight="bold">chaithan@reddy</text>';
 rows.forEach(([k,v],i) => { const y=177+i*25; svg += '<text x="383" y="' + y + '" fill="' + c.key + '" font-size="14">' + escape(k ? k+':' : '') + '</text><text x="493" y="' + y + '" fill="' + c.text + '" font-size="14">' + escape(v) + '</text>'; });
 svg += '<path d="M45 521 H955" stroke="' + c.line + '"/><text x="45" y="549" fill="' + c.muted + '" font-size="13">Useful software gets better when we build together.</text><text x="930" y="549" fill="' + c.accent + '" font-size="16">▊</text></g></svg>';
 writeFileSync(theme + '_mode.svg', svg + '\n');
}

