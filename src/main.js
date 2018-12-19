import Vue from 'vue'
import App from './App.vue'
import VeeValidate from 'vee-validate'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { router } from './router'
import store from './store'

// layouts
import Default from './layouts/default'
import Dashboard from './layouts/dashboard'
import FullPage from './layouts/full-page'
import Settings from './layouts/settings'

Vue.component('default-layout', Default)
Vue.component('dashboard-layout', Dashboard)
Vue.component('full-page-layout', FullPage)
Vue.component('settings-layout', Settings)

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(VeeValidate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
