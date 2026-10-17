// Jembatan penyimpanan game. Game di pemutar berjalan pada origin sandbox
// dan hanya menerima kunci dengan prefix yang dikirim pemutar.
(function () {
  var embedded = window.parent !== window;
  var values = Object.create(null);
  var prefix = '';
  var resolveReady;
  var ready = new Promise(function (resolve) { resolveReady = resolve; });

  function validKey(key) {
    return typeof key === 'string' && key.length <= 256 && prefix && key.startsWith(prefix);
  }

  if (embedded) {
    window.addEventListener('message', function (event) {
      if (event.source !== window.parent) return;
      var message = event.data;
      if (!message || message.app !== 'nvanplay' || message.type !== 'storage:init') return;
      if (typeof message.prefix !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*:$/.test(message.prefix)) return;
      prefix = message.prefix;
      values = Object.create(null);
      if (message.values && typeof message.values === 'object' && !Array.isArray(message.values)) {
        Object.keys(message.values).forEach(function (key) {
          var value = message.values[key];
          if (validKey(key) && typeof value === 'string' && value.length <= 10000) values[key] = value;
        });
      }
      resolveReady();
    });
    window.parent.postMessage({ app: 'nvanplay', type: 'storage:request' }, '*');
  } else {
    // Game yang dibuka sendiri tetap bisa dimainkan, tetapi tanpa akses storage situs.
    resolveReady();
  }

  window.nvanplayStorage = Object.freeze({
    ready: ready,
    getItem: function (key) {
      key = String(key);
      return validKey(key) && Object.prototype.hasOwnProperty.call(values, key) ? values[key] : null;
    },
    setItem: function (key, value) {
      key = String(key);
      value = String(value);
      if (!embedded || !validKey(key) || value.length > 10000) return;
      values[key] = value;
      window.parent.postMessage({ app: 'nvanplay', type: 'storage:set', key: key, value: value }, '*');
    }
  });
})();
