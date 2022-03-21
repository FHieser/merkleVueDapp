import Vue from 'vue'
import App from './MerkleDapp.vue'
import vuetify from './plugins/vuetify'
import { ethers } from "ethers";

Vue.use(ethers)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')