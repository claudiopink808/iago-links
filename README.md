# links-site — site estático de links por avatar

Site "linktree" para os 14 avatares do IAGO. HTML + CSS + JS puros, sem build, sem dependência.
Publicação via GitHub Pages em `https://links.chamaoiago.com.br`.

## Gerar

```bash
node links-site/gera.mjs
```

Lê `links-site/perfis.json` (fonte única de verdade: `canal`, `slug`, `nome`, `ig`) e reescreve
tudo do zero:

- `index.html` — lista dos 14 avatares
- `<slug>/index.html` — página de cada avatar (1 por perfil)
- `404.html`, `CNAME` (`links.chamaoiago.com.br`), `.nojekyll`
- `assets/links.css`, `assets/links.js`

Rodar de novo é idempotente: mesma entrada → mesmos bytes. Para mudar a lista de avatares, edite
apenas `perfis.json` e rode o gerador.

## Publicar

1. Crie um repositório no GitHub (ex.: `links`) e copie **o conteúdo** de `links-site/` para a raiz
   dele — `index.html`, os 14 diretórios `<slug>/`, `assets/`, `404.html`, `CNAME` e `.nojekyll`
   ficam na raiz do repositório (não numa subpasta `links-site/`).
2. Settings → Pages → Source: branch **`main`**, pasta **`/ (root)``. Salve.
3. O arquivo `CNAME` faz o GitHub publicar direto em `links.chamaoiago.com.br`.
4. No DNS da zona, crie o registro:

   ```
   CNAME  links  ->  claudiopink808.github.io
   ```

5. Sem `www`, sem proxy laranja no GitHub Pages (CNAME já resolve o domínio final). Se usar proxy
   laranja/Cloudflare, mantenha **DNS only** para o GitHub validar o domínio.

## Como a página do avatar funciona

- O HTML já vem com 3 botões de reserva (fallback) — a página funciona com JS desativado.
- O `assets/links.js` tenta `GET https://chamaoiago.com.br/api/links` (timeout de 2,5 s). Se a API
  responder `{ "nichos": [{ "rotulo", "path" }] }` com lista válida, os botões são substituídos.
  Se falhar, a página continua com o fallback.
- Cada botão aponta para `https://chamaoiago.com.br/r/<slug>?to=<path codificado>`; o registro do
  clique acontece no `/r/` do site principal. A página em si não grava nada: sem cookies, sem
  analytics, sem `localStorage`.
- Visual: fundo `#0a0a0a`, apenas preto/branco/cinza, JetBrains Mono, botões brancos com texto
  preto, raio 14px, largura máxima 440px, sem rolagem horizontal no celular.