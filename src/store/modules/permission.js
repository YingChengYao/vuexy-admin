import { getRoutes } from "@/http/auth.js";
import { filterAsyncRoutes } from "@/common/router/asyncRouter.js";
import { clone } from "@/common/utils/data/clone";

const state = {
  routes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = clone(routes);
  }
};

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getRoutes()
        .then(res => {
          let asyncRouter = [];
          if (res.resultType == 0) {
            const data = JSON.parse(res.message);
            asyncRouter = data;
          }

          const baseRouter = [
            {
              path: "",
              component: () => import("@/layouts/main/Main.vue"),
              children: []
            }
          ];

          const router = filterAsyncRoutes(asyncRouter);

          baseRouter[0].children = router;

          //动态加载刷新后404页面
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

          commit("SET_ROUTES", asyncRouter);
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
