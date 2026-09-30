import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://links.chamaoiago.com.br';
const APP = 'https://chamaoiago.com.br';
const API_LINKS = APP + '/api/links';

const FALLBACK = [
  { rotulo: 'Conheça o IAGO', path: '/', imagem: 'https://assets.iagopinkusfeld.org/hero/191.webp' },
  { rotulo: 'IAGO para Clínicas', path: '/para-clinicas', imagem: "https://assets.iagopinkusfeld.org/Ramos%20LP's/clinicas.webp" },
  { rotulo: 'IAGO para Hotéis', path: '/para-hoteis', imagem: "https://assets.iagopinkusfeld.org/Ramos%20LP's/hoteis.webp" },
];

function esc(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function iniciais(nome) {
  const palavras = String(nome).trim().split(/\s+/).filter(Boolean);
  if (palavras.length > 1) {
    return (palavras[0][0] + palavras[1][0]).toUpperCase();
  }
  return palavras[0].slice(0, 2).toUpperCase();
}

function hrefRedirect(slug, path) {
  return APP + '/r/' + slug + '?to=' + encodeURIComponent(path);
}

function escrever(caminho, conteudo) {
  mkdirSync(dirname(caminho), { recursive: true });
  writeFileSync(caminho, conteudo, 'utf8');
  console.log('gravado  ' + caminho.slice(BASE.length + 1).replace(/\\/g, '/'));
}

const perfis = JSON.parse(readFileSync(join(BASE, 'perfis.json'), 'utf8'));
if (!Array.isArray(perfis) || perfis.length === 0) {
  throw new Error('perfis.json invalido: esperado array nao vazio de perfis');
}
for (const p of perfis) {
  for (const campo of ['canal', 'slug', 'nome', 'ig']) {
    if (!p || typeof p[campo] !== 'string' || p[campo].trim() === '') {
      throw new Error('perfil sem campo "' + campo + '": ' + JSON.stringify(p));
    }
  }
}
const slugs = new Set();
for (const p of perfis) {
  if (slugs.has(p.slug)) throw new Error('slug duplicado: ' + p.slug);
  slugs.add(p.slug);
}

const CSS = `:root {
  --fundo: #0a0a0a;
  --texto: #f5f5f5;
  --texto-fraco: #a3a3a3;
  --linha: #262626;
  --branco: #ffffff;
  --preto: #000000;
  --largura: 440px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  background: var(--fundo);
  overflow-x: hidden;
}

body {
  margin: 0;
  background: var(--fundo);
  color: var(--texto);
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 16px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  overflow-x: hidden;
}

.pagina {
  width: 100%;
  max-width: var(--largura);
  margin: 0 auto;
  padding: 56px 16px 40px;
}

.perfil {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--linha);
}

.avatar {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: var(--texto);
  color: var(--preto);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 1px;
  user-select: none;
}

.nome {
  margin: 6px 0 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.ig {
  color: var(--texto-fraco);
  text-decoration: none;
  font-size: 14px;
  overflow-wrap: anywhere;
}

.ig:hover,
.ig:focus-visible {
  color: var(--texto);
  text-decoration: underline;
}

.lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 28px 0 0;
}

.botao {
  display: block;
  width: 100%;
  padding: 16px 18px;
  border: 0;
  border-radius: 14px;
  background: var(--branco);
  color: var(--preto);
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.botao:hover,
.botao:focus-visible {
  background: #d9d9d9;
}

.botao-img {
  padding: 0;
  overflow: hidden;
}

.botao-img img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: #1c1c1c;
}

.botao-img span {
  display: block;
  padding: 14px 18px;
}

.botao-off {
  background: #1c1c1c;
  color: var(--texto-fraco);
  border: 1px dashed var(--linha);
  cursor: not-allowed;
  font-weight: 500;
}

.rodape {
  margin: 32px 0 0;
  padding-top: 24px;
  border-top: 1px solid var(--linha);
}

.aviso {
  color: var(--texto-fraco);
  font-size: 13px;
  text-align: center;
}

.titulo-secao {
  margin: 40px 0 0;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--texto-fraco);
}

.lista-cartoes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0 0;
}

.cartao {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  border: 1px solid var(--linha);
  border-radius: 14px;
  background: #111111;
  color: var(--texto);
  text-decoration: none;
}

.cartao:hover,
.cartao:focus-visible {
  border-color: var(--texto);
  background: #161616;
}

.cartao-nome {
  font-size: 15px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.cartao-meta {
  font-size: 12px;
  color: var(--texto-fraco);
  overflow-wrap: anywhere;
}

a:focus-visible {
  outline: 2px solid var(--texto);
  outline-offset: 3px;
}

@media (max-width: 480px) {
  .pagina {
    padding: 40px 16px 32px;
  }

  .nome {
    font-size: 20px;
  }
}
`;

const JS = `(function () {
  var APP = 'https://chamaoiago.com.br';
  var TEMPO = 2500;
  var slug = document.body.getAttribute('data-slug');
  var lista = document.querySelector('[data-links]');
  if (!slug || !lista) return;

  var controle = new AbortController();
  var relogio = setTimeout(function () { controle.abort(); }, TEMPO);

  fetch(APP + '/api/links', { signal: controle.signal, mode: 'cors', cache: 'no-store' })
    .then(function (resposta) { return resposta.ok ? resposta.json() : null; })
    .then(function (dados) {
      if (!dados || !Array.isArray(dados.nichos) || dados.nichos.length === 0) return;
      var validos = dados.nichos.filter(function (item) {
        return item &&
          typeof item.rotulo === 'string' && item.rotulo.trim() !== '' &&
          typeof item.path === 'string' && item.path.trim() !== '';
      });
      if (validos.length === 0) return;
      var fragmento = document.createDocumentFragment();
      validos.forEach(function (item) {
        var botao = document.createElement('a');
        botao.className = item.imagem ? 'botao botao-img' : 'botao';
        botao.setAttribute('href', APP + '/r/' + slug + '?to=' + encodeURIComponent(item.path));
        if (item.imagem) {
          var foto = document.createElement('img');
          foto.src = item.imagem; foto.alt = ''; foto.loading = 'lazy'; foto.decoding = 'async';
          var texto = document.createElement('span');
          texto.textContent = item.rotulo;
          botao.appendChild(foto); botao.appendChild(texto);
        } else {
          botao.textContent = item.rotulo;
        }
        fragmento.appendChild(botao);
      });
      lista.textContent = '';
      lista.appendChild(fragmento);
      lista.setAttribute('data-fonte', 'api');
    })
    .catch(function () {})
    .then(function () { clearTimeout(relogio); });
})();
`;

const head = (titulo, descricao, url, prefixoCss) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<meta name="description" content="${descricao}">
<meta property="og:title" content="${titulo}">
<meta property="og:description" content="${descricao}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta name="theme-color" content="#0a0a0a">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap">
<link rel="stylesheet" href="${prefixoCss}assets/links.css">
</head>
`;

function paginaAvatar(p) {
  const titulo = `${p.nome} — links`;
  const descricao = `Todos os links de ${p.nome} (@${p.ig}) em um lugar só.`;
  const url = `${SITE}/${p.slug}/`;
  const botoes = FALLBACK.map((item) =>
    item.imagem
      ? `    <a class="botao botao-img" href="${hrefRedirect(p.slug, item.path)}" rel="noopener"><img src="${esc(item.imagem)}" alt="" loading="lazy" decoding="async" width="1280" height="720"><span>${esc(item.rotulo)}</span></a>`
      : `    <a class="botao" href="${hrefRedirect(p.slug, item.path)}" rel="noopener">${esc(item.rotulo)}</a>`
  ).join('\n');

  return `${head(titulo, descricao, url, '../')}<body data-slug="${esc(p.slug)}">
<main class="pagina">
  <header class="perfil">
    <div class="avatar" aria-hidden="true">${esc(iniciais(p.nome))}</div>
    <h1 class="nome">${esc(p.nome)}</h1>
    <a class="ig" href="https://instagram.com/${esc(p.ig)}" target="_blank" rel="noopener noreferrer">@${esc(p.ig)}</a>
  </header>
  <nav class="lista" data-links aria-label="Links de ${esc(p.nome)}">
${botoes}
  </nav>
  <footer class="rodape">
    <a class="botao botao-off" aria-disabled="true">Entre no meu clube (em breve)</a>
  </footer>
</main>
<script src="../assets/links.js" defer></script>
</body>
</html>
`;
}

function cartoesLista(caminhoAbsoluto) {
  return perfis.map((p) => `    <a class="cartao" href="${caminhoAbsoluto}${p.slug}/">
      <span class="cartao-nome">${esc(p.nome)}</span>
      <span class="cartao-meta">@${esc(p.ig)} &middot; ${esc(p.canal)}</span>
    </a>`).join('\n');
}

const tituloHome = 'IAGO — links dos avatares';
const descricaoHome = 'Links oficiais de cada avatar do IAGO. Escolha o seu e entre no canal.';
const urlHome = SITE + '/';

escrever(join(BASE, 'assets', 'links.css'), CSS);
escrever(join(BASE, 'assets', 'links.js'), JS);

for (const p of perfis) {
  escrever(join(BASE, p.slug, 'index.html'), paginaAvatar(p));
}

escrever(join(BASE, 'index.html'), `${head(tituloHome, descricaoHome, urlHome, '')}<body>
<main class="pagina">
  <header class="perfil">
    <div class="avatar" aria-hidden="true">IA</div>
    <h1 class="nome">IAGO</h1>
    <a class="ig" href="https://chamaoiago.com.br" target="_blank" rel="noopener noreferrer">@chamaoiago</a>
  </header>
  <h2 class="titulo-secao">Escolha o seu avatar</h2>
  <nav class="lista-cartoes" aria-label="Avatares">
${cartoesLista('/')}
  </nav>
</main>
</body>
</html>
`);

escrever(join(BASE, '404.html'), `${head('Página não encontrada — links', 'Página não encontrada.', SITE + '/404.html', '')}<body>
<main class="pagina">
  <header class="perfil">
    <div class="avatar" aria-hidden="true">404</div>
    <h1 class="nome">Página não encontrada</h1>
    <a class="ig" href="/">voltar para a lista de avatares</a>
  </header>
  <h2 class="titulo-secao">Escolha o seu avatar</h2>
  <nav class="lista-cartoes" aria-label="Avatares">
${cartoesLista('/')}
  </nav>
</main>
</body>
</html>
`);

escrever(join(BASE, 'CNAME'), 'links.chamaoiago.com.br\n');
escrever(join(BASE, '.nojekyll'), '');

console.log('\nperfis gerados: ' + perfis.length);