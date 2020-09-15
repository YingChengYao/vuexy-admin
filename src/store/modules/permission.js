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
      //const token = state.token;
      getRoutes()
        .then(res => {
          debugger;
          let asyncRouter = [];
          if (res.resultType == 0) {
            const data = JSON.parse(res.message);
            asyncRouter = data;
          }
          console.log("route:", asyncRouter);

          // const { data } = res;
          // const asyncRouter = data.router;

          const baseRouter = [
            {
              path: "",
              component: () => import("@/layouts/main/Main.vue"),
              children: []
            }
          ];
          console.log("asyncRouter:", asyncRouter);
          const router = filterAsyncRoutes(asyncRouter);
          console.log("asyncRouter-router:", router);

          baseRouter[0].children = router;

          // baseRouter[0].children.push(s);
          //动态加载解决刷新后404问题
          // baseRouter.push({
          //   path: "*",
          //   redirect: "/pages/error-404"
          // });
          // baseRouter.push({
          //   path: "",
          //   component: () => import("@/layouts/full-page/FullPage.vue"),
          //   children: [
          //     {
          //       path: "/pages/error-404",
          //       name: "page-error-404",
          //       component: () => import("@/views/pages/Error404.vue")
          //     }
          //   ]
          // });

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
