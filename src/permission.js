import router from "@/router/router";
import store from "@/store/store.js";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { isAuthenticated } from "@/common/utils/auth/token";
//import { getObjArr, saveObjArr } from "@/common/utils/localStorage.js";
//import { filterAsyncRoutes } from "@/store/modules/permission.js";

NProgress.configure({ showSpinner: false }); // NProgress Configuration
let asyncRouterFlag = 0;
//const whiteList = ["/pages/login", "/auth-redirect"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // document.title = to.meta.title;
  document.title = "全人健康-职工健康管理";

  // if (!to.meta.authRequired) {
  //   return next();
  // }
  if (isAuthenticated()) {
    if (to.path === "/pages/login") {
      // 已登录且要跳转的页面是登录页
      next({ path: "/" }); // 跳转到home页
    } else {
      if (!asyncRouterFlag) {
        asyncRouterFlag++;
        const asyncRouters = await store.dispatch("permission/generateRoutes");
        //const asyncRouters = store.getters["ermission/SET_ROUTES"];
        router.$addRoutes(asyncRouters);

        next({ ...to, replace: true });
      } else {
        next();
      }
    }
  } else {
    if (to.path === "/pages/login") {
      next();
    } else {
      next({
        path: "/pages/login",
        query: { redirect: to.path } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
