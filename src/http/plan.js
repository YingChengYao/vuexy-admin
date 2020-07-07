import request from "./request";
import qs from "qs";

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
    params: params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
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

//获取体检计划专属套餐列表
export const getExclusivePackages = params => {
  return request({
    url: "/api/plan/physical/package/list",
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
