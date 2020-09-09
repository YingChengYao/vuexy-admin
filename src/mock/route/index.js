export default {
  getRoutes: () => ({
    data: {
      router: [
        // {
        //   path: "/",
        //   name: "首页",
        //   component: "views/Home",
        //   icon: "HomeIcon",
        //   slug: "home",
        //   meta: {
        //     title: "首页"
        //   }
        // },
        {
          path: "-",
          icon: "FileIcon",
          name: "会员管理",
          isHide: true,
          children: [
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
          icon: "iconfont icon-taocan",
          name: "套餐管理",
          displayName: "套餐管理",
          children: [
            {
              path: "/package",
              name: "package",
              displayName: "套餐列表",
              slug: "package",
              component: "views/medical/package/List",
              meta: {
                title: "套餐列表"
              }
            },
            {
              path: "/package_edit",
              name: "package_edit",
              slug: "package_edit",
              component: "views/medical/package/Edit",
              isHide: true,
              meta: {
                title: "套餐管理"
              }
            },
            {
              path: "/package_type",
              name: "套餐类型管理",
              displayName: "套餐类型管理",
              slug: "package_type",
              component: "views/medical/package_type/List",
              meta: {
                title: "套餐类型管理"
              }
            },
            {
              path: "/projects",
              name: "项目配置",
              displayName: "项目配置",
              slug: "projects",
              component: "views/medical/project/List",
              meta: {
                title: "项目配置"
              }
            },
            {
              path: "/project_type",
              url: "/project_type",
              name: "项目类型管理",
              displayName: "项目类型管理",
              slug: "project_type",
              component: "views/medical/project_type/List",
              meta: {
                title: "项目类型管理"
              }
            },
            {
              path: "/project_item",
              url: "/project_item",
              name: "项目单项管理",
              displayName: "项目单项管理",
              slug: "project_item",
              component: "views/medical/project_item/List",
              meta: {
                title: "项目单项管理"
              }
            },
            {
              path: "/project_item_edit/:id/:mark",
              url: "/project_item_edit/:id",
              name: "project_item_edit",
              displayName: "项目单项管理",
              slug: "project_item_edit",
              component: "views/medical/project_item/Edit",
              isHide: true,
              meta: {
                title: "项目单项管理"
              }
            }
          ]
        },
        {
          path: "-",
          icon: "iconfont icon-w_zhiyuan",
          name: "基本信息管理",
          displayName: "基本信息管理",
          children: [
            {
              path: "/unit",
              url: "/unit",
              name: "分支机构管理",
              displayName: "分支机构管理",
              slug: "unit",
              component: "views/staff/unit/List",
              meta: {
                title: "分支机构管理"
              }
            },
            {
              path: "/position",
              url: "/position",
              name: "职位管理",
              displayName: "职位管理",
              slug: "position",
              component: "views/staff/position/List",
              meta: {
                title: "职位管理"
              }
            },
            {
              path: "/employee",
              url: "/employee",
              name: "员工管理",
              displayName: "员工管理",
              slug: "employee",
              component: "views/staff/employee/List",
              meta: {
                title: "员工管理"
              }
            }
          ]
        },
        {
          path: "-",
          icon: "iconfont icon-tijianjihua",
          name: "体检计划",
          displayName: "体检计划",
          children: [
            {
              path: "/plan",
              url: "/plan",
              name: "体检计划",
              displayName: "体检计划",
              slug: "unit",
              component: "views/plan/List",
              meta: {
                title: "体检计划"
              }
            },
            {
              path: "/physical_examination",
              url: "/physical_examination",
              name: "体检动态",
              displayName: "体检动态",
              slug: "unit",
              component: "views/plan/physical_examination/List",
              meta: {
                title: "体检动态"
              }
            }
          ]
        },
        {
          path: "-",
          icon: "iconfont icon-tijianjihua",
          name: "体检计划",
          displayName: "体检计划",
          children: [
            {
              path: "/physical_plan",
              url: "/physical_plan",
              name: "体检计划",
              displayName: "体检计划",
              slug: "unit",
              component: "views/medical_examination_center/physical_plan/List",
              meta: {
                title: "体检计划"
              }
            }
          ]
        },
        {
          path: "-",
          icon: "iconfont icon-tijianzhongxin",
          name: "体检中心管理",
          displayName: "体检中心管理",
          children: [
            {
              path: "/medical_center",
              url: "/medical_center",
              name: "体检中心",
              displayName: "体检中心",
              slug: "unit",
              component: "views/medical_center/List",
              meta: {
                title: "体检中心"
              }
            }
          ]
        },
        {
          path: "-",
          icon: "iconfont icon-jichushezhi",
          name: "基础设置",
          displayName: "基础设置",
          isHide: false,
          children: [
            {
              path: "/user-settings",
              url: "/user-settings",
              slug: "user-settings",
              name: "用户设置",
              displayName: "用户设置",
              component: "views/basic_settings/user_settings/UserSettings"
            },
            {
              path: "/user_management",
              url: "/user_management",
              slug: "user_management",
              name: "用户管理",
              displayName: "用户管理",
              component: "views/basic_settings/user_management/List"
            },
            {
              path: "/permission",
              url: "/permission",
              slug: "permission",
              name: "权限管理",
              displayName: "权限管理",
              component: "views/basic_settings/Permission",
              isHide: true,
              meta: {
                title: "Permission"
              }
            },
            {
              path: "/menu",
              url: "/menu",
              slug: "menu",
              name: "菜单管理",
              displayName: "菜单管理",
              component: "views/basic_settings/menu/List",
              meta: {
                title: "menu"
              }
            },
            {
              path: "/role",
              url: "/role",
              slug: "role",
              name: "角色管理",
              displayName: "角色管理",
              component: "views/basic_settings/role/List",
              meta: {
                title: "角色管理"
              }
            }
          ]
        },
        {
          path: "-",
          icon: "iconfont icon-xitong",
          name: "系统设置",
          displayName: "系统设置",
          isHide: false,
          children: [
            {
              path: "/dictionary",
              url: "/dictionary",
              slug: "dictionary",
              name: "字典管理",
              displayName: "字典管理",
              component: "views/system_settings/dictionary/List"
            }
          ]
        }
      ]
    }
  })
};
