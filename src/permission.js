import router from "@/router/router";
import store from "@/store/store.js";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
// import { getToken } from "@/common/utils/auth"; // get token from cookie
import { getObjArr,saveObjArr } from "@/common/utils/localStorage.js";
import { filterAsyncRoutes } from "@/store/modules/permission.js";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/pages/login", "/auth-redirect"]; // no redirect whitelist
var getRouter //用来获取后台拿到的路由

/*vue是单页应用，刷新时，重新创建实例，需要重新加载的动态路由，不然匹配不到路由，出现页面空白的情况*/
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = to.meta.title;
  debugger;
  if (!to.meta.authRequired) {
    return next();
  }

  // determine whether the user has logged in
  // let hasToken = getToken();
  const hasToken = true;
  //var getRouter;
  debugger;
  if (hasToken) {
    if (to.path === "/pages/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done(); // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      debugger;
      const hasRoutes = store.getters.routes && store.getters.routes.length > 0;

      if (hasRoutes) {
        next();
      } else {
        try {
          // if (!getRouter) {
            const getRouter=getObjArr("router")
            //不加这个判断，路由会陷入死循环
            if (!getRouter) {
              const accessRoutes = await store.dispatch(
                "permission/generateRoutes"
              );

              router.addRoutes(accessRoutes);

              saveObjArr("router", accessRoutes); //存储路由到localStorage
              next({ ...to, replace: true });
              NProgress.done();
            } else {
              //从localStorage拿到了路由
              //getRouter = getObjArr("router"); //拿到路由
              let accessedRoutes = filterAsyncRoutes(getRouter);
              router.addRoutes(accessedRoutes);
              store.commit('permission/SET_ROUTES', accessedRoutes)
              next({ ...to, replace: true });
              NProgress.done();
            }
          // } else {
          //   next();
          // }
        } catch (error) {
          console.log(error);
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          // Message.error(error || 'Has Error')
          //添加错误信息通知TODO
          next(`/pages/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/pages/login?redirect=${to.path}`);
      // next({
      //   path: "/pages/login",
      //   query: { redirect: to.path } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      // });
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
