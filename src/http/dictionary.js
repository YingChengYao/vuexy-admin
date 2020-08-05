import request from "./request";

//获取字典列表信息
export const getSysDictionarys = params => {
  return request({
    url: "/api/dicroot/list",
    method: "get",
    params: params
  });
};

//获取字典详情信息
export const getSysDictionaryDetail = params => {
  return request({
    url: "/api/dicroot/details",
    method: "get",
    params: params
  });
};

//添加字典信息
export const addSysDictionary = params => {
  return request({
    url: "/api/dicroot/insert",
    method: "post",
    params: params
  });
};

//修改字典信息
export const updateSysDictionary = params => {
  return request({
    url: "/api/dicroot/update",
    method: "post",
    params: params
  });
};
