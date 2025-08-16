/* 
 * Lampa Plugin Store (каталог плагинов)
 * Version: 1.0.0
 */
(function() {
  'use strict';

  if (typeof window.Lampa === 'undefined') return;
  const Lampa = window.Lampa;

  const PLUGIN_ID = 'plugin.store';
  const PLUGIN_NAME = 'Каталог плагинов';
  const PLUGIN_VERSION = '1.0.0';

  // Список доступных плагинов
  const plugins = [
    {
      title: "Demo каталог",
      description: "Пример каталога с видео",
      poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
      url: "https://example.com/demo-plugin.js"
    },
    {
      title: "Онлайн Радио",
      description: "Слушай радио в Lampa",
      poster: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Radio_icon.png",
      url: "https://example.com/radio-plugin.js"
    }
  ];

  function openStore() {
    const html = Lampa.Template.get('list');
    const scroll = new Lampa.Scroll({over: true});

    const header = Lampa.Template.get('title');
    header.find('.title__left').text('Каталог плагинов');
    header.find('.title__right').text('v' + PLUGIN_VERSION);
    html.find('.list__head').append(header);

    const itemsContainer = Lampa.Template.get('tiles');

    plugins.forEach(plugin => {
      const card = Lampa.Template.get('card', {
        title: plugin.title,
        poster: plugin.poster
      });

      card.on('hover:focus', () => {
        html.find('.title__left').text(plugin.title);
        html.find('.title__right').text(plugin.description);
        Lampa.Background.change(plugin.poster);
      });

      card.on('hover:enter', () => {
        Lampa.Modal.open({
          title: plugin.title,
          html: `<div style="padding:1em">${plugin.description}</div>`,
          size: 'medium',
          onBack: () => {
            Lampa.Modal.close();
          },
          onSelect: () => {
            // добавляем плагин в список установленных
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
          },
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
  }

  function boot() {
    Lampa.Menu.add({
      title: 'Плагины',
      icon: 'extensions',
      onSelect: openStore
    });
    console.log('[Plugin Store] booted');
  }

  if (Lampa.Listener && Lampa.Listener.follow) {
    Lampa.Listener.follow('app', function(e){
      if (e.type === 'ready') boot();
    });
  } else {
    setTimeout(boot, 500);
  }
})();
