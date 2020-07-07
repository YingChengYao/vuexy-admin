import request from "./request";

//获取项目分类数据源
export const getProjectTypeDataSource = params => {
  return request({
    url: "/api/itemtype/select",
    method: "get",
    params: params
  });
};

//获取婚姻状况数据源(用户)
export const getMaritalForUserDataSource = params => {
  return request({
    url: "/api/user/marital/select",
    method: "get",
    params: params
  });
};

//获取婚姻状况数据源(体检套餐，体检项目使用)
export const getMaritalDataSource = params => {
  return request({
    url: "/api/project/marriage/select",
    method: "get",
    params: params
  });
};

//获取性别数据源(用户)
export const getGenderForUserDataSource = params => {
  return request({
    url: "/api/user/gender/select",
    method: "get",
    params: params
  });
};

//获取性别数据源(体检套餐，体检项目使用)
export const getGenderDataSource = params => {
  return request({
    url: "/api/project/gender/select",
    method: "get",
    params: params
  });
};

//获取套餐分类数据源
export const getPackageTypeDataSource = params => {
  return request({
    url: "/api/packagetype/select",
    method: "get",
    params: params
  });
};

//获取项目单项数据源
export const getProjectItemDataSource = params => {
  return request({
    url: "/api/itemsingle/select",
    method: "get",
    params: params
  });
};

//获取在职状态数据源
export const getWorkingStatusDataSource = params => {
  return request({
    url: "/api/employee/workingstatus/select",
    method: "get",
    params: params
  });
};

//获取职位数据源
export const getPositionDataSource = params => {
  return request({
    url: "/api/company/position/select",
    method: "get",
    params: params
  });
};

