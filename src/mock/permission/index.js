export default {
    getMenus: () => ({
      data: {
        router: [
          {
            name:"ss",
            path: "",
            //component: () => import("@/layouts/main/Main.vue"),
            component: "@/layouts/main/Main",
            children: [
              {
                path: "/permission",
                name: "permission",
                //component: () => import("@/views/Permission/Permission.vue"),
                component: "@/views/Permission/Permission",
                meta: {
                  title: 'Permission',
                }
              },
              {
                path: "/assign",
                name: "assign",
                // component: () => import("@/views/Permission/Assign.vue"),
                component: "@/views/Permission/Assign",
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
  