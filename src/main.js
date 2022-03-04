import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueLazyload from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

// 事件总线
Vue.prototype.$bus = new Vue();

// 安装toast插件
Vue.use(toast);

// 安装懒加载
Vue.use(VueLazyload, {
  loading: require('./assets/img/common/loading.png')
});

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
