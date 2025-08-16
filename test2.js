/*
 * Lampa Simple Plugin
 * Version: 1.0.0
 */
(function() {
  'use strict';

  if (typeof window.Lampa === 'undefined') return;
  const Lampa = window.Lampa;

  function openScreen() {
    Lampa.Noty.show('Привет! Это мой первый плагин 🚀');
  }

  function boot() {
    Lampa.Menu.add({
      title: 'Мой плагин',
      icon: 'star',
      onSelect: openScreen
    });
    console.log('[Simple Plugin] Загружен');
  }

  if (Lampa.Listener && Lampa.Listener.follow) {
    Lampa.Listener.follow('app', function(e){
      if (e.type === 'ready') boot();
    });
  } else {
    setTimeout(boot, 500);
  }
})();
