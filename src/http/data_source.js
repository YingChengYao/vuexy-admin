import request from "./request";

export const getDataStatusDataSource = params => {
  return request({
    url: "api/status/select",
    method: "get",
    params: params
  });
};

//#region 体检套餐相关
//获取项目分类数据源
export const getProjectTypeDataSource = params => {
  return request({
    url: "/api/itemtype/select",
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

//#endregion

//获取婚姻状况数据源(用户)
export const getMaritalForUserDataSource = params => {
  return request({
    url: "/api/user/marital/select",
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

//#region 体检计划
//获取计划的标准数据源
export const getStandardForPlanDataSource = params => {
  return request({
    url: "/api/plan/standard/select",
    method: "get",
    params: params
  });
};
//获取计划类型数据源
export const getPlanTypeDataSource = params => {
  return request({
    url: "/api/plan/type/select",
    method: "get",
    params: params
  });
};

//获取计划状态数据源
export const getPlanStatusDataSource = params => {
  return request({
    url: "/api/plan/status/select",
    method: "get",
    params: params
  });
};
//#endregion

//#region 职工相关
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

//获取单位所属行业数据源
export const getIndustryDataSource = params => {
  return request({
    url: "/api/company/industry/select",
    method: "get",
    params: params
  });
};

//获取下属单位数据源
export const getSubordinateUnitDataSource = params => {
  return request({
    url: "/api/company/select",
    method: "get",
    params: params
  });
};
//#endregion

//#region 体检中心
//获取体检中心等级数据源
export const getMedicalCenterGradeDataSource = params => {
  return request({
    url: "/api/physical/grade/select",
    method: "get",
    params: params
  });
};
//获取体检中心性质数据源
export const getMedicalCenterNatureDataSource = params => {
  return request({
    url: "/api/physical/nature/select",
    method: "get",
    params: params
  });
};
//获取体检中心数据源
export const getMedicalCenterDataSource = params => {
  return request({
    url: "/api/physical/select",
    method: "get",
    params: params
  });
};
//#endregion

//#region 省市区
//获取省数据源
export const getProvinceDataSource = params => {
  return request({
    url: "/api/province/select",
    method: "get",
    params: params
  });
};

//获取市数据源
export const getCityDataSource = params => {
  return request({
    url: "/api/city/select",
    method: "get",
    params: params
  });
};

//获取区数据源
export const getCountyDataSource = params => {
  return request({
    url: "/api/county/select",
    method: "get",
    params: params
  });
};
//#endregion

//#region 菜单
//获取计划状态数据源
export const getMenusDataSource = params => {
  return request({
    url: "/api/menu/select",
    method: "get",
    params: params
  });
};
//#endregion

//#region 用户管理
//配置用户角色
export const getPlatformTypeDataSource = params => {
  return request({
    url: "/api/usertype/select",
    method: "get",
    params: params
  });
};
//#endregion
