import request from "./request";

export const requestLogin = (name, pwd) => {
  return request("/auth/login", {
    username: name,
    password: pwd,
  });
};

//获取登录Code
export const loginCode = params => {
  return request({
    url: "/api/mix/code",
    method: "get",
    params: params
  });
};
