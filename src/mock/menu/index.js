export default {
  getMenu: () => ({
    data: {
      router: [
        {
          path: "",
          component: () => import("@/layouts/main/Main.vue"),
          children: [
            {
              path: "/permission",
              name: "permission",
              component: () => import("@/views/Permission/Permission.vue"),
              meta: {
                title: 'Permission',
              }
            },
            {
              path: "/assign",
              name: "assign",
              component: () => import("@/views/Permission/Assign.vue"),
              meta: {
                title: 'Assign',
              }
            }
          ]
        }
      ]
    }
  })
};
