import request from "./request";

//#region 职工单位
// 获取职工单位信息列表
export const getEmployeeUnitls = params => {
  return request({
    url: "/api/company/list",
    method: "get",
    params: params
  });
};

//#endregion

//#region 职位
// 获取职位信息列表
export const getPositions = params => {
  return request({
    url: "/api/company/position/list",
    method: "get",
    params: params
  });
};

//插入职位信息
export const addPosition = params => {
  return request({
    url: "/api/company/position/insert",
    method: "post",
    params: params
  });
};

//获取职位信息详情
export const addPosition1 = params => {
  return request({
    url: "/api/company/position/insert",
    method: "post",
    params: params
  });
};

//#endregion
