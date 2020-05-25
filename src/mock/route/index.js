export default {
  getRoutes: () => ({
    data: {
      router: [
        {
          path: "",
          //component: () => import("@/layouts/main/Main.vue"),
          componentPath: "/main/Main",
          children: [
            {
              path: "/permission",
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
