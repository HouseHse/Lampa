/*
 * Lampa Minimal Plugin
 * Version: 1.0.0
 */
(function() {
  'use strict';

  if (typeof window.Lampa === 'undefined') return;
  const Lampa = window.Lampa;

  function boot() {
    Lampa.Menu.add({
      title: 'Тест',
      icon: 'star',
      onSelect: function() {
        Lampa.Noty.show('Плагин работает ✅');
      }
    });
    console.log('[Minimal Plugin] Загружен');
  }

  if (Lampa.Listener && Lampa.Listener.follow) {
    Lampa.Listener.follow('app', function(e){
      if (e.type === 'ready') boot();
    });
  } else {
    setTimeout(boot, 1000);
  }
})();
