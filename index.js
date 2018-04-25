exports.delphireJS = function() {

  class PortalMessaging {
    constructor({ targetWindow }) {
      this.targetWindow = targetWindow;
      null;
    }
    emit(eventName, data) {
      this.targetWindow.postMessage({ eventName, data }, '*');
      return null;
    }
    on(eventName, callback) {
      window.addEventListener('message', function(event) {
        if (event.data.eventName === eventName) { return callback(event, event.data.data); }
      });
      return null;
    }
  }

  class DelphireStorage {
    constructor() {  }
    getItem(name) {
      let itemObj;
      const itemString = window.localStorage.getItem(name);
      try {
        itemObj = JSON.parse(itemString);
      } catch (error) {
        itemObj = {};
      }
      return itemObj;
    }
    setItem(name, data) {
      window.localStorage.setItem(name, JSON.stringify(data));
      return null;
    }
  }

  class Delphire {
    static initClass() {
      this.prototype.bridge = null;
    }

    constructor() {  }

    init(props) {

      let val;
      for (var key of Object.keys(props || {})) { val = props[key]; this[key] = val; }
      this.bridge = {};

      // set up bridge
      if (!this.bridge.type) {
        if (window.electronRequire != null) { this.bridge.type = "electron"; }
        else { this.bridge.type = "iframe"; }
      }
      console.info(`[ delphire ] using ${this.bridge.type}`);
      switch (this.bridge.type) {
        case "electron":
          this.bridge.default = new ElectronMessaging({ ipcRenderer: window.electronRequire('electron').ipcRenderer });
          break;
        case "iframe":
          this.bridge.default = new PortalMessaging({ targetWindow: window.top });
          break;
        default:
          this.bridge.default = new PortalMessaging({ targetWindow: window.top });
      }

      // set up storage
      this.storage = new DelphireStorage();

      return new Promise((resolve, reject) => {
        this.bridge.default.on('delphire-api-data', (event, data) => {
          for (key of Object.keys(data || {})) { val = data[key]; this[key] = val; }
          return resolve();
        });
        this.bridge.default.emit('request-api-data');
        return null;
      });
    }

    close() { return this.bridge.default.emit('close'); }

    internalLink({ key, payload }) {
      const params = {
        key,
        payload
      };
      this.bridge.default.emit('internal-link', params);
      return null;
    }

    openResource({ key, id }) {
      const params = {
        id,
        key
      };
      this.bridge.default.emit('open-resource', params);
      return null;
    }

    networkFailure() {
      this.bridge.default.emit('network-failure');
      return null;
    }

    track(props) {
      this.bridge.default.emit('track', props);
      return null;
    }

    progress(props) {
      if (location.href.indexOf('localhost') !== -1) { console.info('[ progress service ]', props); }
      this.bridge.default.emit('progress', props);
      return null;
    }

    moduleProgress(props) {
      if (location.href.indexOf('localhost') !== -1) { console.info('[ module progress service ]', props); }
      this.bridge.default.emit('module-progress', props);
      return null;
    }

    getSubordinates() {
      return new Promise((resolve, reject) => {
        this.bridge.default.on('on-subordinates', (event, data) => resolve(data.subordinates));
        this.bridge.default.emit('request-subordinates');
        return null;
      });
    }

    getManager() {
      return new Promise((resolve, reject) => {
        this.bridge.default.on('on-manager', (event, data) => resolve(data.manager));
        this.bridge.default.emit('request-manager');
        return null;
      });
    }

    currentUser() { return new Promise((resolve, reject) => resolve(this.currentUser)); }
  }
  Delphire.initClass();


  const delphire = new Delphire();
  window.Delphire = (window.Delphi = delphire);

  return delphire;

};
