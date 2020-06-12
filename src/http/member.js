import request from "./request";

// 积分
export const getIntegrals = (params) => {
  return request({
    url: "/api/integral/list",
    method: "get",
    params:params
  });
};

export const getIntegralRecords = (params) => {
  return request({
    url: "/api/integralrecord/list",
    method: "get",
    params:params
  });
};


//用户
export const getUsers = (params) => {
  return request({
    url: "/api/user/list",
    method: "get",
    params:params
  });
};


export const getUserDetails = (params) => {
  return request({
    url: "/api/user/details",
    method: "get",
    params:params
  });
};