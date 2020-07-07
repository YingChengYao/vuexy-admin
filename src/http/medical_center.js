import request from "./request";

//#region 体检中心
//获取体检中心集合
export const getMedicalCenters = params => {
  return request({
    url: "/api/mec/list",
    method: "get",
    params: params
  });
};

//获取体检中心详情
export const getMedicalCenterDetail = params => {
  return request({
    url: "/api/item/single/details",
    method: "get",
    params: params
  });
};

//添加体检中心
export const addMedicalCenter = params => {
  console.log(4);
  return request({
    url: "/api/mec/insert",
    method: "post",
    params: params
  });
};

//修改体检中心
export const editMedicalCenter = params => {
  return request({
    url: "/api/mec/update",
    method: "post",
    params: params
  });
};
//#endregion
