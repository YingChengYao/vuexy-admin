import request from "./request";

// 积分
export const getIntegrals = params => {
  return request({
    url: "/api/integral/list",
    method: "get",
    params: params
  });
};
//获取积分明细
export const getIntegralRecords = params => {
  return request({
    url: "/api/integralrecord/list",
    method: "get",
    params: params
  });
};

//添加积分
export const addIntegra = params => {
  return request({
    url: "/api/integral/join",
    method: "post",
    params: params
  });
};

//消费积分
export const spendIntegra = params => {
  return request({
    url: "/api/integral/out",
    method: "post",
    params: params
  });
};

//用户
//获取用户列表
export const getUsers = params => {
  return request({
    url: "/api/user/list",
    method: "get",
    params: params
  });
};

//获取用户详情
export const getUserDetails = params => {
  return request({
    url: "/api/user/details",
    method: "get",
    params: params
  });
};

//新增用户
export const addUser = params => {
  return request({
    url: "/api/user/insert",
    method: "post",
    params: params
  });
};

//修改用户
export const updateUser = params => {
  return request({
    url: "/api/user/update",
    method: "post",
    params: params
  });
};

//钱包
//获取钱包明细
export const getWalletRecords = params => {
  return request({
    url: "/api/walletrecord/list",
    method: "get",
    params: params
  });
};

//添加金额
export const addWallet = params => {
  return request({
    url: "/api/wallet/join",
    method: "post",
    params: params
  });
};

//消费金额
export const spendWallet = params => {
  return request({
    url: "/api/wallet/out",
    method: "post",
    params: params
  });
};
