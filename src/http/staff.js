import request from "./request";

//#region 职工单位
// 获取职工单位信息列表
export const getEmployeeUnits = params => {
  return request({
    url: "/api/company/list",
    method: "get",
    params: params
  });
};

//添加职工单位
export const addEmployeeUnit = params => {
  return request({
    url: "/api/company/insert",
    method: "post",
    params: params
  });
};

//修改职工单位
export const editEmployeeUnit = params => {
  return request({
    url: "/api/company/update",
    method: "post",
    params: params
  });
};

//获取职工单位详情
export const getEmployeeUnitDetail = params => {
  return request({
    url: "/api/company/details",
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
export const editPosition = params => {
  return request({
    url: "/api/company/position/update",
    method: "post",
    params: params
  });
};

//#endregion

//#region 职工
// 获取职工信息列表
export const getEmployees = params => {
  return request({
    url: "/api/employee/list",
    method: "get",
    params: params
  });
};

//获取单个员工详情信息
export const getEmployeesDetails = params => {
  return request({
    url: "/api/employee/details",
    method: "get",
    params: params
  });
};

//插入职工信息
export const addEmployee = params => {
  return request({
    url: "/api/employee/insert",
    method: "post",
    params: params
  });
};

//修改职工信息
export const editEmployee = params => {
  return request({
    url: "/api/employee/update",
    method: "post",
    params: params
  });
};

//修改职工的职位信息
export const deployPositionForEmployee = params => {
  return request({
    url: "/api/employee/position/update",
    method: "post",
    params: params
  });
};

//#endregion
