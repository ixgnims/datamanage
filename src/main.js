import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
import router from './router'
import store from './store' //store是vuex的实例化对象
import axios from 'axios';
import LazyDirective from './directives/lazy'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VXETable from "vxe-table";
import 'vxe-table/lib/style.css';

//import * as echarts from 'echarts'
import 'echarts';
import ECharts from 'vue-echarts';
Vue.component('ECharts', ECharts);

Vue.directive('lazy', LazyDirective);

axios.defaults.baseURL = 'http://localhost:8000/';

Vue.use(VueCompositionAPI)
Vue.use(ElementUI); //用不用use根据组件规范而定
Vue.use(VXETable)
Vue.config.productionTip = false
Vue.prototype.$axios = axios;
//Vue.prototype.$echarts = echarts;

new Vue({
  router,
  store,
  render: h => h(App) //render渲染
}).$mount('#app')
