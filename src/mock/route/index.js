export default {
  getRoutes: () => ({
    data: {
      router: [
        {
          path: "",
          //component: () => import("@/layouts/main/Main.vue"),
          componentPath: "/main/Main",
          icon: "FileIcon",
          name: "菜单权限管理",
          children: [
            {
              path: "",
              componentPath: "/main/Main",
              icon: "FileIcon",
              name: "菜单权限管理",
              children: [
                {
                  path: "/",
                  url: "/",
                  name: "home",
                  //component: () => import("@/views/Permission/Permission.vue"),
                  componentPath: "/Home",
                  meta: {
                    title: "Home",
                    authRequired: true
                  }
                },
                {
                  path: "/page2",
                  url: "/page2",
                  name: "page2",
                  // component: () => import("@/views/Permission/Assign.vue"),
                  componentPath: "/Page2",
                  meta: {
                    title: "Page2",
                    authRequired: true
                  }
                }
              ]
            },
            {
              path: "/permission",
              url: "/permission",
              name: "permission",
              //component: () => import("@/views/Permission/Permission.vue"),
              componentPath: "/Permission/Permission",
              meta: {
                title: "Permission",
                authRequired: true
              }
            },
            {
              path: "/assign",
              url: "/assign",
              name: "assign",
              // component: () => import("@/views/Permission/Assign.vue"),
              componentPath: "/Permission/Assign",
              meta: {
                title: "Assign",
                authRequired: true
              }
            }
          ]
        }
      ]
    }
  })
};
