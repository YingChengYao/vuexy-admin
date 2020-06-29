import request from "./request";

//获取项目分类数据源
export const getProjectTypeDataSource = params => {
  return request({
    url: "/api/itemtype/list",
    method: "get",
    params: params
  });
};

//获取婚姻状况数据源(用户)
export const getMaritalForUserDataSource = params => {
  return request({
    url: "/api/marital/list",
    method: "get",
    params: params
  });
};

//获取婚姻状况数据源(体检套餐，体检项目使用)
export const getMaritalDataSource = params => {
  return request({
    url: "/api/project/marriage/list",
    method: "get",
    params: params
  });
};

//获取性别数据源(用户)
export const getGenderForUserDataSource = params => {
  return request({
    url: "/api/gender/list",
    method: "get",
    params: params
  });
};

//获取性别数据源(体检套餐，体检项目使用)
export const getGenderDataSource = params => {
  return request({
    url: "/api/project/gender/list",
    method: "get",
    params: params
  });
};

//获取套餐分类数据源
export const getPackageTypes = params => {
  return request({
    url: "/api/packagetype/list",
    method: "get",
    params: params
  });
};

//获取项目单项数据源
export const getProjectItemDataSource = params => {
  return request({
    url: "/api/itemsingle/list",
    method: "get",
    params: params
  });
};

