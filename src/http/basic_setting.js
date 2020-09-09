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


//配置角色所需菜单信息
export const deployMenuForRole = params => {
  return request({
    url: "/api/role/menu/configure",
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

//增加菜单
export const addMenu = params => {
  return request({
    url: "/api/menu/insert",
    method: "post",
    params: params
  });
};

//修改菜单
export const editMenu = params => {
  return request({
    url: "/api/menu/Update",
    method: "post",
    params: params
  });
};

//获取菜单详情数据
export const getMenuDetail = params => {
  return request({
    url: "/api/menu/details",
    method: "get",
    params: params
  });
};

//获取用户权限的菜单数据
export const getMenusForUser = params => {
  return request({
    url: "/api/menu/list",
    method: "get",
    params: params
  });
};

//#endregion
