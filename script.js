/* ==========================================================================
   StreamPlay — comportamento da página
   Sem dependências. Se este arquivo não carregar, a página continua
   funcionando: tudo aqui é melhoria progressiva.
   ========================================================================== */
(function () {
  'use strict';

  /* 1. Configuração — edite só aqui */
  var CONFIG = {
    whatsapp: '556899262485',          // DDI + DDD + número, só dígitos
    mensagemGeral: 'Olá! Quero saber mais sobre a StreamPlay.',
    scrollOffset: 90                   // altura do cabeçalho fixo, em px
  };

  /* 2. Rolagem suave nos links internos */
  function iniciarRolagem() {
    var links = document.querySelectorAll('a[href^="#"]');

    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener('click', function (evento) {
        var alvo = link.getAttribute('href');
        if (!alvo || alvo === '#') { return; }

        var destino = document.querySelector(alvo);
        if (!destino) { return; }

        evento.preventDefault();

        var topo = destino.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;

        window.scrollTo({ top: topo, behavior: 'smooth' });

        destino.setAttribute('tabindex', '-1');
        destino.focus({ preventScroll: true });
      });
    });
  }

  /* 3. Link ativo conforme a seção visível */
  function iniciarNavegacaoAtiva() {
    var secoes = document.querySelectorAll('main section[id]');
    var links = document.querySelectorAll('.nav__link');

    if (!secoes.length || !links.length || !('IntersectionObserver' in window)) { return; }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) { return; }

        var id = entrada.target.getAttribute('id');

        Array.prototype.forEach.call(links, function (link) {
          if (link.getAttribute('href') === '#' + id) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Array.prototype.forEach.call(secoes, function (secao) {
      observador.observe(secao);
    });
  }

  /* 4. Busca — filtro simples sobre os destaques */
  function iniciarBusca() {
    var botao = document.querySelector('[data-search]');
    if (!botao) { return; }

    botao.addEventListener('click', function () {
      var termo = window.prompt('Buscar por título ou categoria:');
      if (termo === null) { return; }

      termo = termo.trim().toLowerCase();
      var itens = document.querySelectorAll('.tile, .cat');

      if (!termo) {
        Array.prototype.forEach.call(itens, function (item) { item.style.display = ''; });
        return;
      }

      var achou = 0;

      Array.prototype.forEach.call(itens, function (item) {
        var rotulo = item.querySelector('.tile__label, .cat__label');
        var img = item.querySelector('img');
        var texto = ((rotulo ? rotulo.textContent : '') + ' ' + (img ? img.alt : '')).toLowerCase();
        var combina = texto.indexOf(termo) !== -1;

        item.style.display = combina ? '' : 'none';
        if (combina) { achou++; }
      });

      if (achou > 0) {
        var primeiro = document.querySelector('.tile:not([style*="none"]), .cat:not([style*="none"])');
        if (primeiro) { primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      } else {
        window.alert('Nenhum resultado para "' + termo + '".');
        Array.prototype.forEach.call(itens, function (item) { item.style.display = ''; });
      }
    });
  }

  /* 5. WhatsApp — completa os links que não têm mensagem */
  function iniciarWhatsApp() {
    var links = document.querySelectorAll('a[href*="wa.me"]');

    Array.prototype.forEach.call(links, function (link) {
      if (link.getAttribute('href').indexOf('?text=') !== -1) { return; }

      link.setAttribute(
        'href',
        '[wa.me](https://wa.me/)' + CONFIG.whatsapp + '?text=' + encodeURIComponent(CONFIG.mensagemGeral)
      );
    });
  }

  /* 6. Ano atual, se houver um elemento marcado com data-ano */
  function iniciarAno() {
    var alvo = document.querySelector('[data-ano]');
    if (alvo) { alvo.textContent = new Date().getFullYear(); }
  }

  /* 7. Inicialização */
  function iniciar() {
    iniciarRolagem();
    iniciarNavegacaoAtiva();
    iniciarBusca();
    iniciarWhatsApp();
    iniciarAno();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

})();
