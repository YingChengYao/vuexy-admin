import request from "./request";

//#region 角色管理
//获取角色列表信息
export const getRoles = params => {
  return request({
    url: "/api/role/list",
    method: "get",
    params: params
  });
};

//添加角色列表信息
export const addRole = params => {
  return request({
    url: "/api/role/insert",
    method: "post",
    params: params
  });
};

//修改角色列表信息
export const editRole = params => {
  return request({
    url: "/api/role/update",
    method: "post",
    params: params
  });
};
//#endregion

//#region 菜单管理
//获取菜单配置信息
export const getMenusForRole = params => {
  return request({
    url: "/api/menu/configure/list",
    method: "get",
    params: params
  });
};

//获取菜单信息列表
export const getMenus = params => {
  return request({
    url: "/api/menu/page/list",
    method: "get",
    params: params
  });
};

//#endregion
