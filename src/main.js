import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import './common/stylus/index.styl'
import 'swiper/dist/css/swiper.css'
import VueLazyload from 'vue-lazyload';
import store from './store'
import './common/fonts/iconfont.css'
// import './common/js/hack'

Vue.config.productionTip = false
fastclick.attach(document.body)

Vue.use(VueLazyload, {
  
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
