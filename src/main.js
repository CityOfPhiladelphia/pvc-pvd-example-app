import Vue from 'vue';
import axios from 'axios';
import createStore from './store';
import configMixin from './util/config-mixin';
import App from './components/App.vue';
import mergeDeep from './util/merge-deep';
import config from './config.js'

import '@fortawesome/fontawesome-pro/js/all';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import philaVueComps from '@cityofphiladelphia/phila-vue-comps';
import philaVueDatafetch from '@cityofphiladelphia/phila-vue-datafetch';
const controllerMixin = philaVueDatafetch.controllerMixin;

const clientConfig = config;
const baseConfigUrl = config.baseConfig;

function initVue(config) {
  const store = createStore(config);

  // make config accessible from each component via this.$config
  Vue.use(configMixin, config);

  // mix in controller
  Vue.use(controllerMixin, { config, store });

  Vue.component('font-awesome-icon', FontAwesomeIcon)
  // mount main vue
  const vm = new Vue({
    el: '#vue-app',
    render: h => h(App),
    store
  });
}

// if there is a base config, get base config
if (baseConfigUrl) {
  axios.get(baseConfigUrl).then(response => {
    const data = response.data;
    const baseConfigFn = eval(data);
    const { gatekeeperKey } = clientConfig;
    const baseConfig = baseConfigFn({ gatekeeperKey });

    // deep merge base config and client config
    const config = mergeDeep(baseConfig, clientConfig);

    initVue(config);
  }).catch(err => {
    console.error('Error loading base config:', err);
  });

} else {
  initVue(clientConfig);
}
