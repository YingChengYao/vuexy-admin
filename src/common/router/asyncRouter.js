const _import = require('@/common/router/_import.js') //获取组件的方法

export function filterAsyncRoutes(routes) {
    const res = [];
    routes.map(route => {
      if (route.path !== "-" && route.componentPath) {
        route.component = _import(route.componentPath);// => import(`@/${route.componentPath}`);
        const tmp = { ...route };
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children);
        }
        res.push(tmp);
      }
    });
  
    return res;
  }