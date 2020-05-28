/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import store from "@/store/store.js";

export function filterAsyncRrouter(routes) {
  const res = [];
  routes.map(route => {
    const tmp = {};
    const path = route.path;
    if (path === "-") {
      tmp.url = null;
    } else {
      tmp.url = path;
      tmp.slug = route.slug;
    }
    tmp.name = route.name;
    tmp.icon = route.icon;
    if (route.children) {
      tmp.submenu = filterAsyncRrouter(route.children);
    }
    res.push(tmp);
  });

  return res;
}

const router = filterAsyncRrouter(store.getters.routes);
//slug填路由path
// const router = [
//   // {
//   //   url: "/",
//   //   name: "首页",
//   //   slug: "home",
//   //   icon: "HomeIcon",
//   //   i18n: "Home"
//   // },
//   // {
//   //   url: "/page2",
//   //   name: "页面2",
//   //   slug: "page2",
//   //   icon: "FileIcon",
//   //   i18n: "page2"
//   // },
//   {
//     url: null,
//     name: "菜单权限管理",
//     icon: "FileIcon",
//     // i18n: 'eCommerce',
//     submenu: [
//       {
//         url: "/permission",
//         name: "菜单管理",
//         slug: "permission"
//         // i18n: 'Shop'
//       },
//       {
//         url: "/assign",
//         name: "权限管理",
//         slug: "assign"
//         // i18n: 'ItemDetails'
//       }
//     ]
//   }
// ];

export default router;
