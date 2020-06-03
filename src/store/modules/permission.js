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

      getRoutes()
        .then(res => {
          const { data } = res;
          const asyncRouter = data.router;

          const baseRouter = [
            {
              path: "",
              component: () => import("@/layouts/main/Main.vue"),
              children: []
            }
          ];
          const router = filterAsyncRoutes(asyncRouter);
          baseRouter[0].children = router;
          //动态加载解决刷新后404问题
          baseRouter.push({
            path: "*",
            redirect: "/pages/error-404"
          });
          baseRouter.push({
            path: "",
            component: () => import("@/layouts/full-page/FullPage.vue"),
            children: [
              {
                path: "/pages/error-404",
                name: "page-error-404",
                component: () => import("@/views/pages/Error404.vue")
              }
            ]
          });

          commit("SET_ROUTES", data.router);
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
