/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import Vuex from "vuex";

import getters from "./getters";
import state from "./state"
import mutations from "./mutations"
import actions from "./actions"

Vue.use(Vuex);

import permission from './modules/permission.js'
import auth from './modules/auth.js'

export default new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  modules: {
    permission: permission,
    auth:auth,
  },
  strict: process.env.NODE_ENV !== "production"
});
