import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router/client';
import store from './store';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import './assets/css/common.less';
import './assets/font/iconfont.css';
import Print from 'vue-print-nb'
import 'lib-flexible/flexible.js'

Vue.config.productionTip = false;
Vue.use(ViewUI);
Vue.use(Print);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
