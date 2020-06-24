/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import App from "./App.vue";

// Vuesax Component Framework
//import Vuesax from "vuesax";
import Vuesax from "@/lib/vuesax/vuesax.common.js";
import "@/lib/vuesax/vuesax.css"; // Vuesax
Vue.use(Vuesax);

import "material-icons/iconfont/material-icons.css"; //Material Icons


import "./mock/index.js";

// Theme Configurations
import "../themeConfig.js";

// Globally Registered Components
import "./globalComponents.js";

// Styles: SCSS
import "./assets/scss/main.scss";

// Tailwind
import "@/assets/css/main.css";

// Vue Router
import router from "@/router/router";
import "./permission.js";

//按钮权限
import { hasBtnPermission } from '@/common/utils/auth/permission.js' 

// Vuex Store
import store from "./store/store";

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from "vue2-hammer";
Vue.use(VueHammer);

// PrismJS
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Feather font icon
require("./assets/css/iconfont.css");

//iconfont
import '@/assets/icon/iconfont.css'

// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css'

import validate, { config } from "@/lib/vee-validate/zh"; //中文提示
Vue.use(validate, config);

Vue.config.productionTip = false;
Vue.prototype.hasPerm = hasBtnPermission

import * as filters from "@/common/plugins/filters.js";
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]); //插入过滤器名和对应方法
});

var vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
export default vue;
