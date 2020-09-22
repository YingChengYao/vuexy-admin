const _import = require("./_import"); //获取组件的方法

export function filterAsyncRoutes(routes) {
  const res = [];
  routes.map((route, index) => {
    if (route.path !== "-" && route.componentPath) {
      route.component = _import(componentPath); // => import(`@/${route.componentPath}`);
      const tmp = { ...route };
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children);
      }
      res.push(tmp);
    }
  });

  return res;
}
