import request from "./request";

export const requestLogin = params => {
  return request({
    url: "/api/login",
    method: "post",
    params: params
  });
};

//获取登录Code
export const getLoginCode = params => {
  return request({
    url: "/api/mix/code",
    method: "get",
    params: params
  });
};

//获取路由
export function getRoutes(params) {
  return request({
    url: "/api/menu/list",
    method: "get",
    params: params
  });
}
