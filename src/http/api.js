import request from "./request";

export function getRoutes(params) {
  return request({
    url: "/route/getRoutes",
    method: "get",
  },{
    params: params
  });
}

