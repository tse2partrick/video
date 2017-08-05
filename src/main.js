// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import store from './store'
import 'common/stylus/index.styl'
import 'common/fonts/iconfont.css'

import VueLazyLoad from 'vue-lazyload'
fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('common/images/lazy.jpg')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
