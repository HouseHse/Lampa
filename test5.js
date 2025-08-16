/*
 * Lampa iOS Test Plugin
 * Version: 1.0.0
 */
(function() {
  'use strict';

  if (!window.Lampa) return;

  const Lampa = window.Lampa;

  function inject() {
    // Ждём пока откроется раздел "О приложении"
    Lampa.Listener.follow('activity', function(event) {
      if (event.type === 'start' && event.name === 'about') {
        setTimeout(() => {
          try {
            let box = document.querySelector('.about__body');
            if (box && !document.querySelector('.ios-plugin-box')) {
              let div = document.createElement('div');
              div.className = 'ios-plugin-box';
              div.style.padding = '1em';
              div.style.margin = '1em 0';
              div.style.background = 'rgba(255,255,255,0.1)';
              div.style.borderRadius = '8px';
              div.innerHTML = `
                <h2 style="color:#ffcc00">👋 Привет из плагина</h2>
                <p style="color:#fff">Этот текст добавлен плагином на iOS 🎉</p>
              `;
              box.prepend(div);
              console.log('[iOS Test Plugin] Вставка выполнена');
            }
          } catch(e) {
            console.error('[iOS Test Plugin] Ошибка вставки', e);
          }
        }, 500);
      }
    });
  }

  // Ждём готовности приложения
  if (Lampa.Listener && Lampa.Listener.follow) {
    Lampa.Listener.follow('app', function(e){
      if (e.type === 'ready') inject();
    });
  } else {
    setTimeout(inject, 2000);
  }
})();
