const _import = require("./_import"); //获取组件的方法
const res = [];
export const filterAsyncRoutes = routes => {
  
  debugger;
  //console.log("routes1:",routes)
  console.log("filterroute",routes)
  routes = routes.map(route => {
    //const tmp = { ...route };
   
    if (route.children) {
      //tmp.children = filterAsyncRoutes(tmp.children);
      filterAsyncRoutes(route.children);
    }
    // if (route.component) {
    //   // const tmp = {};
    //   // tmp.name = route.name;
    //   // tmp.path = route.path;
    //   // tmp.meta = route.meta;
    //   // tmp.component = _import(route.component);
    //   route.component = _import(route.component);
    //   const tmp = { ...route };
    //   res.push(tmp);
    // }
     if (route.component) {
      route.component = _import(route.component);
      res.push(route);
    }
    // return route.component;
  });
  //res.push(routes);
  console.log("routes2:", routes);
  return res;
};
