export default {
  getRoutes: () => ({
    data: {
      router: [
        {
          path: "-",
          name: "管理",
          icon: "FileIcon",
          children: [
            {
              path: "/",
              name: "home",
              componentPath: "/Home",
              meta: {
                authRequired: true
              }
            }
          ]
        },
        {
          path: "-",
          icon: "FileIcon",
          name: "用户角色管理",
          children: [
            {
              path: "/users",
              url: "/users",
              name: "用户管理",
              slug: "users",
              componentPath: "/User/Users",
              meta: {
                title: "用户管理",
                authRequired: true
              }
            },
            {
              path: "/roles",
              url: "/roles",
              name: "角色管理",
              slug: "roles",
              // component: () => import("@/views/Permission/Assign.vue"),
              componentPath: "/User/Roles",
              meta: {
                title: "角色管理",
                authRequired: true
              }
            }
          ]
        },
        {
          path: "-",
          //component: () => import("@/layouts/main/Main.vue"),
          componentPath: "/main/Main",
          icon: "FileIcon",
          name: "菜单权限管理",
          children: [
            {
              path: "/permission",
              url: "/permission",
              slug: "permission",
              name: "权限管理",
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
              slug: "assign",
              name: "菜单管理",
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
