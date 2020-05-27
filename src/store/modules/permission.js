//import { constantRoutes } from "@/router";
import { getRoutes } from "@/http/api.js";
import { filterAsyncRoutes } from "@/common/router/asyncRouter.js";

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
      debugger;
      getRoutes()
        .then(res => {
          const { data } = res;
          const asyncRouter = data.data.router;
          console.log("routers:", data.data.router);

          const baseRouter = [
            {
              path: "",
              component: () => import("@/layouts/main/Main.vue"),
              children: []
            }
          ];

          const routes = filterAsyncRoutes(asyncRouter);
          baseRouter[0].children = routes;
          commit("SET_ROUTES", data.data.router);
          resolve(baseRouter);
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
