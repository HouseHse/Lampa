/* 
 * Lampa Plugin Store (каталог плагинов, загрузка из JSON)
 * Version: 1.1.0
 */
(function() {
  'use strict';

  if (typeof window.Lampa === 'undefined') return;
  const Lampa = window.Lampa;

  const PLUGIN_ID = 'plugin.store.remote';
  const PLUGIN_NAME = 'Каталог плагинов (онлайн)';
  const PLUGIN_VERSION = '1.1.0';

  // URL до JSON со списком плагинов
  const STORE_URL = "http://hsesha.pro/lampa/plugins.json";

  function openStore() {
    const html = Lampa.Template.get('list');
    const scroll = new Lampa.Scroll({over: true});
    const header = Lampa.Template.get('title');
    header.find('.title__left').text('Каталог плагинов');
    header.find('.title__right').text('v' + PLUGIN_VERSION);
    html.find('.list__head').append(header);

    const itemsContainer = Lampa.Template.get('tiles');

    fetch(STORE_URL)
      .then(r => r.json())
      .then(plugins => {
        plugins.forEach(plugin => {
          const card = Lampa.Template.get('card', {
            title: plugin.title,
            poster: plugin.poster
          });

          card.on('hover:focus', () => {
            html.find('.title__left').text(plugin.title);
            html.find('.title__right').text(plugin.description || '');
            Lampa.Background.change(plugin.poster);
          });

          card.on('hover:enter', () => {
            Lampa.Modal.open({
              title: plugin.title,
              html: `<div style="padding:1em">${plugin.description || ''}</div>`,
              size: 'medium',
              buttons: [
                {title:'Установить', onSelect:()=>{ 
                  const list = Lampa.Storage.get('plugins','[]');
                  let arr = [];
                  try { arr = JSON.parse(list); } catch(e) {}
                  if (!arr.includes(plugin.url)) {
                    arr.push(plugin.url);
                    Lampa.Storage.set('plugins', JSON.stringify(arr));
                    Lampa.Noty.show('Плагин добавлен! Перезапустите интерфейс.');
                  } else {
                    Lampa.Noty.show('Уже установлен.');
                  }
                  Lampa.Modal.close();
                }},
                {title:'Отмена', onSelect:()=>{Lampa.Modal.close();}}
              ]
            });
          });

          itemsContainer.append(card);
        });

        html.find('.list__body').append(itemsContainer);
        scroll.append(html);
        scroll.render().addClass('layer--wheight');

        Lampa.Activity.push({
          url: '',
          title: 'Каталог плагинов',
          component: PLUGIN_ID,
          background: '',
          page: 1
        });

        setTimeout(() => {
          Lampa.Controller.collectionSet(itemsContainer);
          Lampa.Controller.collectionFocus(false, itemsContainer);
        }, 10);
      })
      .catch(err => {
        Lampa.Noty.show('Ошибка загрузки каталога');
        console.error('[Plugin Store Remote] fetch error', err);
      });
  }

  function boot() {
    Lampa.Menu.add({
      title: 'Плагины',
      icon: 'extensions',
      onSelect: openStore
    });
    console.log('[Plugin Store Remote] booted');
  }

  if (Lampa.Listener && Lampa.Listener.follow) {
    Lampa.Listener.follow('app', function(e){
      if (e.type === 'ready') boot();
    });
  } else {
    setTimeout(boot, 500);
  }
})();
