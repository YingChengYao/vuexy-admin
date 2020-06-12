import { is } from "core-js/fn/object";

export default {
  getRoutes: () => ({
    data: {
      router: [
        {
          path: "/",
          name: "首页",
          component: "views/Home",
          icon: "HomeIcon",
          slug: "home",
          meta: {
            authRequired: true,
            title: "首页"
          }
        },
        // {
        //   path: "/Page2",
        //   name: "Page2",
        //   component: "views/Page2",
        //   icon: "HomeIcon",
        //   slug: "Page2",
        //   meta: {
        //     authRequired: true,
        //     title: "Page2"
        //   }
        // },
        {
          path: "-",
          icon: "FileIcon",
          name: "会员管理",
          children: [
            {
              path: "/integral",
              url: "/integral",
              name: "积分管理",
              slug: "integral",
              component: "views/Member/Integral/Integral",
              meta: {
                title: "积分管理"
              }
            },
            {
              path: "/member-user",
              url: "/member-user",
              name: "用户管理",
              slug: "member-user",
              component: "views/Member/User/User",
              meta: {
                title: "用户管理"
              }
            },
            {
              path: "/member-user-edit/:userId",
              url: "/member-user-edit",
              name: "用户信息修改",
              slug: "member-user",
              component: "views/Member/User/UserEdit",
              isHide: true,
              meta: {
                title: "用户信息修改",
                isHide: true
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
              path: "/roles",
              url: "/roles",
              name: "角色管理",
              slug: "roles",
              component: "views/User/Roles",
              meta: {
                title: "角色管理",
                authRequired: true
              }
            }
          ]
        },
        {
          path: "-",
          icon: "FileIcon",
          name: "基础设置",
          children: [
            {
              path: "/permission",
              url: "/permission",
              slug: "permission",
              name: "个人中心",
              component: "views/BasicSettings/Permission",
              meta: {
                title: "Permission"
              }
            },
            {
              path: "/permission",
              url: "/permission",
              slug: "permission",
              name: "权限管理",
              component: "views/BasicSettings/Permission",
              meta: {
                title: "Permission"
              }
            },
            {
              path: "/menu",
              url: "/menu",
              slug: "menu",
              name: "菜单管理",
              component: "views/BasicSettings/Menu",
              meta: {
                title: "menu"
              }
            }
          ]
        },
        {
          path: "-",
          icon: "FileIcon",
          name: "系统设置",
          children: [
            {
              path: "/user-settings",
              url: "/user-settings",
              slug: "user-settings",
              name: "用户设置",
              component: "views/SystemSettings/UserSettings/UserSettings",
              meta: {
                title: "用户设置"
              }
            }
          ]
        }
      ]
    }
  })
};
