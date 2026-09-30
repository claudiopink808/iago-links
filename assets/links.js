(function () {
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
