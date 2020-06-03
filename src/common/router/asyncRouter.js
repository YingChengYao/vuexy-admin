const _import = require("./_import"); //获取组件的方法
const res = [];
export const filterAsyncRoutes = routes => {
  console.log("filterroute",routes)
  routes = routes.map(route => {
   
    if (route.children) {
      filterAsyncRoutes(route.children);
    }
     if (route.component) {
      route.component = _import(route.component);
      res.push(route);
    }
  });
  return res;
};
