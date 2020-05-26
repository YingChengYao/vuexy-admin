//import { constantRoutes } from "@/router";
import { getRoutes } from "@/http/api.js";

export function filterAsyncRoutes(routes) {
  const res = [];
  routes.forEach(route => {
    if (route.path === "") {
      route.component = () => import(`@/layouts${route.componentPath}.vue`);
    } else {
      route.component = () => import(`@/views${route.componentPath}.vue`);
    }
    const tmp = { ...route };
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children);
    }
    res.push(tmp);
  });

  return res;
}

const state = {
  routes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes;
  }
};

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      //const token = state.token;
      debugger
      getRoutes()
        .then(res => {
          const { data } = res;
          debugger;
          console.log("routers:", data.data.router);
          commit("SET_ROUTES", data.data.router);
          resolve(data.data.router);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
