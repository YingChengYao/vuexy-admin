import request from "./request";

//#region 体检计划
// 获取体检计划信息列表
export const getPlans = params => {
  return request({
    url: "/api/plan/list",
    method: "get",
    params: params
  });
};

//添加体检计划
export const addPlan = params => {
  return request({
    url: "/api/plan/insert",
    method: "post",
    params: params
  });
};

//修改体检计划
export const editPlan = params => {
  return request({
    url: "/api/plan/update",
    method: "post",
    params: params
  });
};

//获取体检计划详情
export const getPlanDetail = params => {
  return request({
    url: "/api/plan/details",
    method: "get",
    params: params
  });
};

//提交体检计划
export const submitPlan = params => {
  return request({
    url: "/api/plan/submit",
    method: "post",
    params: params
  });
};

//完成体检计划
export const savePlan = params => {
  return request({
    url: "/api/plan/examine",
    method: "post",
    params: params
  });
};

//中止体检计划
export const abortPlan = params => {
  return request({
    url: "/api/plan/invalid",
    method: "post",
    params: params
  });
};

//审核体检计划
export const auditPlan = params => {
  return request({
    url: "/api/plan/stopaddpackage",
    method: "post",
    params: params
  });
};

//添加体检计划的职工名单
export const addEmployeeForPlan = params => {
  return request({
    url: "/api/plan/employee/insert",
    method: "post",
    params: params
  });
};
//修改体检计划的职工名单
export const editEmployeeForPlan = params => {
  return request({
    url: "/api/plan/employee/update",
    method: "post",
    params: params
  });
};

//添加或修改体检计划的职工名单
export const addOrEditEmployeeForPlan = params => {
  return request({
    url: "/api/plan/employee/add",
    method: "post",
    params: params
  });
};

//获取体检计划的标准列表
export const getStandards = params => {
  return request({
    url: "/api/plan/standard/list",
    method: "get",
    params: params
  });
};
//添加体检计划的标准
export const addStandard = params => {
  return request({
    url: "/api/plan/standard/insert",
    method: "post",
    params: params
  });
};

//修改体检计划的标准
export const editStandard = params => {
  return request({
    url: "/api/plan/standard/update",
    method: "post",
    params: params
  });
};

//获取体检计划的标准信息
export const getStandardDetail = params => {
  return request({
    url: "/api/plan/standard/details",
    method: "get",
    params: params
  });
};

//获取体检计划的体检中心
export const getPlanPhysicals = params => {
  return request({
    url: "/api/plan/physical/list",
    method: "get",
    params: params
  });
};

//获取体检计划的专属套餐
export const getPlanPackages = params => {
  return request({
    url: "/api/plan/package/list",
    method: "get",
    params: params
  });
};


//获取体检计划的专属套餐的项目信息
export const getProjectsForPlan = params => {
  return request({
    url: "/api/plan/package/item/list",
    method: "get",
    params: params
  });
};

//#endregion

//#region 体检计划(体检中心)
// 获取体检计划信息列表
export const getPlansForPhysical = params => {
  return request({
    url: "/api/physical/plan/list",
    method: "get",
    params: params
  });
};

//添加专属套餐
export const addExclusivePackage = params => {
  return request({
    url: "/api/plan/physical/package/insert",
    method: "post",
    params: params
  });
};

//修改专属套餐
export const editExclusivePackage = params => {
  return request({
    url: "/api/plan/physical/package/update",
    method: "post",
    params: params
  });
};

//获取体检计划专属套餐列表
export const getExclusivePackages = params => {
  return request({
    url: "/api/plan/physical/package/list",
    method: "get",
    params: params
  });
};

//获取体检计划专属套餐详情
export const getExclusivePackageDetail = params => {
  return request({
    url: "/api/plan/physical/package/details",
    method: "get",
    params: params
  });
};

//获取体检计划专属套餐配置项目
export const getExclusivePackageProject = params => {
  return request({
    url: "/api/plan/physical/package/item/list",
    method: "get",
    params: params
  });
};

//#endregion

//#region 体检动态
// 获取体检计划信息列表
export const getPhysicalExaminations = params => {
  return request({
    url: "/api/plan/examination/trends",
    method: "get",
    params: params
  });
};
// 获取体检计划信息详情
export const getPhysicalExaminationDetail = params => {
  return request({
    url: "/api/plan/employee/examination/trends",
    method: "get",
    params: params
  });
};
//#endregion