import request from "./request";

//#region 体检项目
//获取体检项目
export const getItems = params => {
  return request({
    url: "/api/item/list",
    method: "get",
    params: params
  });
};

//添加体检项目
export const addItem = params => {
  return request({
    url: "/api/item/insert",
    method: "post",
    params: params
  });
};

//修改体检项目
export const editItem = params => {
  return request({
    url: "/api/item/update",
    method: "post",
    params: params
  });
};
//#endregion

//#region 体检项目类型
// 获取体检项目类型
export const getItemTypes = params => {
  return request({
    url: "/api/item/type/list",
    method: "get",
    params: params
  });
};

// 插入体检项目类型
export const addItemType = params => {
  return request({
    url: "/api/item/type/insert",
    method: "post",
    params: params
  });
};

// 修改体检项目类型
export const editItemType = params => {
  return request({
    url: "/api/item/type/update",
    method: "post",
    params: params
  });
};
//#endregion

//#region 体检套餐类型

//获取体检套餐类型列表
export const getPackageTypes = params => {
  return request({
    url: "/api/package/type/list",
    method: "get",
    params: params
  });
};

//插入体检套餐类型
export const addPackageType = params => {
  return request({
    url: "/api/package/type/insert",
    method: "post",
    params: params
  });
};

//修改体检套餐类型
export const editPackageType = params => {
  return request({
    url: "/api/package/type/update",
    method: "post",
    params: params
  });
};
//#endregion

//#region 体检套餐
//获取体检套餐
export const getPackages = params => {
  return request({
    url: "/api/package/list",
    method: "get",
    params: params
  });
};

//添加体检项目
export const addPackage = params => {
  return request({
    url: "/api/package/insert",
    method: "post",
    params: params
  });
};

//修改体检项目
export const editPackage = params => {
  return request({
    url: "/api/package/update",
    method: "post",
    params: params
  });
};

//配置套餐项目
export const deployProjectForPackage = params => {
  return request({
    url: "/api/package/item/update",
    method: "post",
    params: params
  });
};
//#endregion
