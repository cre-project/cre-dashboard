import Vue from 'vue'
import App from './App.vue'
import VeeValidate from 'vee-validate'
import Buefy from 'buefy'
import VueNumeric from 'vue-numeric'
import 'buefy/dist/buefy.css'
import { router } from './router'
import store from './store'
import accounting from 'accounting-js'
// layouts
import Default from './layouts/default'
import Empty from './layouts/empty'
import Dashboard from './layouts/dashboard'
import FullPage from './layouts/full-page'
import Settings from './layouts/settings'
// components
import PropertyMissing from './components/PropertyMissing'

// layouts
Vue.component('default-layout', Default)
Vue.component('empty-layout', Empty)
Vue.component('dashboard-layout', Dashboard)
Vue.component('full-page-layout', FullPage)
Vue.component('settings-layout', Settings)

// components
Vue.component('property-missing', PropertyMissing)

Vue.config.productionTip = false

Vue.filter('money', function (value) {
  return accounting.formatMoney(value, { precision: 0 })
})

Vue.use(VueNumeric)
Vue.use(Buefy)
Vue.use(VeeValidate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
