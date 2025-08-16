/*
 * Lampa Minimal Safe Plugin
 * Version: 1.0.1
 */
(function() {
  'use strict';

  function boot() {
    if (!window.Lampa) {
      console.log('[Minimal Safe Plugin] Lampa не найдена');
      return;
    }

    const Lampa = window.Lampa;

    try {
      Lampa.Menu.add({
        title: 'Тест',
        icon: 'star',
        onSelect: function() {
          if (Lampa.Noty) {
            Lampa.Noty.show('✅ Плагин работает!');
          } else {
            alert('✅ Плагин работает!');
          }
        }
      });
      console.log('[Minimal Safe Plugin] Кнопка добавлена');
    } catch(e) {
      console.error('[Minimal Safe Plugin] Ошибка при добавлении кнопки', e);
    }
  }

  // ждём полной загрузки приложения
  if (window.Lampa && Lampa.Listener && Lampa.Listener.follow) {
    Lampa.Listener.follow('app', function(e){
      if (e.type === 'ready') boot();
    });
  } else {
    // fallback: пробуем через таймаут
    setTimeout(boot, 2000);
  }
})();
